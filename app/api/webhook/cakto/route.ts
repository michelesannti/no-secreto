import { NextResponse } from "next/server";
import { createHash, randomBytes } from "crypto";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("📩 Webhook recebido da Cakto:", JSON.stringify(body, null, 2));

    const event = body?.event;
    const email = body?.data?.customer?.email?.trim().toLowerCase();
    const name = body?.data?.customer?.name;
    const affiliateEmail = body?.data?.affiliate;

    if (!email) {
      console.error("❌ Email não encontrado no webhook");
      return NextResponse.json(
        { error: "Email não encontrado" },
        { status: 400 }
      );
    }

    // Busca profile existente para verificar se é conta GRATUITO
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id, acesso")
      .eq("email", email)
      .maybeSingle();

    // ==========================================================
    // 1. INATIVAÇÃO DE ACESSO (Bloqueio)
    // ==========================================================
    const isRefundOrChargeback = event === "refund" || event === "chargeback";
    const isCancelEvent =
      event === "subscription_canceled" ||
      event === "subscription_renewal_refused";

    if (isRefundOrChargeback || isCancelEvent) {
      if (existingProfile?.acesso === "GRATUITO") {
        console.log(`🛡️ Evento ${event} ignorado pois o acesso é GRATUITO: ${email}`);
        return NextResponse.json({
          success: true,
          message: "Acesso mantido por ser conta GRATUITO",
        });
      }

      const novoStatusAcesso = isRefundOrChargeback ? "REEMBOLSO" : "CANCELADO";

      const { error } = await supabase
        .from("profiles")
        .update({
          ativo: false,
          acesso: novoStatusAcesso,
        })
        .eq("email", email);

      if (error) {
        console.error("❌ Erro ao inativar usuário no Supabase:", error);
        return NextResponse.json(
          { error: "Erro ao atualizar perfil" },
          { status: 500 }
        );
      }

      console.log(`🚫 Acesso inativado (${novoStatusAcesso}) para: ${email}`);
      return NextResponse.json({ success: true });
    }

    // ==========================================================
    // 2. LIBERAÇÃO / RENOVAÇÃO / REATIVAÇÃO DE ACESSO
    // ==========================================================
    const isNewPurchase =
      event === "purchase_approved" || event === "subscription_created";

    const isRenewalOrResume =
      event === "subscription_renewed" || event === "subscription_resumed";

    const isApprovalEvent = isNewPurchase || isRenewalOrResume;

    if (!isApprovalEvent) {
      console.log("ℹ️ Evento da Cakto não mapeado ou ignorado:", event);
      return NextResponse.json({ success: true });
    }

    // Busca afiliada pelo e-mail caso exista
    let creatorOrigem: string | null = null;
    if (affiliateEmail) {
      const { data: creator } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", affiliateEmail)
        .maybeSingle();

      if (creator) {
        creatorOrigem = creator.id;
      }
    }

    // Busca usuário no Supabase Auth
    const { data: usersList, error: listError } = await supabase.auth.admin.listUsers();

    if (listError) {
      console.error("❌ Erro ao listar usuários no Supabase Auth:", listError);
      return NextResponse.json(
        { error: "Erro ao buscar usuário" },
        { status: 500 }
      );
    }

    let existingUser = usersList.users.find((u) => u.email === email);
    let userId = existingUser?.id;

    // Se a usuária não existe no Auth, cria ela sem senha pré-definida
    if (!userId) {
      const { data: userData, error: createError } = await supabase.auth.admin.createUser({
        email,
        email_confirm: true,
      });

      if (createError) {
        console.error("❌ Erro ao criar usuário no Auth:", createError);
        return NextResponse.json(
          { error: "Erro ao criar usuário" },
          { status: 500 }
        );
      }

      userId = userData.user.id;
      console.log("✅ Usuário criado no Auth:", userId);
    }

    const novoAcesso = existingProfile?.acesso === "GRATUITO" ? "GRATUITO" : "PAGO";

    // Atualiza ou insere o perfil com ativo = true
    const { error: upsertError } = await supabase
      .from("profiles")
      .upsert({
        id: userId,
        email,
        nome: name || null,
        ativo: true,
        acesso: novoAcesso,
        creator_origem: creatorOrigem,
      });

    if (upsertError) {
      console.error("❌ Erro ao atualizar perfil na tabela profiles:", upsertError);
      return NextResponse.json(
        { error: "Erro ao salvar profile" },
        { status: 500 }
      );
    }

    // Gera o token de primeiro acesso APENAS na primeira compra
    if (isNewPurchase) {
      try {
        const rawToken = randomBytes(32).toString("hex");
        const tokenHash = createHash("sha256").update(rawToken).digest("hex");
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

        await supabase
          .from("first_access_tokens")
          .update({ used_at: new Date().toISOString() })
          .eq("user_id", userId)
          .is("used_at", null);

        await supabase
          .from("first_access_tokens")
          .insert({
            user_id: userId,
            token_hash: tokenHash,
            expires_at: expiresAt,
          });

        console.log("🔑 Token de primeiro acesso gerado com sucesso para:", email);
      } catch (tokenErr) {
        console.error("⚠️ Erro ao gerar token de primeiro acesso:", tokenErr);
      }
    } else {
      console.log(`🔄 Renovação/Reativação realizada com sucesso (sem gerar novo token) para: ${email}`);
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("❌ Erro interno no processamento do webhook:", err);
    return NextResponse.json(
      { error: "Erro interno" },
      { status: 500 }
    );
  }
}
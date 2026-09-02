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

    console.log("📩 Webhook recebido:", JSON.stringify(body, null, 2));

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

    // ==========================
    // REEMBOLSO OU CANCELAMENTO
    // ==========================
    if (event === "refund" || event === "chargeback" || event === "subscription_canceled") {
      const { error } = await supabase
        .from("profiles")
        .update({
          ativo: false,
          acesso: "CANCELADO",
        })
        .eq("email", email);

      if (error) {
        console.error("❌ Erro ao cancelar acesso:", error);
        return NextResponse.json(
          { error: "Erro ao cancelar acesso" },
          { status: 500 }
        );
      }

      console.log("🚫 Acesso cancelado");
      return NextResponse.json({ success: true });
    }

    // ==========================
    // COMPRA APROVADA
    // ==========================
    if (event !== "purchase_approved" && event !== "subscription_renewed") {
      console.log("ℹ️ Evento ignorado:", event);
      return NextResponse.json({ success: true });
    }

    // Procura afiliada pelo email
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

    // Procura usuário no Auth
    const { data: usersList, error: listError } = await supabase.auth.admin.listUsers();

    if (listError) {
      console.error("❌ Erro ao listar usuários:", listError);
      return NextResponse.json(
        { error: "Erro ao buscar usuário" },
        { status: 500 }
      );
    }

    let existingUser = usersList.users.find((u) => u.email === email);
    let userId = existingUser?.id;

    // Cria usuário se não existir
    if (!userId) {
      const { data: userData, error: createError } = await supabase.auth.admin.createUser({
        email,
        email_confirm: true,
      });

      if (createError) {
        console.error("❌ Erro ao criar usuário:", createError);
        return NextResponse.json(
          { error: "Erro ao criar usuário" },
          { status: 500 }
        );
      }

      userId = userData.user.id;
      console.log("✅ Usuário criado:", userId);
    }

    // Atualiza profile
    const { error: upsertError } = await supabase
      .from("profiles")
      .upsert({
        id: userId,
        email,
        nome: name || null,
        ativo: true,
        acesso: "PAGO",
        creator_origem: creatorOrigem,
      });

    if (upsertError) {
      console.error("❌ Erro ao salvar profile:", upsertError);
      return NextResponse.json(
        { error: "Erro ao salvar profile" },
        { status: 500 }
      );
    }

    // Gera token de Primeiro Acesso e deixa pronto no banco
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
      // Disparo de e-mail automático desativado para a cliente solicitar diretamente na tela de login/primeiro-acesso.
    } catch (tokenErr) {
      console.error("⚠️ Erro ao gerar token de primeiro acesso:", tokenErr);
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("❌ Erro geral no webhook:", err);
    return NextResponse.json(
      { error: "Erro interno" },
      { status: 500 }
    );
  }
}
import { NextResponse } from "next/server";
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
    const email = body?.data?.customer?.email;
    const name = body?.data?.customer?.name;
    const affiliateEmail = body?.data?.affiliate;

    if (!email) {
      console.error("❌ Email não encontrado no webhook");

      return NextResponse.json(
        { error: "Email não encontrado" },
        { status: 400 }
      );
    }

    console.log("📌 Evento:", event);
    console.log("📧 Email:", email);
    console.log("👤 Nome:", name);
    console.log("🤝 Afiliada:", affiliateEmail);

    // ==========================
    // REEMBOLSO
    // ==========================

    if (event === "refund") {
      const { error } = await supabase
        .from("profiles")
        .update({
          ativo: false,
          acesso: "REEMBOLSO",
        })
        .eq("email", email);

      if (error) {
        console.error("❌ Erro ao cancelar acesso:", error);

        return NextResponse.json(
          { error: "Erro ao cancelar acesso" },
          { status: 500 }
        );
      }

      console.log("🚫 Acesso cancelado por reembolso");

      return NextResponse.json({ success: true });
    }

    // ==========================
    // COMPRA APROVADA
    // ==========================

    if (event !== "purchase_approved") {
      console.log("ℹ️ Evento ignorado:", event);

      return NextResponse.json({ success: true });
    }

    // ==========================
    // Procura afiliada pelo email
    // ==========================

    let creatorOrigem: string | null = null;

    if (affiliateEmail) {
      const { data: creator } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", affiliateEmail)
        .single();

      if (creator) {
        creatorOrigem = creator.id;
        console.log("✅ Creator origem:", creatorOrigem);
      } else {
        console.log("⚠️ Afiliada não encontrada no banco.");
      }
    } else {
      console.log("ℹ️ Compra da produtora (sem afiliada).");
    }

    // ==========================
    // Procura usuário
    // ==========================

    const { data: usersList, error: listError } =
      await supabase.auth.admin.listUsers();

    if (listError) {
      console.error("❌ Erro ao listar usuários:", listError);

      return NextResponse.json(
        { error: "Erro ao buscar usuário" },
        { status: 500 }
      );
    }

    let existingUser = usersList.users.find(
      (u) => u.email === email
    );

    let userId = existingUser?.id;

    // ==========================
    // Cria usuário se não existir
    // ==========================

    if (!userId) {
      const { data: userData, error: createError } =
        await supabase.auth.admin.createUser({
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
    } else {
      console.log("♻️ Usuário já existe:", userId);
    }

    // ==========================
    // Atualiza profile
    // ==========================

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

    console.log("🔥 Acesso liberado com sucesso");

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("❌ Erro geral no webhook:", err);

    return NextResponse.json(
      { error: "Erro interno" },
      { status: 500 }
    );
  }
}
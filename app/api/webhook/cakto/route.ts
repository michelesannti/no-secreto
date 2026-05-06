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

    // ✅ ESTRUTURA CORRETA DA CAKTO
    const email = body?.data?.customer?.email;
    const name = body?.data?.customer?.name;

    if (!email) {
      console.error("❌ Email não encontrado no webhook");
      return NextResponse.json({ error: "Email não encontrado" }, { status: 400 });
    }

    console.log("📧 Email:", email);
    console.log("👤 Nome:", name);

    // 🔍 tenta encontrar usuário existente
    const { data: usersList, error: listError } =
      await supabase.auth.admin.listUsers();

    if (listError) {
      console.error("❌ Erro ao listar usuários:", listError);
      return NextResponse.json({ error: "Erro ao buscar usuário" }, { status: 500 });
    }

    let existingUser = usersList.users.find((u) => u.email === email);
    let userId = existingUser?.id;

    // 👤 cria usuário se não existir
    if (!userId) {
      const { data: userData, error: createError } =
        await supabase.auth.admin.createUser({
          email,
          email_confirm: true,
        });

      if (createError) {
        console.error("❌ Erro ao criar usuário:", createError);
        return NextResponse.json({ error: "Erro ao criar usuário" }, { status: 500 });
      }

      userId = userData.user.id;
      console.log("✅ Usuário criado:", userId);
    } else {
      console.log("♻️ Usuário já existe:", userId);
    }

    // 🔥 cria ou atualiza profile COM NOME
    const { error: upsertError } = await supabase.from("profiles").upsert({
      id: userId,
      email,
      nome: name || null,
      ativo: true,
    });

    if (upsertError) {
      console.error("❌ Erro ao salvar profile:", upsertError);
      return NextResponse.json({ error: "Erro ao salvar profile" }, { status: 500 });
    }

    console.log("🔥 Acesso liberado com sucesso");

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("❌ Erro geral no webhook:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
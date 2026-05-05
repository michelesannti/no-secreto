import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("Webhook recebido:", body);

    const email =
      body?.customer?.email ||
      body?.email ||
      body?.buyer?.email;

    if (!email) {
      return NextResponse.json(
        { error: "Email não encontrado" },
        { status: 400 }
      );
    }

    // cria usuário
    const { data: userData, error: createError } =
      await supabase.auth.admin.createUser({
        email,
        email_confirm: true,
      });

    let userId = userData?.user?.id;

    // se já existir, busca
    if (createError && createError.message.includes("already registered")) {
      const { data: users } = await supabase.auth.admin.listUsers();
      const existingUser = users.users.find((u) => u.email === email);
      userId = existingUser?.id;
    }

    if (!userId) {
      return NextResponse.json(
        { error: "Erro ao criar usuário" },
        { status: 500 }
      );
    }

    // ativa acesso
    await supabase.from("profiles").upsert({
      id: userId,
      email,
      ativo: true,
    });

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("Erro no webhook:", err);
    return NextResponse.json(
      { error: "Erro interno" },
      { status: 500 }
    );
  }
}
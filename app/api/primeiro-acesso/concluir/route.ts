import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const token = body?.token;
    const password = body?.password;

    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { error: "Token inválido." },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { error: "Senha obrigatória." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "A senha deve ter pelo menos 6 caracteres." },
        { status: 400 }
      );
    }

    const tokenHash = createHash("sha256")
      .update(token)
      .digest("hex");

    const { data: tokenData, error: tokenError } =
      await supabaseAdmin
        .from("first_access_tokens")
        .select("id, user_id, expires_at, used_at")
        .eq("token_hash", tokenHash)
        .maybeSingle();

    if (tokenError || !tokenData) {
      return NextResponse.json(
        { error: "Este link de primeiro acesso é inválido." },
        { status: 400 }
      );
    }

    if (tokenData.used_at) {
      return NextResponse.json(
        { error: "Este link de primeiro acesso já foi utilizado." },
        { status: 400 }
      );
    }

    if (new Date(tokenData.expires_at).getTime() <= Date.now()) {
      return NextResponse.json(
        { error: "Este link de primeiro acesso expirou." },
        { status: 400 }
      );
    }

    // Cria a senha no Supabase Auth
    const { data: updatedUser, error: updateError } =
      await supabaseAdmin.auth.admin.updateUserById(
        tokenData.user_id,
        {
          password,
          user_metadata: {
            has_password: true,
          },
        }
      );

    if (updateError || !updatedUser.user) {
      console.error(
        "Erro ao criar senha:",
        updateError
      );

      return NextResponse.json(
        {
          error:
            "Não foi possível criar sua senha. Tente novamente.",
        },
        { status: 500 }
      );
    }

    // Marca o token como utilizado
    const { error: usedError } = await supabaseAdmin
      .from("first_access_tokens")
      .update({
        used_at: new Date().toISOString(),
      })
      .eq("id", tokenData.id)
      .is("used_at", null);

    if (usedError) {
      console.error(
        "Erro ao marcar token como utilizado:",
        usedError
      );
    }

    return NextResponse.json({
      success: true,
      email: updatedUser.user.email,
    });
  } catch (error) {
    console.error(
      "Erro geral ao concluir primeiro acesso:",
      error
    );

    return NextResponse.json(
      { error: "Erro interno." },
      { status: 500 }
    );
  }
}
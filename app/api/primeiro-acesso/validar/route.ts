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

    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { valid: false, error: "Token inválido." },
        { status: 400 }
      );
    }

    const tokenHash = createHash("sha256")
      .update(token)
      .digest("hex");

    const { data: tokenData, error } = await supabaseAdmin
      .from("first_access_tokens")
      .select("id, user_id, expires_at, used_at")
      .eq("token_hash", tokenHash)
      .maybeSingle();

    if (error || !tokenData) {
      return NextResponse.json({
        valid: false,
        error: "Este link de primeiro acesso é inválido.",
      });
    }

    if (tokenData.used_at) {
      return NextResponse.json({
        valid: false,
        error: "Este link de primeiro acesso já foi utilizado.",
      });
    }

    if (new Date(tokenData.expires_at).getTime() <= Date.now()) {
      return NextResponse.json({
        valid: false,
        error: "Este link de primeiro acesso expirou.",
      });
    }

    return NextResponse.json({
      valid: true,
      userId: tokenData.user_id,
    });
  } catch (error) {
    console.error("Erro ao validar primeiro acesso:", error);

    return NextResponse.json(
      {
        valid: false,
        error: "Não foi possível validar o link.",
      },
      { status: 500 }
    );
  }
}
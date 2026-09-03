import { NextResponse } from "next/server";
import { createHash, randomBytes } from "crypto";
import { createClient } from "@supabase/supabase-js";
import { getResend } from "@/lib/resend";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "E-mail é obrigatório." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 1. Busca perfil ativo pelo e-mail
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("id, email, ativo")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (!profile || !profile.ativo) {
      return NextResponse.json({
        message: "Acesso enviado no email 🤎",
      });
    }

    // 2. Gera token seguro e insere na tabela first_access_tokens
    const rawToken = randomBytes(32).toString("hex");
    const tokenHash = createHash("sha256").update(rawToken).digest("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    await supabaseAdmin
      .from("first_access_tokens")
      .update({ used_at: new Date().toISOString() })
      .eq("user_id", profile.id)
      .is("used_at", null);

    await supabaseAdmin.from("first_access_tokens").insert({
      user_id: profile.id,
      token_hash: tokenHash,
      expires_at: expiresAt,
    });

    const origin =
      process.env.NEXT_PUBLIC_SITE_URL || "https://no-secreto-ten.vercel.app";
    const accessUrl = `${origin}/primeiro-acesso?token=${rawToken}`;

    // 3. Dispara e-mail via Resend (instanciado sob demanda)
    const resend = getResend();

    await resend.emails.send({
      from: "No Secreto <contato@nosecretoapp.com.br>",
      to: [normalizedEmail],
      subject: "Acesso ao No Secreto",
      html: `
        <div style="text-align: center; font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 20px;">
          <p style="
            color: #70412d;
            font-size: 16px;
            line-height: 1.5;
            margin-bottom: 24px;
          ">
            Clique no botão abaixo para criar sua senha 🤎
          </p>

          <p style="margin: 24px 0 32px;">
            <a 
              href="${accessUrl}"
              style="
                background-color: #70412d;
                color: #f9f5e9;
                padding: 12px 24px;
                border-radius: 999px;
                text-decoration: none;
                font-size: 14px;
                display: inline-block;
                font-weight: bold;
              "
            >
              CRIAR MINHA SENHA
            </a>
          </p>

          <p style="
            color: #70412d;
            font-size: 15px;
            line-height: 1.7;
            margin: 0;
          ">
            Suporte:
            <a 
              href="https://wa.me/message/7Y7T2RAQL3VIE1"
              style="
                color: #70412d;
                font-weight: bold;
                text-decoration: underline;
                text-underline-offset: 3px;
              "
            >
              (11) 98387-5882
            </a>
          </p>
        </div>
      `,
    });

    return NextResponse.json({
      message: "Acesso enviado no email 🤎",
    });
  } catch (error) {
    console.error("Erro ao solicitar primeiro acesso:", error);
    return NextResponse.json(
      { error: "Erro ao processar solicitação." },
      { status: 500 }
    );
  }
}
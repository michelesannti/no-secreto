import { NextResponse } from "next/server";
import { resend } from "@/lib/resend";

export async function GET() {
  try {
    const { data, error } = await resend.emails.send({
      from: "No Secreto <suporte@nosecretoapp.com.br>",
      to: ["nosecreto.app@gmail.com"],
      subject: "Teste de e-mail — No Secreto",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 24px;">
          <h2 style="color: #70412d;">Oii! 🤎</h2>
          <p>Esse é um teste de envio com o domínio oficial do No Secreto.</p>
        </div>
      `,
    });

    if (error) {
      console.error("Erro Resend:", error);
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Erro geral:", error);
    return NextResponse.json(
      { error: "Erro ao enviar email." },
      { status: 500 }
    );
  }
}
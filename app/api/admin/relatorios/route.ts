import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Retorna a estrutura para preenchimento dos relatórios manuais/operacionais
    return NextResponse.json({
      instagram: { seguidores: "", visitasPerfil: "", cliquesBio: "" },
      tiktok: { seguidores: "", visitasPerfil: "" },
      supabase: { conteudosPublicados: "" },
      cakto: { vendas: "", vendasAbandonadas: "", vendasAfiliadas: "" },
    });
  } catch (error: any) {
    console.error("Erro na API de relatorios:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({ success: true, data: body });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { obterTextoFormatadoNVI } from "@/lib/biblia-helper";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const livro = searchParams.get("livro");
    const capitulo = parseInt(searchParams.get("capitulo") || "1", 10);
    const inicio = parseInt(searchParams.get("inicio") || "1", 10);
    const fim = parseInt(searchParams.get("fim") || "1", 10);

    if (!livro) {
      return NextResponse.json({ error: "Livro não informado" }, { status: 400 });
    }

    const texto = await obterTextoFormatadoNVI(livro, capitulo, inicio, fim);

    return NextResponse.json({ texto });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
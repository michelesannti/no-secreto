import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

const CAPITULOS_POR_LIVRO: Record<string, number> = {
  "Gênesis": 50, "Êxodo": 40, "Levítico": 27, "Números": 36, "Deuteronômio": 34,
  "Josué": 24, "Juízes": 21, "Rute": 4, "1 Samuel": 31, "2 Samuel": 24,
  "1 Reis": 22, "2 Reis": 25, "1 Crônicas": 29, "2 Crônicas": 36, "Esdras": 10,
  "Neemias": 13, "Ester": 10, "Jó": 42, "Salmos": 150, "Provérbios": 31,
  "Eclesiastes": 12, "Cânticos": 8, "Isaías": 66, "Jeremias": 52, "Lamentações": 5,
  "Ezequiel": 48, "Daniel": 12, "Oséias": 14, "Joel": 3, "Amós": 9,
  "Obadias": 1, "Jonas": 4, "Miquéias": 7, "Naum": 3, "Habacuque": 3,
  "Sofonias": 3, "Ageu": 2, "Zacarias": 14, "Malaquias": 4, "Mateus": 28,
  "Marcos": 16, "Lucas": 24, "João": 21, "Atos": 28, "Romanos": 16,
  "1 Coríntios": 16, "2 Coríntios": 13, "Gálatas": 6, "Efésios": 6, "Filipenses": 4,
  "Colossenses": 4, "1 Tessalonicenses": 5, "2 Tessalonicenses": 3, "1 Timóteo": 6,
  "2 Timóteo": 4, "Tito": 3, "Filemom": 1, "Hebreus": 13, "Tiago": 5,
  "1 Pedro": 5, "2 Pedro": 3, "1 João": 5, "2 João": 1, "3 João": 1,
  "Judas": 1, "Apocalipse": 22
};

const LIVROS_ORDEM = Object.keys(CAPITULOS_POR_LIVRO);

// Helper para gerar o slug limpo (ex: "genesis-33")
function toSlug(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-");
}

export async function GET() {
  try {
    // Busca o ultimo registro cadastrado bypassando o RLS com o service role
    const { data: ultimoEstudo, error } = await supabaseAdmin
      .from("estudos")
      .select("id, livro, capitulo, jornada_ordem")
      .order("id", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Erro ao buscar último estudo:", error);
      throw error;
    }

    if (!ultimoEstudo) {
      return NextResponse.json({
        proximoLivro: "Gênesis",
        proximoCapitulo: 1,
        proximaJornadaOrdem: 1,
      });
    }

    const { livro, capitulo, jornada_ordem } = ultimoEstudo;
    const totalCapitulos = CAPITULOS_POR_LIVRO[livro] || 1;

    let proximoLivro = livro;
    let proximoCapitulo = capitulo + 1;
    const proximaJornadaOrdem = (jornada_ordem ?? capitulo) + 1;

    // Se o ultimo capitulo cadastrado for o ultimo do livro, avança para o proximo livro
    if (capitulo >= totalCapitulos) {
      const idxAtual = LIVROS_ORDEM.indexOf(livro);
      if (idxAtual !== -1 && idxAtual < LIVROS_ORDEM.length - 1) {
        proximoLivro = LIVROS_ORDEM[idxAtual + 1];
        proximoCapitulo = 1;
      }
    }

    return NextResponse.json({
      proximoLivro,
      proximoCapitulo,
      proximaJornadaOrdem,
      ultimoEstudo,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Erro ao consultar o banco." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { livro, capitulo, blocos, jornada_ordem } = body;

    if (!livro || !capitulo || !Array.isArray(blocos) || blocos.length === 0) {
      return NextResponse.json(
        { error: "Dados inválidos para cadastro dos estudos." },
        { status: 400 }
      );
    }

    const numCapitulo = Number(capitulo);
    const jornadaExibicao = `${livro} ${numCapitulo}`;
    const jornadaSlug = `${toSlug(livro)}-${numCapitulo}`;

    // Busca a ultima ordem geral de estudos registrada
    const { data: maiorOrdemData } = await supabaseAdmin
      .from("estudos")
      .select("ordem")
      .order("ordem", { ascending: false })
      .limit(1)
      .maybeSingle();

    let ultimaOrdem = maiorOrdemData?.ordem ?? 0;

    const estudosParaInserir = blocos.map((bloco: any) => {
      ultimaOrdem += 1;
      return {
        livro,
        capitulo: numCapitulo,
        jornada: jornadaSlug,
        jornada_exibicao: jornadaExibicao,
        jornada_ordem: jornada_ordem ?? numCapitulo,
        ordem: ultimaOrdem,
        versiculo_inicio: Number(bloco.versiculo_inicio),
        versiculo_fim: Number(bloco.versiculo_fim),
        texto: bloco.texto || "",
        contexto: bloco.contexto || "",
        aplicacao: bloco.aplicacao || "",
        destaque: bloco.destaque || "",
      };
    });

    const { error: insertError } = await supabaseAdmin
      .from("estudos")
      .insert(estudosParaInserir);

    if (insertError) {
      console.error("Erro ao inserir estudos:", insertError);
      throw insertError;
    }

    return NextResponse.json({
      message: `Estudos do capítulo ${jornadaExibicao} registrados com sucesso 🤎`,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Erro ao salvar estudos." }, { status: 500 });
  }
}
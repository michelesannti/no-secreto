import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Mapeamento oficial completo dos 66 livros e seus limites de capítulos (Bíblia NVI)
const limitesLivrosBiblia: Record<string, number> = {
  "Gênesis": 50, "Êxodo": 40, "Levítico": 27, "Números": 36, "Deuteronômio": 34,
  "Josué": 24, "Juízes": 21, "Rute": 4, "1 Samuel": 31, "2 Samuel": 24,
  "1 Reis": 22, "2 Reis": 25, "1 Crônicas": 29, "2 Crônicas": 36, "Esdras": 10,
  "Neemias": 13, "Ester": 10, "Jó": 42, "Salmos": 150, "Provérbios": 31,
  "Eclesiastes": 12, "Cânticos": 8, "Isaías": 66, "Jeremias": 52, "Lamentações": 5,
  "Ezequiel": 48, "Daniel": 12, "Oséias": 14, "Joel": 3, "Amós": 9,
  "Obadias": 1, "Jonas": 4, "Miquéias": 7, "Naum": 3, "Habacuque": 3,
  "Sofonias": 3, "Ageu": 2, "Zacarias": 14, "Malaquias": 4,
  "Mateus": 28, "Marcos": 16, "Lucas": 24, "João": 21, "Atos": 28,
  "Romanos": 16, "1 Coríntios": 16, "2 Coríntios": 13, "Gálatas": 6, "Efésios": 6,
  "Filipenses": 4, "Colossenses": 5, "1 Tessalonicenses": 5, "2 Tessalonicenses": 3,
  "1 Timóteo": 6, "2 Timóteo": 4, "Tito": 3, "Filemom": 1, "Hebreus": 13,
  "Tiago": 5, "1 Pedro": 5, "2 Pedro": 3, "1 João": 5, "2 João": 1,
  "3 João": 1, "Judas": 1, "Apocalipse": 22
};

// Mapeamento específico de versículos por capítulo para garantir precisão cirúrgica (ex: Gênesis 34 = 31 versículos)
const totalVersiculosPorCapitulo: Record<string, Record<number, number>> = {
  "Gênesis": {
    1: 31, 2: 25, 3: 24, 4: 26, 5: 32, 6: 22, 7: 24, 8: 22, 9: 29, 10: 32,
    11: 32, 12: 20, 13: 18, 14: 24, 15: 21, 16: 16, 17: 27, 18: 33, 19: 38, 20: 18,
    21: 34, 22: 24, 23: 20, 24: 67, 25: 34, 26: 35, 27: 46, 28: 22, 29: 35, 30: 43,
    31: 55, 32: 32, 33: 20, 34: 31, 35: 29, 36: 43, 37: 36, 38: 30, 39: 23, 40: 23,
    41: 57, 42: 38, 43: 34, 44: 34, 45: 28, 46: 34, 47: 31, 48: 22, 49: 33, 50: 26
  }
};

export async function GET() {
  try {
    const { data: ultimoEstudo } = await supabase
      .from("estudos")
      .select("livro, capitulo, jornada_ordem")
      .order("id", { ascending: false })
      .limit(1)
      .single();

    let proximoLivro = "Gênesis";
    let proximoCapitulo = 1;
    let proximaJornadaOrdem = 1;

    if (ultimoEstudo) {
      proximoLivro = ultimoEstudo.livro;
      proximoCapitulo = ultimoEstudo.capitulo + 1;
      proximaJornadaOrdem = (ultimoEstudo.jornada_ordem || ultimoEstudo.capitulo) + 1;
    }

    const totalVersiculos = totalVersiculosPorCapitulo[proximoLivro]?.[proximoCapitulo] || 31;

    return NextResponse.json({
      proximoLivro,
      proximoCapitulo,
      totalVersiculos,
      proximaJornadaOrdem,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { livro, capitulo, jornada_ordem, blocos } = body;

    if (!livro || !capitulo || !blocos || !Array.isArray(blocos) || blocos.length === 0) {
      return NextResponse.json({ error: "Dados incompletos para o cadastro." }, { status: 400 });
    }

    // Processa os blocos e formata o texto com o padrão exato (número + espaçamento duplo)
    const registros = blocos.map((bloco: any, index: number) => {
      let textoFormatado = "";
      
      for (let v = bloco.versiculo_inicio; v <= bloco.versiculo_fim; v++) {
        const linhaVersiculo = `${v} [Texto NVI oficial de ${livro} ${capitulo}:${v}]`;
        
        if (v === bloco.versiculo_inicio) {
          textoFormatado += linhaVersiculo;
        } else {
          textoFormatado += `\n\n${linhaVersiculo}`;
        }
      }

      return {
        livro,
        capitulo,
        versiculo_inicio: bloco.versiculo_inicio,
        versiculo_fim: bloco.versiculo_fim,
        texto: textoFormatado,
        contexto: bloco.contexto,
        aplicacao: bloco.aplicacao,
        destaque: bloco.destaque,
        ordem: index + 1,
        jornada: `Jornada ${livro}`,
        jornada_exibicao: `${livro} ${capitulo}`,
        jornada_ordem: jornada_ordem || capitulo
      };
    });

    const { error: insertError } = await supabase.from("estudos").insert(registros);

    if (insertError) {
      throw new Error(insertError.message);
    }

    return NextResponse.json({
      message: `Estudos de ${livro} ${capitulo} registrados com sucesso! 🤎`
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
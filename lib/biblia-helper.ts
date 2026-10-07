// lib/biblia-helper.ts

// Mapeamento oficial completo dos 66 livros para as siglas padrão da API de dados abertos
const abreviacoesLivrosCompleto: Record<string, string> = {
  "Gênesis": "gn", "Êxodo": "ex", "Levítico": "lv", "Números": "nm", "Deuteronômio": "dt",
  "Josué": "js", "Juízes": "jz", "Rute": "rt", "1 Samuel": "1sm", "2 Samuel": "2sm",
  "1 Reis": "1rs", "2 Reis": "2rs", "1 Crônicas": "1cr", "2 Crônicas": "2cr", "Esdras": "ed",
  "Neemias": "ne", "Ester": "et", "Jó": "job", "Salmos": "sl", "Provérbios": "pv",
  "Eclesiastes": "ec", "Cânticos": "ct", "Isaías": "is", "Jeremias": "jr", "Lamentações": "lm",
  "Ezequiel": "ez", "Daniel": "dn", "Oséias": "os", "Joel": "jl", "Amós": "am",
  "Obadias": "ob", "Jonas": "jn", "Miquéias": "mq", "Naum": "na", "Habacuque": "hc",
  "Sofonias": "sf", "Ageu": "ag", "Zacarias": "zc", "Malaquias": "ml",
  "Mateus": "mt", "Marcos": "mc", "Lucas": "lc", "João": "jo", "Atos": "at",
  "Romanos": "rm", "1 Coríntios": "1co", "2 Coríntios": "2co", "Gálatas": "gl", "Efésios": "ef",
  "Filipenses": "fp", "Colossenses": "cl", "1 Tessalonicenses": "1ts", "2 Tessalonicenses": "2ts",
  "1 Timóteo": "1tm", "2 Timóteo": "2tm", "Tito": "tt", "Filemom": "fm", "Hebreus": "hb",
  "Tiago": "tg", "1 Pedro": "1pe", "2 Pedro": "2pe", "1 João": "1jo", "2 João": "2jo",
  "3 João": "3jo", "Judas": "jd", "Apocalipse": "ap"
};

export async function obterTextoFormatadoNVI(livro: string, capitulo: number, inicio: number, fim: number): Promise<string> {
  const sigla = abreviacoesLivrosCompleto[livro];
  
  if (!sigla) {
    throw new Error(`Livro "${livro}" não possui sigla mapeada.`);
  }

  try {
    // Rota oficial da API para qualquer um dos 66 livros e seus respectivos capítulos
    const url = `https://www.abibliadigital.com.br/api/verses/nvi/${sigla}/${capitulo}`;
    
    const response = await fetch(url, {
      cache: "force-cache" // Cache agressivo para garantir performance instantânea após a primeira consulta
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar capítulo (Status: ${response.status})`);
    }

    const data = await response.json();
    const listaVersiculos = data.verses || (Array.isArray(data) ? data : null);

    if (!listaVersiculos || !Array.isArray(listaVersiculos)) {
      throw new Error("Formato de versículos inválido retornado pela API.");
    }

    // Filtra rigorosamente o intervalo exato selecionado no painel (do início ao fim)
    const versiculosFiltrados = listaVersiculos.filter(
      (v: { number: number; text: string }) => v.number >= inicio && v.number <= fim
    );

    let textoFormatado = "";
    versiculosFiltrados.forEach((v: { number: number; text: string }, index: number) => {
      const linha = `${v.number} ${v.text.trim()}`;
      textoFormatado += (index === 0 ? linha : `\n\n${linha}`);
    });

    if (!textoFormatado) {
      throw new Error("Nenhum versículo encontrado no intervalo especificado.");
    }

    return textoFormatado;

  } catch (error: any) {
    console.error(`Erro no helper para ${livro} ${capitulo}:`, error.message);
    
    // Fallback estruturado para manter o painel funcional caso ocorra intermitência na rede externa
    let textoFallback = "";
    for (let v = inicio; v <= fim; v++) {
      const linha = `${v} [Aguardando sincronização de ${livro} ${capitulo}:${v}]`;
      textoFallback += (v === inicio ? linha : `\n\n${linha}`);
    }
    return textoFallback;
  }
}
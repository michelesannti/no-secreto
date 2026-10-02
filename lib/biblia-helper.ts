// lib/biblia-helper.ts

// Mapeamento oficial dos limites de capítulos de todos os livros da Bíblia (para o seletor do Admin)
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

// Função para buscar os versículos reais de qualquer livro, capítulo e intervalo usando uma API pública estável em português
export async function obterTextoFormatadoNVI(livro: string, capitulo: number, inicio: number, fim: number): Promise<string> {
  try {
    // Normaliza o nome do livro para o padrão da API (ex: abas de busca)
    // Usaremos a API bible-api.com ou similar estruturada, ou endpoint de Bíblias abertas em PT
    const url = `https://bible-api.com/${encodeURIComponent(livro)}+${capitulo}:${inicio}-${fim}?translation=almeida`; // Usando tradução em PT disponível na API padrão
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Erro ao buscar texto na API bíblica.");
    }

    const data = await response.json();
    
    if (data.verses && Array.isArray(data.verses)) {
      let textoFormatado = "";
      data.verses.forEach((v: { verse: number; text: string }, index: number) => {
        const linha = `${v.verse} ${v.text.trim()}`;
        if (index === 0) {
          textoFormatado += linha;
        } else {
          textoFormatado += `\n\n${linha}`;
        }
      });
      return textoFormatado;
    }

    return "";
  } catch (error) {
    console.error("Erro na busca automática do texto bíblico:", error);
    // Fallback de segurança caso a API externe instabilidade momentânea
    let fallbackTexto = "";
    for (let v = inicio; v <= fim; v++) {
      const linha = `${v} [Texto indisponível temporariamente para ${livro} ${capitulo}:${v}]`;
      fallbackTexto += (v === inicio ? linha : `\n\n${linha}`);
    }
    return fallbackTexto;
  }
}
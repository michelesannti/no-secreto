// lib/biblia-helper.ts
import fs from 'fs';
import path from 'path';

// Carrega o JSON local da Bíblia NVI uma única vez na inicialização
const filePath = path.join(process.cwd(), 'data/biblia-nvi.json');
let bibliaData: any = null;

try {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  bibliaData = JSON.parse(fileContent);
} catch (error) {
  console.error("Erro ao carregar o arquivo data/biblia-nvi.json:", error);
}

export async function obterTextoFormatadoNVI(livro: string, capitulo: number, inicio: number, fim: number): Promise<string> {
  if (!bibliaData) {
    throw new Error("O arquivo local data/biblia-nvi.json não pôde ser carregado.");
  }

  // Encontra o livro pelo nome (ex: "Gênesis")
  const livroObj = bibliaData.find((l: any) => l.name.toLowerCase() === livro.toLowerCase());

  if (!livroObj) {
    throw new Error(`Livro "${livro}" não encontrado no JSON local.`);
  }

  // O array de capítulos (capitulo 1 está no índice 0)
  const capObj = livroObj.chapters[capitulo - 1];

  if (!capObj || !Array.isArray(capObj)) {
    throw new Error(`Capítulo ${capitulo} não encontrado para ${livro}.`);
  }

  let textoFormatado = "";
  let contador = 0;

  for (let v = inicio; v <= fim; v++) {
    // Cada elemento do array representa um versículo (índice 0 = versículo 1)
    const textoVersiculo = capObj[v - 1];

    if (textoVersiculo) {
      // Dependendo de como o JSON está estruturado, o versículo pode ser uma string direta ou um objeto { number, text }
      const texto = typeof textoVersiculo === 'string' ? textoVersiculo : textoVersiculo.text;
      
      const linha = `${v} ${texto.trim()}`;
      textoFormatado += (contador === 0 ? linha : `\n\n${linha}`);
      contador++;
    }
  }

  if (!textoFormatado) {
    throw new Error("Nenhum versículo encontrado no intervalo solicitado.");
  }

  return textoFormatado;
}
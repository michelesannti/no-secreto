// lib/biblia-helper.ts
import fs from 'fs';
import path from 'path';

export async function obterTextoFormatadoNVI(livro: string, capitulo: number, inicio: number, fim: number): Promise<string> {
  try {
    if (!livro) {
      throw new Error("O nome do livro não foi informado.");
    }

    const filePath = path.join(process.cwd(), 'data', 'biblia-nvi.json');
    
    if (!fs.existsSync(filePath)) {
      throw new Error("Arquivo biblia-nvi.json não encontrado na pasta data.");
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    if (!fileContent || fileContent.trim() === "[]") {
      throw new Error("O arquivo biblia-nvi.json está vazio.");
    }

    const biblia = JSON.parse(fileContent);

    // Normaliza acentos e letras minúsculas para encontrar o livro com total exatidão
    const normalizar = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
    
    const livroObj = biblia.find((l: any) => {
      const nomeLivro = l.name || l.book || "";
      return normalizar(nomeLivro) === normalizar(livro);
    });

    if (!livroObj) {
      throw new Error(`Livro "${livro}" não foi encontrado na base da Bíblia.`);
    }

    // Os capítulos começam no índice 0 (Capítulo 1 = índice 0)
    const capituloIndex = capitulo - 1;
    const versiculosCapitulo = livroObj.chapters[capituloIndex];

    if (!versiculosCapitulo || !Array.isArray(versiculosCapitulo)) {
      throw new Error(`Capítulo ${capitulo} não encontrado para o livro ${livro}.`);
    }

    let textoFormatado = "";
    let contador = 0;

    for (let v = inicio; v <= fim; v++) {
      // No formato oficial, o array de versículos é indexado por (v - 1)
      const textoVersiculo = versiculosCapitulo[v - 1];

      if (textoVersiculo) {
        const linha = `${v} ${textoVersiculo.trim()}`;
        textoFormatado += (contador === 0 ? linha : `\n\n${linha}`);
        contador++;
      }
    }

    if (!textoFormatado) {
      throw new Error(`Nenhum versículo encontrado no intervalo ${inicio}-${fim} para ${livro} ${capitulo}.`);
    }

    return textoFormatado;

  } catch (error: any) {
    console.error("Erro no biblia-helper:", error.message);
    throw new Error(error.message);
  }
}
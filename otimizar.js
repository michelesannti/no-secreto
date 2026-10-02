// otimizar.js
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

async function run() {
  const publicDir = path.join(__dirname, "public");
  const files = fs.readdirSync(publicDir);

  // Filtra apenas imagens originais (.png, .jpg, .jpeg)
  const imagensOriginais = files.filter((file) => {
    const ext = path.extname(file).toLowerCase();
    return [".png", ".jpg", ".jpeg"].includes(ext);
  });

  if (imagensOriginais.length === 0) {
    console.log("✨ Nenhuma imagem nova para otimizar.");
    return;
  }

  for (const file of imagensOriginais) {
    const ext = path.extname(file);
    const baseName = path.basename(file, ext);
    const inputPath = path.join(publicDir, file);
    const outputPath = path.join(publicDir, `${baseName}.webp`);

    try {
      // Define largura inteligente baseada no nome
      let larguraDesejada = 800; // Padrão excelente para feedbacks e imagens maiores
      const nomeLower = baseName.toLowerCase();

      if (nomeLower.includes("logo")) larguraDesejada = 300;
      else if (nomeLower.includes("perfil")) larguraDesejada = 500;
      else if (
        nomeLower.includes("portal") ||
        nomeLower.includes("contexto") ||
        nomeLower.includes("aplicacao") ||
        nomeLower.includes("diario")
      ) {
        larguraDesejada = 450;
      }

      // Converte para WebP mantendo alta qualidade
      await sharp(inputPath)
        .resize({ width: larguraDesejada, withoutEnlargement: true })
        .webp({ quality: 85 })
        .toFile(outputPath);

      console.log(`✅ Convertida com sucesso: ${baseName}.webp`);

      // Apaga o arquivo original na mesma hora para evitar duplicação
      fs.unlinkSync(inputPath);
      console.log(`🗑️ Original removido: ${file}`);

    } catch (error) {
      console.error(`❌ Erro ao processar a imagem ${file}:`, error);
    }
  }
}

run();
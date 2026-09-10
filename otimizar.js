const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const images = [
  { name: "logo", width: 300 },
  { name: "portal", width: 450 },
  { name: "contexto", width: 450 },
  { name: "aplicacao", width: 450 },
  { name: "diario", width: 450 },
  { name: "perfil", width: 500 },
  { name: "feedback1", width: 800 },
  { name: "feedback2", width: 800 },
];

async function run() {
  for (const img of images) {
    const files = fs.readdirSync("./public");
    const found = files.find((f) => f.toLowerCase().startsWith(img.name + "."));
    if (found) {
      const inputPath = path.join("./public", found);
      const outputPath = path.join("./public", `${img.name}.webp`);
      await sharp(inputPath)
        .resize({ width: img.width })
        .webp({ quality: 85 })
        .toFile(outputPath);
      console.log(`✅ Otimizada: ${img.name}.webp`);
    }
  }
}

run();
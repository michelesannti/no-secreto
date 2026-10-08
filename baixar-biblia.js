// baixar-biblia.js
const fs = require('fs');
const path = require('path');
const https = require('https');

function baixarBibliaOficialCompleta() {
  console.log("Baixando a Bíblia NVI completa oficial...");
  
  const url = "https://raw.githubusercontent.com/thiagobodruk/biblia/master/json/nvi.json";

  https.get(url, (res) => {
    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
      https.get(res.headers.location, (resRedir) => processarResposta(resRedir)).on('error', erroFatal);
      return;
    }
    processarResposta(res);
  }).on("error", erroFatal);
}

function processarResposta(res) {
  if (res.statusCode !== 200) {
    console.error(`Erro: Servidor respondeu com status ${res.statusCode}`);
    return;
  }

  let data = '';
  res.on('data', chunk => { data += chunk; });
  res.on('end', () => {
    try {
      console.log("Download concluído! Processando estrutura da Bíblia...");
      
      // Remove BOM (Byte Order Mark) ou espaços invisíveis iniciais se houverem
      const cleanData = data.replace(/^\uFEFF/, '').trim();
      const rawJson = JSON.parse(cleanData);

      const bibliaFormatada = rawJson.map((livroObj) => {
        return {
          name: livroObj.name || livroObj.book,
          chapters: livroObj.chapters
        };
      });

      const dataDir = path.join(__dirname, 'data');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir);
      }

      fs.writeFileSync(path.join(dataDir, 'biblia-nvi.json'), JSON.stringify(bibliaFormatada, null, 2));
      console.log("\n🎉 SUCESSO ABSOLUTO! A Bíblia NVI completa está salva e estruturada em data/biblia-nvi.json!");
    } catch (e) {
      console.error("Erro ao processar o JSON da Bíblia:", e.message);
    }
  });
}

function erroFatal(err) {
  console.error("Erro de conexão:", err.message);
}

baixarBibliaOficialCompleta();
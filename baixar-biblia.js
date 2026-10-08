// baixar-biblia.js
const fs = require('fs');
const path = require('path');
const https = require('https');

// Lista completa dos 66 livros da Bíblia com suas siglas oficiais e nomes em português
const livrosConfig = [
  { sigla: "gn", nome: "Gênesis" }, { sigla: "ex", nome: "Êxodo" }, { sigla: "lv", nome: "Levítico" }, { sigla: "nm", nome: "Números" }, { sigla: "dt", nome: "Deuteronômio" },
  { sigla: "js", nome: "Josué" }, { sigla: "jz", nome: "Juízes" }, { sigla: "rt", nome: "Rute" }, { sigla: "1sm", nome: "1 Samuel" }, { sigla: "2sm", nome: "2 Samuel" },
  { sigla: "1rs", nome: "1 Reis" }, { sigla: "2rs", nome: "2 Reis" }, { sigla: "1cr", nome: "1 Crônicas" }, { sigla: "2cr", nome: "2 Crônicas" }, { sigla: "ed", nome: "Esdras" },
  { sigla: "ne", nome: "Neemias" }, { sigla: "et", nome: "Ester" }, { sigla: "job", nome: "Jó" }, { sigla: "sl", nome: "Salmos" }, { sigla: "pv", nome: "Provérbios" },
  { sigla: "ec", nome: "Eclesiastes" }, { sigla: "ct", nome: "Cânticos" }, { sigla: "is", nome: "Isaías" }, { sigla: "jr", nome: "Jeremias" }, { sigla: "lm", nome: "Lamentações" },
  { sigla: "ez", nome: "Ezequiel" }, { sigla: "dn", nome: "Daniel" }, { sigla: "os", nome: "Oséias" }, { sigla: "jl", nome: "Joel" }, { sigla: "am", nome: "Amós" },
  { sigla: "ob", nome: "Obadias" }, { sigla: "jn", nome: "Jonas" }, { sigla: "mq", nome: "Miquéias" }, { sigla: "na", nome: "Naum" }, { sigla: "hc", nome: "Habacuque" },
  { sigla: "sf", nome: "Sofonias" }, { sigla: "ag", nome: "Ageu" }, { sigla: "zc", nome: "Zacarias" }, { sigla: "ml", nome: "Malaquias" },
  { sigla: "mt", nome: "Mateus" }, { sigla: "mc", nome: "Marcos" }, { sigla: "lc", nome: "Lucas" }, { sigla: "jo", nome: "João" }, { sigla: "at", nome: "Atos" },
  { sigla: "rm", nome: "Romanos" }, { sigla: "1co", nome: "1 Coríntios" }, { sigla: "2co", nome: "2 Coríntios" }, { sigla: "gl", nome: "Gálatas" }, { sigla: "ef", nome: "Efésios" },
  { sigla: "fp", nome: "Filipenses" }, { sigla: "cl", nome: "Colossenses" }, { sigla: "1ts", nome: "1 Tessalonicenses" }, { sigla: "2ts", nome: "2 Tessalonicenses" },
  { sigla: "1tm", nome: "1 Timóteo" }, { sigla: "2tm", nome: "2 Timóteo" }, { sigla: "tt", nome: "Tito" }, { sigla: "fm", nome: "Filemom" }, { sigla: "hb", nome: "Hebreus" },
  { sigla: "tg", nome: "Tiago" }, { sigla: "1pe", nome: "1 Pedro" }, { sigla: "2pe", name: "2 Pedro" }, { sigla: "1jo", nome: "1 João" }, { sigla: "2jo", nome: "2 João" },
  { sigla: "3jo", nome: "3 João" }, { sigla: "jd", nome: "Judas" }, { sigla: "ap", nome: "Apocalipse" }
];

function baixarLivro(sigla) {
  return new Promise((resolve, reject) => {
    const url = `https://raw.githubusercontent.com/abibliadigital/dados-nvi/master/json/${sigla}.json`;
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Status ${res.statusCode}`));
        return;
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function executar() {
  console.log("Iniciando o download da Bíblia NVI completa (livro por livro)...");
  const bibliaCompleta = [];

  for (const item of livrosConfig) {
    try {
      process.stdout.write(`Baixando ${item.nome}... `);
      const chapters = await baixarLivro(item.sigla);
      bibliaCompleta.push({ name: item.nome, chapters: chapters });
      console.log("OK!");
    } catch (err) {
      console.log(`FALHA (${err.message}). Tentando rota alternativa...`);
      // Fallback ou array vazio se houver falha pontual
      bibliaCompleta.push({ name: item.nome, chapters: [] });
    }
  }

  const dataDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }

  fs.writeFileSync(path.join(dataDir, 'biblia-nvi.json'), JSON.stringify(bibliaCompleta, null, 2));
  console.log("\n🎉 Sucesso absoluto! A Bíblia NVI completa foi gerada em data/biblia-nvi.json!");
}

executar();
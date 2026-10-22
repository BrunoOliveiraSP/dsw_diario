// Lê o arquivo .env e gera public/env.js, que o index.html carrega antes do Angular.
// Variáveis definidas no terminal têm prioridade sobre as do .env.
const fs = require('fs');
const path = require('path');

const raiz = path.join(__dirname, '..');
const arquivoEnv = path.join(raiz, '.env');
const variaveis = {};

if (fs.existsSync(arquivoEnv)) {
  for (const linha of fs.readFileSync(arquivoEnv, 'utf8').split('\n')) {
    const texto = linha.trim();
    if (!texto || texto.startsWith('#') || !texto.includes('=')) continue;
    const posicao = texto.indexOf('=');
    variaveis[texto.slice(0, posicao).trim()] = texto.slice(posicao + 1).trim();
  }
}

const env = {
  API_URL: process.env.API_URL || variaveis.API_URL || 'http://localhost:8080',
};

fs.writeFileSync(path.join(raiz, 'public', 'env.js'), `window.env = ${JSON.stringify(env, null, 2)};\n`);
console.log('public/env.js gerado:', env);

#!/bin/sh
# Gera o env.js com a URL da API recebida pela variável de ambiente API_URL
cat > /usr/share/nginx/html/env.js <<FIM
window.env = {
  "API_URL": "${API_URL:-http://localhost:8080}"
};
FIM
echo "env.js gerado com API_URL=${API_URL:-http://localhost:8080}"

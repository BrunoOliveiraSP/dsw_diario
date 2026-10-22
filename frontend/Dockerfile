# Etapa 1: build do Angular
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Etapa 2: servir os arquivos estáticos com nginx
FROM nginx:1.27-alpine

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
# script executado na subida do container: gera o env.js a partir das variáveis de ambiente
COPY docker/gerar-env.sh /docker-entrypoint.d/40-gerar-env.sh
RUN chmod +x /docker-entrypoint.d/40-gerar-env.sh

COPY --from=build /app/dist/diario-web/browser /usr/share/nginx/html

EXPOSE 80

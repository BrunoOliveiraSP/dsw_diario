# Diário Online — Front-end

Aplicação Angular 21 para a API do diário. Usa standalone components, `FormsModule` (formulários template-driven), CSS puro e [ngx-toastr](https://github.com/scttcper/ngx-toastr) para as notificações.

## Páginas

| Rota              | Página                                                              |
|-------------------|---------------------------------------------------------------------|
| `/cadastro`       | Criar conta                                                         |
| `/login`          | Login                                                               |
| `/inicio`         | Início: saudação, resumo e últimas anotações                        |
| `/anotacoes`      | Lista com filtros: período (API), avaliação mínima e busca por texto |
| `/anotacoes/:id`  | Detalhe da anotação                                                 |
| `/anotacoes/nova` | Nova anotação, com a data escolhida no date picker (hoje ou dias anteriores) |
| `/anotacoes/:id/editar` | Editar anotação (mesmo formulário da nova) |

As páginas internas são protegidas por um guard. O token JWT fica no `localStorage` e é enviado em todas as requisições por um interceptor. Se a API responder `401`, o usuário volta para o login.

## Configuração (.env)

O endereço da API fica no arquivo `.env`:

```
API_URL=http://localhost:8080
```

O script `scripts/gerar-env.js` lê o `.env` e gera o arquivo `public/env.js`. O `index.html` carrega esse arquivo antes do Angular, e o código lê o valor em `src/app/config.ts`. O script roda sozinho antes de `npm start` e de `npm run build`.

> Lembre-se de liberar o endereço do front-end na variável `CORS_ORIGINS` do backend.

## Rodar localmente

```bash
cp .env.example .env   # ajuste a API_URL, se precisar
npm install
npm start              # http://localhost:4200
```

## Docker

A imagem faz o build com Node e serve os arquivos com nginx. Na subida do container, o `env.js` é gerado a partir da variável de ambiente `API_URL`. Assim, a mesma imagem serve para qualquer ambiente.

```bash
docker build -t diario-frontend .
docker run -d -p 4200:80 -e API_URL=http://localhost:8080 diario-frontend
```

Para subir tudo junto (MySQL, backend e front-end), use o `docker-compose` da pasta `deploy/`. Veja o `README` do backend.

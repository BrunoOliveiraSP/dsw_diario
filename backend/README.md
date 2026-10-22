# Diário Online — Backend

API REST em Spring Boot para um diário online. Cada usuário cria uma conta, faz login (JWT) e gerencia as próprias anotações.

**Stack:** Java 21, Spring Boot 4 (Web, Data JPA, Validation, Security), JJWT, Lombok, MySQL 8.

---

## Variáveis de ambiente

| Variável        | Descrição                                                        | Padrão (desenvolvimento)                    |
|-----------------|------------------------------------------------------------------|---------------------------------------------|
| `DB_URL`        | URL JDBC do MySQL                                                | `jdbc:mysql://localhost:3306/diario?...`    |
| `DB_USER`       | Usuário do banco                                                 | `root`                                      |
| `DB_PASSWORD`   | Senha do banco                                                   | `root`                                      |
| `JWT_SECRET`    | Segredo para assinar o token (**mínimo de 32 caracteres**)       | valor de exemplo — **troque em produção**   |
| `JWT_EXPIRACAO` | Validade do token, em minutos                                    | `120`                                       |
| `TZ`            | Fuso horário. A regra "sem anotações com data futura" depende dele | fuso do sistema                             |
| `CORS_ORIGINS`  | Endereços do front-end autorizados a chamar a API (separados por vírgula) | `http://localhost:4200` |

Somente no `docker-compose` (pasta `deploy/`):

| Variável       | Descrição                                   | Padrão   |
|----------------|---------------------------------------------|----------|
| `DB_NAME`      | Nome do banco criado no container do MySQL  | `diario` |
| `MYSQL_PORT`   | Porta do MySQL exposta na sua máquina       | `3306`   |
| `BACKEND_PORT` | Porta da API exposta na sua máquina         | `8080`   |
| `FRONTEND_PORT` | Porta do front-end exposta na sua máquina   | `4200`   |
| `API_URL`      | URL da API usada pelo front-end (no navegador) | `http://localhost:8080` |

> No compose, o MySQL cria apenas o usuário `root`, com a senha `DB_PASSWORD`. Por isso, mantenha `DB_USER=root`.

---

## Opção 1 — Subir tudo com Docker Compose (recomendado)

Pré-requisito: Docker.

```bash
cd deploy
cp .env.example .env      # ajuste os valores, principalmente JWT_SECRET
docker compose up -d --build
```

- O compose sobe o MySQL, o backend (quando o MySQL estiver saudável) e o front-end.
- O backend recebe as variáveis do arquivo `deploy/.env` (`env_file`).
- A API fica em `http://localhost:8080` e o front-end em `http://localhost:4200` (ou nas portas definidas no `.env`).

Comandos úteis:

```bash
docker compose logs -f backend   # acompanhar os logs da API
docker compose down              # parar (mantém os dados)
docker compose down -v           # parar e apagar o banco
```

> Se a porta 3306 já estiver em uso na sua máquina, altere `MYSQL_PORT` no `.env` (ex.: `3307`). A API não é afetada, porque conversa com o MySQL pela rede interna do Docker.

---

## Opção 2 — Rodar localmente (sem Docker para o backend)

Pré-requisitos: **JDK 21** (o Lombok ainda não é compatível com versões mais novas) e um MySQL acessível.

Para usar só o MySQL do compose:

```bash
cd deploy && docker compose up -d mysql
```

Depois, exporte as variáveis e suba a aplicação:

```bash
cd backend

export DB_URL="jdbc:mysql://localhost:3306/diario?createDatabaseIfNotExist=true&allowPublicKeyRetrieval=true&useSSL=false&serverTimezone=America/Sao_Paulo"
export DB_USER=root
export DB_PASSWORD=Admin@123
export JWT_SECRET="um-segredo-bem-grande-com-pelo-menos-32-caracteres"
export JWT_EXPIRACAO=120

./mvnw spring-boot:run
```

Para gerar e executar o `.jar`:

```bash
./mvnw clean package -DskipTests
java -jar target/diario-0.0.1-SNAPSHOT.jar
```

---

## Opção 3 — Apenas a imagem Docker do backend

```bash
cd backend
docker build -t diario-backend .

docker run -d --name diario-backend -p 8080:8080 \
  -e DB_URL="jdbc:mysql://host.docker.internal:3306/diario?createDatabaseIfNotExist=true&allowPublicKeyRetrieval=true&useSSL=false" \
  -e DB_USER=root \
  -e DB_PASSWORD=root \
  -e JWT_SECRET="um-segredo-bem-grande-com-pelo-menos-32-caracteres" \
  -e TZ=America/Sao_Paulo \
  diario-backend
```

Também é possível passar um arquivo de variáveis: `docker run --env-file ../deploy/.env ...`. Nesse caso, `DB_URL` precisa apontar para um host que o container alcance.

---

## Endpoints

| Método | Rota                                          | Autenticação | Descrição                                    |
|--------|-----------------------------------------------|--------------|----------------------------------------------|
| POST   | `/auth/cadastro`                              | não          | Cria a conta                                 |
| POST   | `/auth/login`                                 | não          | Retorna o token JWT                          |
| POST   | `/anotacoes`                                  | Bearer       | Insere uma anotação                          |
| GET    | `/anotacoes/ultimas?quantidade=10`            | Bearer       | Últimas anotações (de 1 a 50)                |
| GET    | `/anotacoes/{id}`                             | Bearer       | Detalhe de uma anotação da conta (`404` se não for sua) |
| PUT    | `/anotacoes/{id}`                             | Bearer       | Edita uma anotação da conta (a data não pode ser futura) |
| GET    | `/anotacoes?inicio=2026-10-01&fim=2026-10-22` | Bearer       | Anotações do período (datas no formato ISO)  |

O `idConta` é lido do token JWT. Nenhum endpoint o recebe.

### Exemplo de uso

```bash
# cadastro
curl -X POST localhost:8080/auth/cadastro -H "Content-Type: application/json" \
  -d '{"nome":"Ana","email":"ana@email.com","senha":"123456"}'

# login
curl -X POST localhost:8080/auth/login -H "Content-Type: application/json" \
  -d '{"email":"ana@email.com","senha":"123456"}'
# => {"token":"eyJ...","tipo":"Bearer","expiraEmMinutos":120}

# nova anotação ("inclusao" é opcional: se omitida, usa o momento atual)
curl -X POST localhost:8080/anotacoes -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"titulo":"Meu dia","descricao":"Estudei Spring Boot","avaliacao":5}'

# últimas anotações
curl localhost:8080/anotacoes/ultimas -H "Authorization: Bearer <token>"
```

### Regras

- São aceitas anotações de hoje ou de qualquer dia anterior. Datas futuras retornam `400`, tanto na criação quanto na edição.
- Não é permitido criar duas contas com o mesmo e-mail (`409`). O e-mail não diferencia maiúsculas de minúsculas.
- Campos obrigatórios:
  - na conta: `nome`, `email` e `senha` (mínimo de 6 caracteres);
  - na anotação: `titulo`, `descricao` e `avaliacao` (de 1 a 5).
- Um erro de validação retorna `400`, com a lista de campos inválidos.
- Sem token, ou com token inválido ou expirado, a resposta é `401`.

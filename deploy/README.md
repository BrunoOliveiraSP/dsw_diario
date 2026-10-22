# Deploy — Diário Online

Passo a passo para publicar a aplicação completa (MySQL, backend e frontend) em uma VM Linux (Ubuntu) na Azure, usando Docker Compose.

Ao final, o sistema fica acessível em:

- Front-end: `http://IP_DA_VM:4200`
- API: `http://IP_DA_VM:8080`

> Nos exemplos, o IP da VM é `158.23.164.151`. Troque pelo IP da sua VM.

---

## 1. Conectar na VM

No seu computador, na pasta onde está a chave `.pem`:

```bash
chmod 400 senac-dsw_key.pem          # só na primeira vez: o ssh exige permissão restrita na chave
ssh -i senac-dsw_key.pem senac@158.23.164.151
```

---

## 2. Instalar o Docker

Ainda na VM, rode o script oficial de instalação. Ele já instala o plugin `docker compose`:

```bash
curl -fsSL https://get.docker.com | sudo sh
```

Para conferir se a instalação deu certo:

```bash
sudo docker --version
sudo docker compose version
```

---

## 3. Baixar o projeto

```bash
sudo mkdir services
cd services
sudo git clone https://github.com/BrunoOliveiraSP/dsw_diario.git
cd dsw_diario/deploy
```

---

## 4. Criar o arquivo `.env`

O `.env` não vai para o GitHub, porque guarda senhas. Crie-o a partir do modelo:

```bash
sudo cp .env.example .env
sudo nano .env
```

Ajuste **obrigatoriamente** estas variáveis:

| Variável       | O que colocar                                                    | Exemplo                        |
|----------------|------------------------------------------------------------------|--------------------------------|
| `API_URL`      | Endereço da API **como o navegador acessa**: IP público da VM e porta do backend | `http://158.23.164.151:8080`   |
| `CORS_ORIGINS` | Endereço do front-end: IP público da VM e porta do front-end. A API só aceita chamadas vindas daqui | `http://158.23.164.151:4200`   |
| `DB_PASSWORD`  | Uma senha forte para o MySQL                                     | `S3nh@-F0rte-Do-Banco`         |
| `JWT_SECRET`   | Um texto aleatório com **no mínimo 32 caracteres**, usado para assinar os tokens | gere com `openssl rand -base64 48` |

Cuidados:

- **`API_URL` e `CORS_ORIGINS` não podem usar `localhost`.** Na VM, `localhost` seria o computador de quem abre o site, não a VM.
- **Use `http://` e não coloque `/` no final** desses endereços.
- **Defina a senha do banco antes da primeira subida.** O MySQL só lê o `DB_PASSWORD` quando o banco é criado. Se você mudar a senha depois, o backend não conecta mais. Nesse caso, é preciso apagar o banco com `sudo docker compose down -v`, o que **perde os dados**, e subir de novo.

Para salvar no `nano`: `Ctrl+O`, `Enter` e depois `Ctrl+X` para sair.

---

## 5. Subir a aplicação

Dentro da pasta `deploy`:

```bash
sudo docker compose up -d --build
```

- **Primeira vez:** demora alguns minutos, porque o Docker compila o backend (Maven) e o frontend (Angular).
- **Ordem de subida:** o MySQL sobe primeiro. O backend só inicia quando o banco estiver pronto, e o frontend vem por último.
- **Tabelas:** o backend cria as tabelas automaticamente.

Para conferir se os três containers estão rodando:

```bash
sudo docker compose ps
```

Os três devem aparecer com status `Up`, e o MySQL também com `(healthy)`.

---

## 6. Liberar as portas na Azure

Por padrão, a Azure bloqueia o acesso externo às portas da VM. Libere a **4200** (front-end) e a **8080** (API):

1. Acesse o [portal da Azure](https://portal.azure.com) e abra **Máquinas virtuais**.
2. Clique na sua VM.
3. No menu lateral, vá em **Rede** → **Configurações de rede**.
4. Clique em **+ Criar regra de porta** → **Regra de porta de entrada**.
5. Preencha:
   - **Origem:** `Any`
   - **Intervalos de portas de destino:** `4200,8080`
   - **Protocolo:** `TCP`
   - **Ação:** `Permitir`
   - **Prioridade:** deixe o valor sugerido
   - **Nome:** `diario-portas`
6. Clique em **Adicionar** e aguarde alguns segundos até a regra ser aplicada.

> **Não libere a porta 3306 (MySQL).** O backend acessa o banco pela rede interna do Docker, então o banco não precisa ficar exposto na internet.

Agora acesse `http://158.23.164.151:4200` no navegador.

---

## 7. Ver os logs

```bash
sudo docker logs diario-mysql
sudo docker logs diario-backend
sudo docker logs diario-frontend
```

Para acompanhar em tempo real, acrescente `-f` (ex.: `sudo docker logs -f diario-backend`) e saia com `Ctrl+C`.

---

## Atualizar a aplicação

Depois de enviar alterações para o GitHub, rode na VM:

```bash
cd ~/services/dsw_diario
sudo git pull
cd deploy
sudo docker compose up -d --build
```

Os dados do banco são mantidos, porque ficam no volume `deploy_diario-data`.

---

## Comandos úteis

| Comando                                  | O que faz                                              |
|------------------------------------------|--------------------------------------------------------|
| `sudo docker compose ps`                 | Lista os containers e o status de cada um              |
| `sudo docker compose restart backend`    | Reinicia só o backend (não relê o `.env`)              |
| `sudo docker compose down`               | Para tudo e **mantém** os dados do banco               |
| `sudo docker compose down -v`            | Para tudo e **apaga** o banco                          |

> Depois de alterar o `.env`, rode `sudo docker compose up -d` para recriar os containers com os novos valores.

---

## Problemas comuns

| Sintoma                                              | Causa provável / solução                                                                 |
|------------------------------------------------------|------------------------------------------------------------------------------------------|
| O site não abre                                       | Portas não liberadas na Azure (passo 6) ou containers parados (`sudo docker compose ps`)  |
| O site abre, mas o toast diz "Não foi possível conectar à API" | `API_URL` errada no `.env` (use o IP público, não `localhost`) ou porta 8080 bloqueada na Azure |
| Erro de CORS no console do navegador (F12)           | `CORS_ORIGINS` diferente do endereço exato usado no navegador (confira IP, porta e `http://`) |
| O backend reinicia sem parar, com erro de acesso negado ao MySQL | A senha foi alterada depois da criação do banco. Veja o cuidado sobre `DB_PASSWORD` no passo 4 |
| Login funciona, mas depois de um tempo pede login de novo | O token expirou. O tempo é definido por `JWT_EXPIRACAO`, em minutos                      |

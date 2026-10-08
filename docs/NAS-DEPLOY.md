# Deploy no TerraMaster F2-424

Este runbook assume TOS com Docker/Compose e acesso SSH. O volume deste NAS é `/Volume1/docker` (minúsculo). A imagem publicada no GHCR é `linux/amd64`, a arquitetura do F2-424.

O acesso previsto é pela Tailscale, sem abrir porta no roteador. O Cloudflare Tunnel continua opcional.

## Pré-requisitos

- Docker Compose disponível no NAS.
- Pacote `ghcr.io/diegoasmoura/id_finance` público, ou `docker login ghcr.io` com permissão de leitura.
- Pasta `/Volume1/docker/id-finance`.
- Uma porta livre no host. A 3010 deste NAS já é do Excalidraw; a instância atual usa 3020.
- IP Tailscale do NAS (`tailscale ip -4`).

Não exponha Portainer, o painel do TOS, o Postgres nem a porta do app na internet.

## Preparar diretório

```bash
mkdir -p /Volume1/docker/id-finance/postgres
cd /Volume1/docker/id-finance
git clone https://github.com/diegoasmoura/id_finance.git app
cd app
cp .env.nas.example .env
chmod 600 .env
```

Gere dois segredos em hexadecimal. A senha do banco entra na URL do Postgres; `openssl rand -base64` pode produzir `/` e `+` e quebrar essa URL.

```bash
openssl rand -hex 32
openssl rand -hex 32
```

No `.env`:

- `BETTER_AUTH_SECRET`: o primeiro valor.
- `POSTGRES_PASSWORD`: o segundo valor.
- `APP_PORT`: uma porta livre, por exemplo `3020`.
- `APP_BIND_ADDRESS=0.0.0.0`, para o Tailscale alcançar o host.
- `BETTER_AUTH_URL`: o endereço exato aberto no navegador, como `http://100.x.y.z:3020`. O texto de exemplo não funciona.
- `POSTGRES_DATA_PATH=/Volume1/docker/id-finance/postgres`.
- `CLOUDFLARE_TUNNEL_TOKEN`: deixe vazio se não for usar túnel.

## Primeiro deploy

O diretório do Compose é `app`, então os containers se chamam `app-db-1`, `app-migrate-1` e `app-app-1`.

```bash
docker compose --env-file .env -f docker-compose.prod.yml pull
docker compose --env-file .env -f docker-compose.prod.yml up -d db
docker compose --env-file .env -f docker-compose.prod.yml up migrate
docker compose --env-file .env -f docker-compose.prod.yml up -d app
docker compose --env-file .env -f docker-compose.prod.yml ps
```

Não suba `cloudflared` sem um token. A migração Prisma roda antes do app. Sem sessão, `/` redireciona para `/entrar`.

Se o daemon recusar a porta (`port is already allocated`), escolha outra, atualize `APP_PORT` e a mesma porta dentro de `BETTER_AUTH_URL`, e suba de novo só o app:

```bash
docker compose --env-file .env -f docker-compose.prod.yml up -d app
```

## Atualizar versão

Espere a publicação da imagem ficar verde em GitHub Actions. O `git pull` atualiza o código no disco; o app em execução só muda depois do `pull` da imagem.

```bash
git pull --ff-only
docker compose --env-file .env -f docker-compose.prod.yml pull app
docker compose --env-file .env -f docker-compose.prod.yml up -d app
docker compose --env-file .env -f docker-compose.prod.yml ps
```

Para rollback, fixe `APP_IMAGE` numa tag anterior, faça `pull app` e `up -d app`. Não use só `latest` como estratégia de volta.

## Verificar

Abra `BETTER_AUTH_URL` numa janela anônima. A primeira tela é o login. Crie uma conta e confirme que a área de estudo mostra esse nome, não um perfil fixo.

```bash
docker compose --env-file .env -f docker-compose.prod.yml logs --tail=100 app
docker compose --env-file .env -f docker-compose.prod.yml ps
```

## Backup manual

```bash
POSTGRES_CONTAINER=app-db-1 \
POSTGRES_USER=app \
POSTGRES_DB=investimentos \
BACKUP_DIR=/Volume1/docker/id-finance/backups \
sh scripts/backup-postgres.sh
```

O backup local não substitui a estratégia 3-2-1. Copie os dumps para outro dispositivo e teste a restauração.

## Cloudflare Tunnel

Opcional. Com um túnel criado na Cloudflare, preencha `CLOUDFLARE_TUNNEL_TOKEN`, aponte o hostname público para `http://app:3000` e suba também o serviço `cloudflared`. `BETTER_AUTH_URL` passa a ser esse hostname `https`. Mantenha `APP_BIND_ADDRESS=127.0.0.1` se o acesso público for só pelo túnel.

## Limitações atuais

- Vídeos ainda não estão integrados a um provedor externo.
- Progresso de aulas ainda não está persistido.
- Área de consultoria ainda não foi liberada.
- O NAS não é alta disponibilidade sem redundância de energia, internet, backup externo e monitoramento.

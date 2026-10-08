# Deploy no TerraMaster F2-424

Este runbook assume TOS com Docker/Compose ou Portainer disponível e acesso SSH/local ao NAS.

## Pré-requisitos

- RAID 1 configurado para os discos principais.
- Volume persistente no SSD/NVMe para PostgreSQL.
- Nobreak instalado e desligamento seguro testado.
- Domínio configurado na Cloudflare.
- Cloudflare Tunnel criado, sem portas públicas abertas no roteador.
- Pasta de produção criada, por exemplo `/Volume1/Docker/id-finance`.
- Docker Compose disponível no NAS.

Não exponha Portainer ou o painel do TOS na internet. Use rede local, VPN ou Tailscale/WireGuard.

## Preparar diretório

```bash
mkdir -p /Volume1/Docker/id-finance
cd /Volume1/Docker/id-finance
git clone https://github.com/diegoasmoura/id_finance.git app
cd app
cp .env.nas.example .env
chmod 600 .env
```

Edite `.env` e substitua todos os valores de exemplo. Gere segredos fora do Git:

```bash
openssl rand -base64 48
```

## Primeiro deploy

```bash
docker compose --env-file .env -f docker-compose.prod.yml pull
docker compose --env-file .env -f docker-compose.prod.yml up -d db
docker compose --env-file .env -f docker-compose.prod.yml up migrate
docker compose --env-file .env -f docker-compose.prod.yml up -d app cloudflared
```

As migrações Prisma são aplicadas automaticamente pelo serviço `migrate` antes do app iniciar.

## Atualizar versão

```bash
git pull --ff-only
docker compose --env-file .env -f docker-compose.prod.yml pull app
docker compose --env-file .env -f docker-compose.prod.yml up -d app
docker compose --env-file .env -f docker-compose.prod.yml ps
```

Use tags imutáveis de imagem quando o fluxo CI/CD estiver ativo. Não use `latest` como estratégia de rollback.

## Verificar

```bash
APP_URL=https://app.example.com.br sh scripts/smoke-test.sh
docker compose --env-file .env -f docker-compose.prod.yml logs --tail=100 app
docker compose --env-file .env -f docker-compose.prod.yml ps
```

## Backup manual

```bash
POSTGRES_CONTAINER=id-finance-db-1 \
POSTGRES_USER=app \
POSTGRES_DB=investimentos \
BACKUP_DIR=/Volume1/Backups/id-finance \
sh scripts/backup-postgres.sh
```

O backup local não substitui a estratégia 3-2-1. Copie os dumps para outro dispositivo e, quando houver orçamento, para armazenamento externo criptografado. Teste restauração mensalmente.

## Rollback

1. Identifique a tag anterior da imagem.
2. Altere `APP_IMAGE` no `.env` para essa tag.
3. Execute `docker compose ... pull app`.
4. Execute `docker compose ... up -d app`.
5. Rode o smoke test.

Não faça rollback de schema destrutivo sem um dump recente e um plano de compatibilidade.

## Migração de volta para VPS

O app é empacotado como imagem standalone e o banco é PostgreSQL. Para migrar:

1. Pare novas escritas ou coloque manutenção.
2. Gere dump com `backup-postgres.sh`.
3. Restaure o dump no novo PostgreSQL.
4. Suba a mesma imagem no novo host.
5. Valide login, conteúdo, progresso e healthcheck.
6. Alterne o hostname na Cloudflare.

## Limitações atuais

- Vídeos ainda não estão integrados a um provedor externo.
- Progresso de aulas ainda não está persistido na interface.
- Área de consultoria ainda não foi liberada.
- O NAS não deve ser considerado alta disponibilidade sem redundância de energia, internet, backup externo e monitoramento.

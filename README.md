# Plataforma de Educação e Consultoria em Investimentos

Protótipo local da plataforma baseada no ciclo da renda. O primeiro vertical slice ensina o aluno a relacionar renda, despesas, reserva e capacidade de aporte sem recomendar ativos.

## Rodar localmente

Requisitos: Node.js 22+, npm e, opcionalmente, Docker Desktop.

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`.

Para testar a imagem de produção com PostgreSQL local. O Compose aplica as migrações antes de iniciar o app:

```bash
docker compose up --build
```

Para iniciar somente o banco e preparar o conteúdo inicial:

```bash
docker compose up -d db
DATABASE_URL="postgresql://app:app_dev_password@localhost:5433/investimentos" npm run db:validate
DATABASE_URL="postgresql://app:app_dev_password@localhost:5433/investimentos" npm run db:push
DATABASE_URL="postgresql://app:app_dev_password@localhost:5433/investimentos" npm run db:seed
```

O catálogo e o simulador ainda não leem o banco. O login consulta o PostgreSQL depois da migração. Não use as credenciais do `docker-compose.yml` em produção.

Para produção, defina `BETTER_AUTH_SECRET` com um valor aleatório forte fora do repositório. O valor padrão do Compose existe apenas para desenvolvimento local.

## Comandos de qualidade

```bash
npm test
npm run typecheck
npm run lint
npm run build
```

## O que está implementado

- Workspace inicial do aluno.
- Simulador de orçamento e capacidade de aporte em cinco etapas.
- Cenários matemáticos de aumento de renda e redução de despesas.
- Indicador de reserva em meses de despesas essenciais.
- Catálogo inicial de trilhas.
- Jornada de aprendizagem.
- Glossário pesquisável com conceitos de Selic, IPCA, CVM, liquidez e risco.
- Modal de aviso educacional.
- Navegação responsiva, incluindo menu mobile.
- Motor financeiro isolado com testes unitários.
- Testes de interação para os fluxos principais.
- Cadastro, login, sessão e logout locais com Better Auth e Argon2id.

O login fica em `/entrar`. Cadastro, sessão e logout usam o PostgreSQL depois da migração. Os números do simulador e o progresso da aula ainda ficam só na sessão do navegador. Não há pagamento, carteira, cotação ou recomendação.

## Direção de produto

Educação e consultoria serão contextos separados. A área do consultor terá permissões, documentos, sessões e auditoria próprios quando o enquadramento profissional e jurídico estiver confirmado. O aluno não receberá recomendações automáticas de compra ou venda.

Consulte [`docs/EXECUTION-ROADMAP.md`](docs/EXECUTION-ROADMAP.md) para os gates e próximos ciclos.

## Deploy

- Desenvolvimento local: [`docker-compose.yml`](docker-compose.yml).
- Staging: [`docker-compose.staging.yml`](docker-compose.staging.yml).
- Produção no TerraMaster: [`docker-compose.prod.yml`](docker-compose.prod.yml).
- Runbook completo do NAS: [`docs/NAS-DEPLOY.md`](docs/NAS-DEPLOY.md).
- Segurança e resposta a incidentes: [`docs/SECURITY-RUNBOOK.md`](docs/SECURITY-RUNBOOK.md).

O arquivo `.env.nas.example` contém apenas nomes e valores de exemplo. Copie-o para `.env` no NAS, substitua todos os segredos e nunca publique o arquivo preenchido.

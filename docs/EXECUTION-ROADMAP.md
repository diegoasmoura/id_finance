# Roadmap de Execução

Este documento converte o plano estratégico em ciclos verificáveis. Cada ciclo só avança depois de passar o gate técnico, pedagógico e de produto correspondente.

## Status atual

### Step 0: decisões e limites

Definido para o protótipo:

- Educação e consultoria existirão no produto, mas em áreas separadas.
- O primeiro fluxo é educacional.
- O consultor utilizará uma área privada própria em etapa posterior.
- O aluno poderá escolher trilhas e o diagnóstico será opcional.
- A carteira de investimentos está fora desta primeira versão.
- O desenvolvimento começa localmente, com Docker preparado para o NAS.
- Dados históricos serão adicionados depois, com fonte, licença e data registradas.
- A primeira experiência é o simulador de orçamento e capacidade de aporte.

Ainda bloqueiam a área regulada:

- confirmação do registro e do enquadramento do profissional;
- contrato e escopo da consultoria;
- regras de suitability e retenção de registros;
- entidade legal, emissão fiscal e política de privacidade definitiva.

### Step 1: primeiro vertical slice

Concluído no protótipo:

- Next.js, TypeScript strict, Vitest e ESLint CLI;
- workspace responsivo do aluno;
- simulador com cinco etapas;
- funções financeiras puras e testes;
- gráficos e microinterações;
- catálogo de trilhas e glossário;
- testes de navegação, busca, filtros, modal, menu mobile e revisão do simulador;
- Dockerfile multi-stage e Compose local.

Gate: `npm test`, `npm run typecheck`, `npm run lint` e `npm run build` verdes.

## Step 2: aprendizagem inicial

Objetivo: transformar o simulador em uma experiência de aula completa.

Entregas:

- aula textual sobre renda líquida, despesas essenciais e capacidade de aporte;
- objetivos de aprendizagem mensuráveis;
- checkpoint no meio da aula;
- quiz formativo com feedback e refação;
- fontes e data de revisão;
- página de objetivo do simulador;
- política de linguagem educacional;
- dados fictícios claramente identificados.

Gate:

- o aluno consegue concluir a aula sem instrução externa;
- cada questão se relaciona a um objetivo;
- cálculos e feedback têm testes;
- aviso educacional aparece no contexto da simulação.

## Step 3: identidade e persistência local

Preparação concluída: o schema Prisma e o seed de Gestão da Renda existem; o PostgreSQL do Compose está publicado em `localhost:5433` para evitar conflito com serviços locais.

Objetivo: permitir uma experiência de aluno sem depender de serviços pagos.

Entregas:

- modelo de conteúdo para trilhas, módulos, aulas e quizzes;
- seed de conteúdo inicial;
- PostgreSQL e ORM;
- login local e papéis básicos;
- progresso de aula e quiz;
- consentimento versionado para termos;
- exportação e exclusão do perfil de teste;
- área do aluno separada do futuro contexto de consultoria.

Autenticação local concluída: Better Auth 1.7.7, sessões por cookie, Argon2id, papéis controlados pelo servidor e cadastro/login/logout testados via HTTP. O servidor de smoke foi executado em `localhost:3101` porque `3000` e `3001` já estavam ocupadas por outros containers.

Gate:

- aluno não acessa uma trilha sem matrícula;
- progresso persiste após reiniciar a aplicação;
- um usuário não acessa dados de outro;
- migração e restauração do banco são testadas.

## Step 4: área profissional separada

Só iniciar depois da validação jurídica do profissional.

Entregas:

- papéis `consultor`, `cliente` e `admin`;
- contratos e consentimentos próprios;
- clientes isolados por organização/consultor;
- agenda e registro de sessões;
- documentos privados e auditoria de leitura/escrita;
- suitability apenas quando aplicável ao enquadramento;
- retenção regulatória conciliada com direitos LGPD.

Gate:

- política de autorização por recurso testada;
- nenhum documento ou nota atravessa clientes;
- registros sensíveis possuem trilha de auditoria;
- contratos e textos foram revisados por profissional competente.

## Step 5: currículo e métodos de análise

Entregas:

- fundamentos: CVM, B3, Banco Central, Tesouro, ANBIMA, FGC e Receita;
- renda fixa, Tesouro, ações, FIIs, ETFs e índices;
- laboratório histórico de Graham, Bazin, Greenblatt, Lynch, Buffett, Fisher, Piotroski e O'Shaughnessy;
- casos com data, premissas e fonte;
- comparação de métodos sem ranking atual ou recomendação;
- exercícios de leitura de demonstrações e relatórios.

Gate:

- cada aula possui objetivo, exercício, fonte e revisão;
- dados de mercado têm licença compatível com a exibição;
- nenhum laboratório produz “compre” ou “venda” personalizado;
- vieses de sobrevivência, hindsight e look-ahead são explicados.

## Step 6: dados históricos

Ordem recomendada:

1. BCB/SGS para macroindicadores.
2. Tesouro Transparente para dados do Tesouro.
3. Dados abertos da CVM para fundamentos e documentos.
4. Provedor de ações/FIIs com licença compatível.

`yfinance` pode ser usado somente em desenvolvimento interno até que a fonte e os termos de redistribuição sejam validados.

Arquitetura prevista:

```text
fonte -> ingestão idempotente -> raw imutável -> Parquet normalizado
      -> DuckDB/catálogo -> API da aplicação -> aula ou simulador
```

Cada série terá fonte, data do dado, data de coleta, licença, atraso, versão e validação.

## Step 7: migração para o NAS

Pré-requisitos:

- RAM, SSD, RAID e nobreak verificados;
- produção e staging separados;
- backup e restauração cronometrados;
- segredos fora do Git;
- imagens fixadas por versão;
- monitoramento externo;
- runbook de rollback e migração para VPS.

O NAS não deve servir vídeos pesados. O app e os dados leves podem ir para ele; vídeos ficam em serviço compatível com custo e licença definidos.

## Regra de avanço

Não adicionar carteira, integração com corretora, cotações em tempo real, apoio ao IR ou recomendações personalizadas antes de validar o núcleo educacional e os limites regulatórios.

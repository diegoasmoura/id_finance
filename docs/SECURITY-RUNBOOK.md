# Security Runbook

## Segredos

- Nunca commit `.env`, tokens Cloudflare, senhas de banco ou chaves Better Auth.
- Use `BETTER_AUTH_SECRET` diferente em desenvolvimento, staging e produção.
- Rotacione segredos após qualquer exposição.
- Gere `POSTGRES_PASSWORD` com `openssl rand -hex 32`. Caracteres `/`, `+`, `@` e `:` quebram a URL do banco no Compose.
- `BETTER_AUTH_URL` tem de ser exatamente o endereço aberto no navegador.

## Administração

- 2FA obrigatório para contas administrativas antes do lançamento pago.
- Portainer, TOS e SSH restritos à rede local/VPN.
- Não abra portas de PostgreSQL, nem a porta do app, no roteador. O acesso externo fica por Tailscale ou por um túnel, sem publicar o Postgres.

## Dados

- O MVP não conecta corretoras nem bancos.
- Dados de consultoria devem ficar separados por cliente e com auditoria.
- Backups devem ser criptografados e testados.

## Incidente

1. Conter: desligar acesso externo se necessário.
2. Preservar logs e identificar o período afetado.
3. Rotacionar segredos comprometidos.
4. Avaliar titulares e obrigações legais com o responsável jurídico/DPO.
5. Registrar causa, impacto e correção.

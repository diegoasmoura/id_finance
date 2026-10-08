#!/usr/bin/env sh
set -eu

: "${BACKUP_DIR:=./backups}"
: "${POSTGRES_CONTAINER:=id-finance-db}"
: "${POSTGRES_USER:=app}"
: "${POSTGRES_DB:=investimentos}"
: "${BACKUP_PASSPHRASE:=}"

mkdir -p "$BACKUP_DIR"
timestamp="$(date -u +%Y%m%dT%H%M%SZ)"
target="$BACKUP_DIR/${POSTGRES_DB}-${timestamp}.dump"

if [ -n "$BACKUP_PASSPHRASE" ]; then
  docker exec "$POSTGRES_CONTAINER" pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" -Fc \
    | openssl enc -aes-256-cbc -salt -pbkdf2 -pass env:BACKUP_PASSPHRASE > "$target.enc"
  target="$target.enc"
else
  docker exec "$POSTGRES_CONTAINER" pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" -Fc > "$target"
fi
chmod 600 "$target"
printf 'Backup criado: %s\n' "$target"

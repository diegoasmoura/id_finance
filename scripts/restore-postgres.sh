#!/usr/bin/env sh
set -eu

: "${BACKUP_FILE:?Defina BACKUP_FILE=/caminho/arquivo.dump}"
: "${POSTGRES_CONTAINER:=id-finance-db}"
: "${POSTGRES_USER:=app}"
: "${POSTGRES_DB:=investimentos}"
: "${BACKUP_PASSPHRASE:=}"

test -f "$BACKUP_FILE"
read confirmation
test "$confirmation" = "RESTAURAR"

case "$BACKUP_FILE" in
  *.enc)
    : "${BACKUP_PASSPHRASE:?BACKUP_PASSPHRASE obrigatoria para dump criptografado}"
    openssl enc -d -aes-256-cbc -pbkdf2 -pass env:BACKUP_PASSPHRASE -in "$BACKUP_FILE" \
      | docker exec -i "$POSTGRES_CONTAINER" pg_restore -U "$POSTGRES_USER" -d "$POSTGRES_DB" --clean --if-exists --no-owner
    ;;
  *)
    docker exec -i "$POSTGRES_CONTAINER" pg_restore -U "$POSTGRES_USER" -d "$POSTGRES_DB" --clean --if-exists --no-owner < "$BACKUP_FILE"
    ;;
esac
printf 'Restauracao concluida.\n'

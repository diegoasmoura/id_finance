#!/usr/bin/env sh
set -eu

: "${APP_URL:=http://localhost:3000}"

status="$(curl -L -s -o /dev/null -w '%{http_code}' "$APP_URL/")"
test "$status" = "200"

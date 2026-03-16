#!/usr/bin/env bash
set -euo pipefail

echo "==> Preparing environment"

if [ ! -f .env ]; then
  cp .env.example .env
fi
#not sure if its working.
# Generate key if missing
if ! grep -q '^APP_KEY=' .env || [ -z "$(grep '^APP_KEY=' .env | cut -d= -f2)" ]; then
  php artisan key:generate --force
fi

echo "==> Running migrations"
php artisan migrate --force

PORT="${PORT:-8080}"

echo "==> Starting Laravel server"
exec php artisan serve --host=0.0.0.0 --port="${PORT}"
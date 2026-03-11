#!/usr/bin/env bash
set -euo pipefail

echo "==> Preparing environment"
if [ ! -f .env ]; then
  echo "==> Creating .env from .env.example"
  cp .env.example .env
fi

echo "==> Ensuring SQLite database exists"
mkdir -p /var/data
if [ ! -f /var/data/database.sqlite ]; then
  touch /var/data/database.sqlite
fi

# Generate app key if missing
if ! grep -q '^APP_KEY=' .env || [ -z "$(grep '^APP_KEY=' .env | cut -d= -f2)" ]; then
  echo "==> Generating APP_KEY"
  php artisan key:generate --force
fi

echo "==> Running migrations"
php artisan migrate --force

PORT="${PORT:-10000}"
echo "==> Starting server on port ${PORT}"
exec php artisan serve --host=0.0.0.0 --port="${PORT}"


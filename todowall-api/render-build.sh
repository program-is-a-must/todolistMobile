#!/usr/bin/env bash
set -euo pipefail

echo "==> Installing PHP dependencies"
composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist

echo "==> Ensuring SQLite database exists at /var/data/database.sqlite"
mkdir -p /var/data
if [ ! -f /var/data/database.sqlite ]; then
  touch /var/data/database.sqlite
fi

echo "==> Caching config, routes, and views"
php artisan config:clear || true
php artisan route:clear || true
php artisan view:clear || true
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "==> Running migrations"
php artisan migrate --force

echo "Build steps complete."


#!/bin/bash
set -euo pipefail

php artisan migrate --force
php -S 0.0.0.0:${PORT:-10000} -t public


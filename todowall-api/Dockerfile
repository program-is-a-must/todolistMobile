FROM php:8.3-cli

RUN apt-get update && apt-get install -y --no-install-recommends \
    git unzip libsqlite3-0 libsqlite3-dev ca-certificates \
    && rm -rf /var/lib/apt/lists/*

RUN docker-php-ext-install pdo pdo_sqlite

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

COPY composer.json composer.lock* ./

ENV COMPOSER_ALLOW_SUPERUSER=1

RUN composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist

COPY . .

RUN php artisan config:cache \
 && php artisan route:cache \
 && php artisan view:cache

RUN chmod +x start.sh

EXPOSE 10000

CMD ["bash", "start.sh"]
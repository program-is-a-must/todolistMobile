FROM php:8.3-cli

RUN apt-get update && apt-get install -y --no-install-recommends \
    git unzip libsqlite3-0 libsqlite3-dev ca-certificates \
    && rm -rf /var/lib/apt/lists/*

RUN docker-php-ext-install pdo pdo_sqlite

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Copy entire Laravel project first
COPY . .

ENV COMPOSER_ALLOW_SUPERUSER=1

# Install dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist

# Cache Laravel configs
RUN php artisan config:clear \
 && php artisan config:cache \
 && php artisan route:cache \
 && php artisan view:cache

RUN chmod +x start.sh

EXPOSE 8080

CMD ["bash", "start.sh"]

#ok with this Dockerfile, you can build the image and run the container for your Laravel application. Make sure to have a `start.sh` script that starts the Laravel server, typically using `php artisan serve --host=
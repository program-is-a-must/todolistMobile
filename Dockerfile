FROM php:8.3-cli AS base

RUN apt-get update && apt-get install -y --no-install-recommends \
    git unzip libsqlite3-0 libsqlite3-dev ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# PHP extensions
RUN docker-php-ext-install pdo pdo_sqlite

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Copy dependency files from todowall-api subdirectory
COPY todowall-api/composer.json ./
COPY todowall-api/composer.lock* ./

ENV COMPOSER_ALLOW_SUPERUSER=1

# Install dependencies optimized for production
RUN composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist

# Copy the rest of the application from todowall-api
COPY todowall-api/ .

# Cache config/routes/views during build for faster boots
RUN php artisan config:cache \
 && php artisan route:cache \
 && php artisan view:cache

# Startup script (using the one in todowall-api)
COPY todowall-api/start.sh /usr/local/bin/start.sh
RUN chmod +x /usr/local/bin/start.sh

EXPOSE 10000
CMD ["bash", "/usr/local/bin/start.sh"]

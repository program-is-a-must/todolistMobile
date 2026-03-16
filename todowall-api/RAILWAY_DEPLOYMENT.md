# Railway Deployment Configuration

This document outlines the changes made to prepare the Laravel project for deployment on Railway without Docker.

## Changes Made

### 1. **Deleted Docker-Related Files**
- ✅ Dockerfile
- ✅ .dockerignore
- ✅ start.sh
- ✅ render-build.sh

### 2. **Database Configuration**
- ✅ Updated `config/database.php`: Changed default connection from `sqlite` to `pgsql`
- ✅ Updated `.env.example`: Configured for PostgreSQL (default, can be overridden via environment variables)

### 3. **Environment Configuration**
- ✅ `.env.example` now uses:
  - `DB_CONNECTION=pgsql`
  - `DB_HOST=127.0.0.1` (will be overridden by Railway)
  - `DB_PORT=5432`
  - `DB_DATABASE=todowall`
  - `DB_USERNAME=postgres`

### 4. **Composer Configuration**
- ✅ Removed SQLite-specific line from `post-create-project-cmd` in `composer.json`
- ✅ Migrations are now PostgreSQL-compatible (no SQLite dependencies)

### 5. **Railway Deployment**
- ✅ Created `Procfile` with proper commands:
  - **Release script**: `php artisan config:cache && php artisan route:cache && php artisan migrate --force`
    - Caches configuration for production
    - Caches routes for better performance
    - Runs database migrations automatically
  - **Web script**: `php artisan serve --host=0.0.0.0 --port=$PORT`
    - Starts Laravel development server accessible on Railway's port

### 6. **Documentation**
- ✅ Updated README.md with comprehensive Railway deployment guide
- ✅ Added Railway-specific instructions and setup steps

## How Railway Will Deploy Your App

1. **Build Phase**
   ```
   composer install --no-dev --optimize-autoloader
   npm install (if npm packages exist)
   ```

2. **Release Phase** (runs once before starting)
   ```
   php artisan config:cache
   php artisan route:cache
   php artisan migrate --force
   ```

3. **Start Phase** (runs your web service)
   ```
   php artisan serve --host=0.0.0.0 --port=$PORT
   ```

## Required Environment Variables on Railway

Set these in Railway Dashboard → Variables:
- `APP_KEY` - Generate locally with `php artisan key:generate --show`
- `APP_ENV=production`
- `APP_DEBUG=false`
- `APP_URL` - Your Railway-provided domain

**Note**: PostgreSQL connection details will be automatically injected by Railway when you add the PostgreSQL plugin.

## Verification Checklist

- [x] No Docker files remaining
- [x] Database defaults to PostgreSQL
- [x] Procfile contains correct release and web commands
- [x] Migrations work with PostgreSQL
- [x] Environment configuration is Railway-compatible
- [x] Config caching enabled for production
- [x] Route caching enabled for performance

## Ready for Deployment!

Your project is now ready to be deployed on Railway:
1. Push changes to your GitHub repository
2. Create a new Railway project and connect your repository
3. Add PostgreSQL plugin for your database
4. Set required environment variables
5. Railway will automatically build and deploy your app

No Docker knowledge required!

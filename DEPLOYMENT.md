# Deployment notes (VPS)

## Image uploads not saving / not showing in production

Admin image uploads (hero photo, skill icons, project thumbnails, certificate
images) are stored on the local **`public`** disk at
`backend/storage/app/public/images/...` and served from `/storage/...` via a
symlink. If uploaded images "save" in the admin but don't appear / aren't on
disk on the VPS, it's almost always one of these — check in order:

### 1. Storage symlink (serving)
```bash
cd /path/to/backend
php artisan storage:link        # creates public/storage -> storage/app/public
ls -l public/storage            # must be a symlink
```

### 2. Storage permissions (saving)
The web-server / PHP-FPM user (often `www-data`) must be able to write to
`storage`. This is the #1 cause of "saved but no file on disk":
```bash
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache
```

### 3. APP_URL (image URLs)
Stored image URLs are built from `APP_URL`. It must be the real public backend
URL (with `https` if behind SSL) — not `http://localhost:8000`:
```dotenv
APP_URL=https://api.your-domain.com
```
```bash
php artisan config:clear        # then optionally: php artisan config:cache
```
(Re-run `php artisan migrate --seed` only on a fresh install; seed image URLs
also follow `APP_URL`.)

### 4. Upload size limits (larger images)
Default Nginx rejects bodies > 1 MB with a 413 before PHP ever runs:
```nginx
# in the server { } block
client_max_body_size 8M;
```
And PHP (php.ini / FPM pool) — must be ≥ the largest image (uploads are capped
at 4 MB by validation):
```ini
upload_max_filesize = 8M
post_max_size = 8M
```
Reload after changes: `sudo systemctl reload nginx php8.x-fpm`.

### Diagnosing
- Check `storage/logs/laravel.log` after a failed upload. The upload helper now
  throws a clear `RuntimeException` when a write fails (instead of silently
  reporting success), so the real cause shows up there.
- Confirm the file actually lands: `ls -la storage/app/public/images/certificates/`.

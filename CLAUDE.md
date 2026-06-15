# CLAUDE.md — Naufal Portfolio

Context file for Claude Code. Read this before touching any file.

---

## Project Overview

Personal portfolio website with CMS admin panel. Built as a monorepo:
- **Backend**: Laravel (REST API, service + repository architecture)
- **Frontend**: React + Vite (SPA, public-facing portfolio)
- **Admin**: React + Vite (SPA, content management)
- **Database**: PostgreSQL
- **File Storage**: Local (`storage/app/public`) for legacy uploads; IDCloudHost S3-compatible bucket (`s3-idcloud` disk) for all new uploads (article thumbnails, inline images)
- **Target deploy**: VPS (Nginx + PHP-FPM + Certbot)

Read Portfolio CMS Frontend for UI UX Design

The portfolio is public-facing (visitors, HR, clients). The admin panel is private (owner only).

---

## Monorepo Structure

```
portfolio/
├── backend/
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   │   └── Api/
│   │   │   │       ├── SectionController.php
│   │   │   │       ├── ArticleController.php
│   │   │   │       ├── HeroController.php
│   │   │   │       └── ...
│   │   │   │   └── Api/Admin/
│   │   │   │       ├── SectionController.php
│   │   │   │       ├── ArticleController.php
│   │   │   │       └── ...
│   │   │   └── Requests/
│   │   ├── Models/
│   │   │   ├── Section.php
│   │   │   ├── Article.php
│   │   │   └── ...
│   │   ├── Services/
│   │   │   ├── SectionService.php
│   │   │   ├── ArticleService.php
│   │   │   ├── ImageUploadService.php
│   │   │   └── ...
│   │   └── Repositories/
│   │       ├── SectionRepository.php
│   │       ├── ArticleRepository.php
│   │       └── ...
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   │       └── SectionSeeder.php   ← seeds 8 default section rows
│   ├── routes/
│   │   └── api.php
│   └── config/
│       └── filesystems.php         ← defines 's3-idcloud' disk
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   └── sections/
│   │   ├── context/
│   │   │   └── SectionsContext.jsx ← provides active sections to all components
│   │   ├── pages/
│   │   │   └── public/
│   │   │       ├── Home.jsx
│   │   │       ├── ArticleList.jsx
│   │   │       └── ArticleDetail.jsx
│   │   ├── hooks/
│   │   └── utils/
│   └── vite.config.js
├── admin/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   │   └── ui/
│   │   ├── pages/
│   │   │   ├── sections/
│   │   │   │   └── Index.jsx
│   │   │   └── articles/
│   │   │       ├── Index.jsx
│   │   │       ├── Create.jsx
│   │   │       └── Edit.jsx
│   │   └── hooks/
│   └── vite.config.js
├── CLAUDE.md
├── ARCHITECTURE.md
├── DATABASE.md
└── API.md
```

---

## Architecture Rules

### Backend (Laravel)

**Service architecture is mandatory.** Controllers are thin — they only:
1. Validate input (via FormRequest)
2. Call a Service method
3. Return JSON response

**Layer rule:** Controller → Service → Repository → Model. No layer skips. Services never return HTTP responses. Repositories only do queries, no logic.

```php
// CORRECT
class ArticleController extends Controller
{
    public function __construct(private ArticleService $service) {}

    public function index(): JsonResponse
    {
        return response()->json($this->service->getPublishedArticles());
    }
}

// WRONG — never put queries or logic in controllers
class ArticleController extends Controller
{
    public function index(): JsonResponse
    {
        $articles = Article::where('status', 'published')
            ->where('published_at', '<=', now())
            ->orderBy('published_at', 'desc')
            ->get();
        return response()->json($articles);
    }
}
```

**API response format** — always consistent:
```json
{ "success": true, "data": {}, "message": "optional" }
```
For errors:
```json
{ "success": false, "message": "Error description", "errors": {} }
```

**API routes** — all prefixed `/api/v1/`. Public routes are unauthenticated. Admin routes require `auth:sanctum`.

### Frontend (React + Vite) — both `frontend/` and `admin/`

**All API calls go through `src/api/`** — never call axios/fetch directly from components.

```js
// src/api/articles.js
import { apiClient } from './client'

export const getArticles = () => apiClient.get('/articles')
export const getArticle = (slug) => apiClient.get(`/articles/${slug}`)
export const createArticle = (data) => apiClient.post('/admin/articles', data)
```

**Component rules:**
- `components/ui/` — zero business logic, no API calls, pure presentational
- `components/sections/` — may use hooks, no direct API calls
- `pages/` — orchestrates sections, owns data fetching via hooks

---

## Section Visibility System

The portfolio supports toggling sections on/off from the admin. The `sections` table is the source of truth.

**Section keys** (fixed, maps to React components):

| Key | Maps to |
|---|---|
| `about` | `<AboutSection />` |
| `skills` | `<SkillsSection />` |
| `projects` | `<ProjectsSection />` |
| `journey` | `<JourneySection />` (experience + education combined) |
| `certificates` | `<CertificatesSection />` |
| `services` | `<ServicesSection />` |
| `articles` | `<ArticlesSection />` |
| `contact` | `<ContactSection />` |

**How it works on the frontend:**
1. On app mount, `frontend/` fetches `GET /api/v1/sections` (returns only active sections, ordered)
2. Result is stored in `SectionsContext`
3. `Home.jsx` renders sections conditionally based on active keys
4. The `order` field from the API also controls render order

```jsx
// frontend/src/pages/public/Home.jsx
const { activeSections } = useSections()
const SECTION_MAP = {
  about: <AboutSection />,
  skills: <SkillsSection />,
  projects: <ProjectsSection />,
  journey: <JourneySection />,
  certificates: <CertificatesSection />,
  services: <ServicesSection />,
  articles: <ArticlesSection />,
  contact: <ContactSection />,
}

return <>{activeSections.map(s => SECTION_MAP[s.key])}</>
```

**Section keys are immutable** — admin can only toggle `is_active` and change `order`. Keys are never created or deleted from the UI.

---

## Articles System

### Storage

All article file uploads (thumbnail, inline images) go to the `s3-idcloud` disk (IDCloudHost S3-compatible bucket). Legacy uploads (hero photo, project thumbnails) remain on the `public` (local) disk — do not migrate them.

```php
// Always specify disk explicitly for article uploads
Storage::disk('s3-idcloud')->put($path, $file);
```

### Rich Text Editor

Admin uses **TipTap** for article body editing. Inline image upload flow:
1. Admin clicks image button in toolbar
2. File is uploaded to `POST /api/v1/admin/articles/upload-image`
3. Backend stores file on `s3-idcloud`, returns `{ "url": "https://..." }`
4. TipTap inserts `<img src="...">` at cursor position

### Scheduled Publish

`published_at` controls visibility:
- `status = draft` → never shown publicly regardless of `published_at`
- `status = published` AND `published_at <= NOW()` → visible
- `status = published` AND `published_at > NOW()` → scheduled, not yet visible

The public endpoint `GET /api/v1/articles` filters by both conditions. No cron job needed — the query handles it.

### SEO Fields

Every article has `meta_title`, `meta_description`, and `og_image` columns. Frontend uses these with fallback:
- `meta_title` → fallback to `title`
- `meta_description` → fallback to `excerpt`
- `og_image` → fallback to `thumbnail`

`read_time` is auto-calculated in `ArticleService` by stripping HTML from content, counting words, dividing by 200 (WPM).

`slug` is auto-generated from `title` via `Str::slug()`. If duplicate, append `-2`, `-3`, etc. Admin can override manually.

---

## File Storage Configuration

Two disks defined in `config/filesystems.php`:

```php
// Existing — do not change
'public' => [
    'driver' => 'local',
    'root'   => storage_path('app/public'),
    'url'    => env('APP_URL') . '/storage',
    'visibility' => 'public',
],

// New — for article uploads
's3-idcloud' => [
    'driver'                  => 's3',
    'key'                     => env('IDCLOUD_ACCESS_KEY'),
    'secret'                  => env('IDCLOUD_SECRET_KEY'),
    'region'                  => env('IDCLOUD_REGION'),
    'bucket'                  => env('IDCLOUD_BUCKET'),
    'url'                     => env('IDCLOUD_URL'),
    'endpoint'                => env('IDCLOUD_ENDPOINT'),
    'use_path_style_endpoint' => true,
    'visibility'              => 'public',
],
```

Required `.env` additions:
```
IDCLOUD_ACCESS_KEY=
IDCLOUD_SECRET_KEY=
IDCLOUD_REGION=
IDCLOUD_BUCKET=
IDCLOUD_ENDPOINT=
IDCLOUD_URL=
```

---

## Authentication

Admin auth uses **Laravel Sanctum** (SPA mode):
- `POST /api/v1/auth/login` — returns token
- `POST /api/v1/auth/logout`
- Frontend stores token in `localStorage` under key `portfolio_admin_token`
- Axios interceptor attaches token via `Authorization: Bearer`
- One admin user only. No registration endpoint. User is seeded.

---

## Database Conventions

- PostgreSQL — do not switch
- All tables: `id` (bigint), `created_at`, `updated_at`
- Soft deletes (`deleted_at`) on all content tables
- `order` integer column on ordered content (skills, projects, services, contacts, sections)
- `jsonb` for JSON columns (not `json`)
- Migrations must implement `down()`

See `DATABASE.md` for full schema.

---

## Dev Commands

```bash
# Backend
cd backend
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate --seed
php artisan serve              # :8000

# Frontend (public)
cd frontend
npm install
npm run dev                    # :5173

# Admin
cd admin
npm install
npm run dev                    # :5174
```

## Environment Variables

Backend `.env`:
```
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173
DB_CONNECTION=pgsql
DB_DATABASE=portfolio
SANCTUM_STATEFUL_DOMAINS=localhost:5173,localhost:5174
IDCLOUD_ACCESS_KEY=
IDCLOUD_SECRET_KEY=
IDCLOUD_REGION=
IDCLOUD_BUCKET=
IDCLOUD_ENDPOINT=
IDCLOUD_URL=
```

Frontend `.env`:
```
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

---

## Admin Frontend — Key Libraries

```bash
# Sections drag-reorder
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities

# Article rich text editor
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-image \
  @tiptap/extension-link @tiptap/extension-placeholder
```

---

## Frontend Public — Key Libraries

```bash
# SEO meta tags
npm install react-helmet-async

# Article prose styling (renders TipTap HTML output correctly)
npm install @tailwindcss/typography
```

---

## What NOT to Do

- Do not put logic in controllers
- Do not put DB queries in controllers or services
- Do not call API directly from components — use `src/api/`
- Do not upload article files to the `public` (local) disk — use `s3-idcloud`
- Do not migrate existing legacy uploads — leave them on local disk
- Do not use MySQL — project uses PostgreSQL
- Do not create new API response formats — use the standard envelope
- Do not add Redis — not in scope
- Do not use Inertia.js — frontend is a separate SPA
- Do not hard-delete content records — always soft delete
- Do not hardcode section keys in the database — they are defined in code and seeded once
- Do not generate placeholder/lorem content in seeders
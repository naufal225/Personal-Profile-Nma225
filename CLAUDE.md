# CLAUDE.md — Naufal Portfolio

Context file for Claude Code. Read this before touching any file.

---

## Project Overview

Personal portfolio website with CMS admin panel. Built as a monorepo:
- **Backend**: Laravel (REST API, service architecture)
- **Frontend**: React + Vite (SPA, consumes API)
- **Database**: PostgreSQL
- **Target deploy**: VPS (Nginx + Certbot)

The portfolio is public-facing (visitors, HR, clients). The admin panel is private (owner only) for managing all content via CRUD.

---

## Monorepo Structure

```
portfolio/
├── backend/                  # Laravel project root
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   │   └── Api/      # All API controllers go here
│   │   │   └── Requests/     # FormRequest validation
│   │   ├── Models/
│   │   ├── Services/         # Business logic — never put logic in controllers
│   │   └── Repositories/     # DB queries abstracted from services
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   ├── routes/
│   │   └── api.php           # Only file for API routes
│   └── ...
├── frontend/                 # React + Vite project root
│   ├── src/
│   │   ├── api/              # Axios instances and API call functions
│   │   ├── components/       # Reusable UI components
│   │   │   ├── ui/           # Primitives (Button, Badge, Card, etc.)
│   │   │   └── sections/     # Page sections (HeroSection, ProjectsSection, etc.)
│   │   ├── pages/
│   │   │   ├── public/       # Portfolio pages (Home, etc.)
│   │   │   └── admin/        # Admin panel pages
│   │   ├── hooks/            # Custom React hooks
│   │   ├── store/            # State management (Zustand or Context)
│   │   └── utils/
│   ├── index.html
│   └── vite.config.js
├── CLAUDE.md                 # This file
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

Never put business logic in controllers. Never put DB queries in controllers.

```php
// CORRECT
class ProjectController extends Controller
{
    public function __construct(private ProjectService $service) {}

    public function index(): JsonResponse
    {
        return response()->json($this->service->getAllProjects());
    }
}

// WRONG — do not do this
class ProjectController extends Controller
{
    public function index(): JsonResponse
    {
        $projects = Project::with('techStacks')->orderBy('order')->get();
        return response()->json($projects);
    }
}
```

**Repository pattern** — Services call Repositories for DB access. Repositories only do queries, no logic.

**API response format** — always consistent:
```json
{
  "success": true,
  "data": {},
  "message": "optional"
}
```
For errors:
```json
{
  "success": false,
  "message": "Error description",
  "errors": {}
}
```

**API routes** — all prefixed `/api/v1/`. Public routes are unauthenticated. Admin routes require `auth:sanctum` middleware.

```php
// routes/api.php structure
Route::prefix('v1')->group(function () {
    // Public
    Route::get('/projects', [ProjectController::class, 'index']);
    Route::get('/skills', [SkillController::class, 'index']);
    // ... etc

    // Admin (protected)
    Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
        Route::apiResource('projects', Admin\ProjectController::class);
        // ... etc
    });
});
```

### Frontend (React + Vite)

**All API calls go through `src/api/`** — never call axios/fetch directly from components or pages.

```js
// src/api/projects.js
import { apiClient } from './client'

export const getProjects = () => apiClient.get('/projects')
export const createProject = (data) => apiClient.post('/admin/projects', data)
```

**Component rules:**
- `components/ui/` — zero business logic, no API calls, pure presentational
- `components/sections/` — may use hooks, no direct API calls
- `pages/` — orchestrates sections, owns data fetching via hooks

**Conditional badges in ProjectCard** — GitHub and Demo links render only when data is not null. Never render an empty badge.

```jsx
{project.github_url && <Badge href={project.github_url}>Source Code</Badge>}
{project.demo_url && <Badge href={project.demo_url}>View Demo</Badge>}
```

---

## Database Conventions

- Use PostgreSQL — do not switch to MySQL
- All tables use `id` (UUID preferred, bigint acceptable)
- All tables have `created_at`, `updated_at`
- Soft deletes (`deleted_at`) on content tables (projects, experience, education, etc.)
- For ordered content (projects, services, skills), include `order` integer column
- Migrations must be reversible — always implement `down()`

See `DATABASE.md` for full schema.

---

## Authentication

Admin auth uses **Laravel Sanctum** (SPA mode):
- `POST /api/v1/auth/login` — returns token
- `POST /api/v1/auth/logout`
- Frontend stores token in `localStorage` under key `portfolio_admin_token`
- Axios interceptor attaches token to every request via `Authorization: Bearer`

There is only one admin user. No registration endpoint. Admin user is seeded.

---

## Content Sections (what the admin manages)

| Section | Model | Notes |
|---|---|---|
| Hero | `HeroContent` | Single record, no list |
| Skills | `Skill` | Has `icon`, `name`, `order` |
| Projects | `Project` | Has `tech_stacks` (JSON or pivot), `github_url?`, `demo_url?` |
| Journey > Experience | `Experience` | Has `skills` (JSON), date range |
| Journey > Education | `Education` | Has date range, description |
| Certificates | `Certificate` | Has `issuer`, `year`, `type` (training/achievement) |
| Services | `Service` | Has `icon`, `title`, `description`, `order` |
| Contact | `Contact` | Multiple records, has `type`, `value`, `url?` |

---

## Dev Commands

```bash
# Backend
cd backend
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate --seed
php artisan serve              # runs on :8000

# Frontend
cd frontend
npm install
npm run dev                    # runs on :5173

# Both at once (from root, if concurrently is installed)
npm run dev
```

---

## Environment Variables

Backend `.env` critical keys:
```
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173   # used for CORS
DB_CONNECTION=pgsql
DB_DATABASE=portfolio
SANCTUM_STATEFUL_DOMAINS=localhost:5173
```

Frontend `.env`:
```
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

---

## CORS

CORS is configured in `config/cors.php`. `FRONTEND_URL` env var controls allowed origins. Do not hardcode URLs.

---

## Deployment (VPS — Nginx + Certbot)

- Backend runs as standard Laravel on PHP-FPM
- Frontend is built (`npm run build`) and served as static files via Nginx
- Nginx routes `/api/*` to PHP-FPM, everything else serves `frontend/dist/index.html`
- SSL via Certbot (Let's Encrypt)
- `.env` on server is never committed to repo

See `DEPLOYMENT.md` for full server setup steps.

---

## What NOT to Do

- Do not put logic in controllers
- Do not call DB directly from controllers
- Do not call API directly from components (use `src/api/`)
- Do not commit `.env` files
- Do not use MySQL — project uses PostgreSQL
- Do not create new API response formats — use the standard format above
- Do not add Redis unless explicitly discussed — not in scope
- Do not use Inertia.js — frontend is a separate SPA
- Do not generate placeholder/lorem content in seeders for prod — use realistic data
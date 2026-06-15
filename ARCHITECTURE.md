# ARCHITECTURE.md

High-level architecture decisions for the portfolio project. Read before designing new features.

---

## System Overview

```
Browser (Visitor)                    Browser (Admin)
       │                                    │
       ▼                                    ▼
  React SPA — frontend/              React SPA — admin/
  portfolio.com                      admin.portfolio.com
       │                                    │
       │ HTTP JSON (REST)                   │ HTTP JSON (REST)
       └──────────────┬─────────────────────┘
                      ▼
               Laravel API
               api.portfolio.com
                      │
          ┌───────────┴────────────┐
          ▼                        ▼
     PostgreSQL              IDCloudHost
                           S3-compatible bucket
                           (article thumbnails,
                            inline images)
```

The two React apps (`frontend/` and `admin/`) are fully decoupled from the backend. They communicate exclusively via REST API. Local `storage/app/public` is used only for legacy uploads (hero photo, project thumbnails) — all new article uploads go to the S3 bucket.

---

## Backend Layer Responsibilities

```
Request
   │
   ▼
FormRequest          ← input validation only
   │
   ▼
Controller           ← thin: receive, delegate, respond
   │
   ▼
Service              ← business logic lives here
   │
   ▼
Repository           ← database queries only
   │
   ▼
Model / Eloquent
```

**Rule:** each layer only talks to the layer directly below it. Controllers never touch Repositories. Services never return HTTP responses. Repositories never contain logic.

---

## Frontend Layer Responsibilities

Applies to both `frontend/` and `admin/`:

```
Page
  │ uses
  ├── Section / Feature Components   ← layout + composition
  │     │ uses
  │     └── UI Components            ← presentational only (no API, no state)
  │
  └── Custom Hooks                   ← data fetching + local state
        │ calls
        └── src/api/                 ← axios wrappers (one file per resource)
              │
              └── API
```

---

## Admin vs Public

Two separate React apps sharing the same backend API:

| App | Folder | Route | Auth |
|---|---|---|---|
| Public portfolio | `frontend/` | `portfolio.com` | No |
| Admin panel | `admin/` | `admin.portfolio.com` | Sanctum token |

Route guard in `admin/`: if no token in `localStorage`, redirect all `/` routes to `/login`.

---

## Section Visibility System

The `sections` table is the source of truth for what the public portfolio shows and in what order. This system controls 8 fixed sections.

**Flow:**

```
admin toggles section
       │
       ▼
PATCH /api/v1/admin/sections/{key}/toggle
       │
       ▼
sections.is_active flipped in DB
       │
       ▼
next visitor page load fetches GET /api/v1/sections
       │
       ▼
only active sections returned (ordered by `order`)
       │
       ▼
SectionsContext updated → Home.jsx re-renders conditionally
```

**`SectionsContext`** in `frontend/src/context/SectionsContext.jsx`:
- Fetches `GET /api/v1/sections` once on app mount
- Exposes `activeSections` (array of `{ key, label, order }`)
- `Home.jsx` maps over `activeSections` and renders the matching component

Section keys are fixed in code. Admin can only change `is_active` and `order` — keys are never created or deleted from the UI.

---

## Articles System

### Upload Flow (Admin → S3)

```
Admin selects image (thumbnail or inline)
       │
       ▼
POST /api/v1/admin/articles/upload-image
  multipart/form-data, field: "image"
       │
       ▼
ImageUploadService → Storage::disk('s3-idcloud')->put(...)
       │
       ▼
Returns { "success": true, "data": { "url": "https://bucket.idcloudhost.com/..." } }
       │
       ▼
TipTap inserts <img src="..."> at cursor (inline)
  OR
thumbnail field stores URL string
```

### Scheduled Publish Flow

```
Admin sets status=published + published_at=future datetime
       │
       ▼
Stored as-is. Article not visible yet.
       │
       ▼
GET /api/v1/articles (public) applies filter:
  WHERE status = 'published' AND published_at <= NOW()
       │
       ▼
Article becomes visible automatically when time is reached
  (no cron or queue needed — query handles it)
```

### Public Article SEO Flow

```
Visitor opens /articles/{slug}
       │
       ▼
ArticleDetail.jsx fetches GET /api/v1/articles/{slug}
       │
       ▼
react-helmet-async injects into <head>:
  - <title> (meta_title ?? title)
  - <meta name="description"> (meta_description ?? excerpt)
  - <meta property="og:image"> (og_image ?? thumbnail)
  - <meta property="og:type" content="article">
  - <meta property="article:published_time">
  - <script type="application/ld+json"> (Article schema)
```

---

## Data Flow: Public Visitor

1. Browser loads `index.html` from Nginx (static build)
2. React hydrates, `SectionsContext` fires `GET /api/v1/sections`
3. `usePortfolioData()` fires remaining API calls in parallel
4. `Home.jsx` renders only sections that are active, in the order returned

---

## Data Flow: Admin Content Update

1. Admin logs in → Sanctum token stored in `localStorage`
2. Admin navigates to e.g. `/articles/create`
3. Page fetches existing data if editing via `GET /api/v1/admin/articles/{id}`
4. Admin fills form, uploads thumbnail → `POST /api/v1/admin/articles/upload-image`
5. Admin submits → `POST /api/v1/admin/articles`
6. Laravel: FormRequest validates → ArticleService processes (slug, read_time, published_at) → ArticleRepository persists
7. Response returned → frontend updates local state or redirects to index

---

## Key Architecture Decisions & Rationale

| Decision | Rationale |
|---|---|
| SPA + REST (not Inertia) | Clean separation; backend agnostic to which frontend consumes it |
| Two separate React apps | `frontend/` and `admin/` have completely different concerns, dependencies, and deployment targets — keeping them separate avoids coupling |
| Service layer | Business logic reusable across HTTP, CLI, and queued jobs |
| Repository layer | DB queries isolated; easier to mock in tests |
| Sanctum (not JWT) | Simpler for single-admin SPA; no token refresh complexity |
| PostgreSQL | Better for `jsonb` columns, full-text search on articles, future analytics |
| Soft deletes on content | Recovery without DB restore |
| `order` column on lists | Reorder without date hacks |
| `sections` table (not config) | Admin can toggle visibility and reorder live without redeployment |
| `s3-idcloud` for article uploads | Object storage scales; local disk doesn't — articles may accumulate large images |
| Legacy uploads stay on local disk | Avoid migration risk; both disks can coexist |
| TipTap for editor | Actively maintained, extensible, good Image extension for inline upload |
| `published_at` filter in query (not cron) | Simple and reliable; no scheduler complexity for scheduled posts |
| No Redis | Traffic volume does not justify caching yet |
| `@tailwindcss/typography` for article prose | TipTap HTML output needs consistent heading/blockquote/code styling without per-element CSS |
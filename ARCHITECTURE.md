# ARCHITECTURE.md

High-level architecture decisions for the portfolio project. Read before designing new features.

---

## System Overview

```
Browser (Visitor / Admin)
        │
        ▼
   React SPA (Vite)
   localhost:5173 / portfolio.com
        │
        │ HTTP JSON (REST)
        ▼
   Laravel API
   localhost:8000 / api.portfolio.com
        │
        ▼
   PostgreSQL
```

The frontend and backend are fully decoupled. They communicate exclusively via REST API. No server-side rendering, no Blade views served to the client (except the initial HTML shell from Vite).

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

**Rule**: each layer only talks to the layer directly below it. Controllers never touch Repositories. Services never return HTTP responses.

---

## Frontend Layer Responsibilities

```
Page
  │ uses
  ├── Section Components    ← layout + composition
  │     │ uses
  │     └── UI Components   ← presentational only
  │
  └── Custom Hooks          ← data fetching + state
        │ calls
        └── src/api/        ← axios wrappers
              │
              └── API
```

---

## Admin vs Public

Two distinct areas in the frontend, sharing the same React app:

| Area | Route prefix | Auth required |
|---|---|---|
| Public portfolio | `/` | No |
| Admin panel | `/admin` | Yes (Sanctum token) |

Route guard: if no token in localStorage, redirect `/admin/*` to `/admin/login`.

---

## Data Flow: Public Visitor

1. Browser loads `index.html` from Nginx (static)
2. React hydrates, renders skeleton
3. `usePortfolioData()` hook fires API calls in parallel
4. Sections render as data arrives

---

## Data Flow: Admin Content Update

1. Admin logs in → receives Sanctum token → stored in localStorage
2. Admin navigates to e.g. `/admin/projects`
3. Page fetches current data via `GET /api/v1/admin/projects`
4. Admin submits form → `POST/PUT /api/v1/admin/projects/:id`
5. Laravel validates → Service processes → Repository persists
6. Response returned → frontend updates local state

---

## Key Architecture Decisions & Rationale

| Decision | Rationale |
|---|---|
| SPA + REST (not Inertia) | Clean separation; frontend can be replaced or mobile app added later without touching backend |
| Service layer | Keeps controllers testable and thin; business logic reusable across CLI commands, queued jobs, etc. |
| Repository layer | Swappable data sources; easier to mock in tests |
| Sanctum (not JWT) | Simpler for single-admin SPA; no token refresh complexity |
| PostgreSQL | Better for JSON columns, full-text search, future analytics |
| Soft deletes on content | Content recovery without DB restore |
| `order` column on lists | Admin can reorder skills/services/projects without date hacks |
| No Redis | Traffic volume does not justify caching layer yet; add when needed |
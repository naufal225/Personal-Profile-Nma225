# API.md

REST API reference for the portfolio project. Base URL: `/api/v1`

All responses follow this envelope:
```json
{ "success": true, "data": {}, "message": "optional" }
{ "success": false, "message": "Error description", "errors": {} }
```

---

## Authentication

### POST `/auth/login`
```json
// Request
{ "email": "admin@portfolio.com", "password": "secret" }

// Response
{ "success": true, "data": { "token": "1|abc..." } }
```

### POST `/auth/logout`
Requires: `Authorization: Bearer {token}`
```json
{ "success": true, "message": "Logged out" }
```

### GET `/auth/me`
Requires: `Authorization: Bearer {token}`
```json
{ "success": true, "data": { "id": 1, "name": "Naufal", "email": "admin@portfolio.com" } }
```

---

## Public Endpoints (no auth required)

### GET `/hero`
Returns single hero content record.

### GET `/skills`
Returns all skills. Ordered by `order ASC`.

### GET `/projects`
Returns all projects. Ordered by `order ASC`.

### GET `/experiences`
Returns all experiences. Ordered by `start_date DESC`.

### GET `/educations`
Returns all educations. Ordered by `start_year DESC`.

### GET `/certificates`
Returns all certificates. Ordered by `year DESC`.

### GET `/services`
Returns all services. Ordered by `order ASC`.

### GET `/contacts`
Returns all contacts. Ordered by `order ASC`.

### GET `/sections`
Returns only **active** sections, ordered by `order ASC`. Used by the public frontend to determine which sections to render and in what order.

```json
// Response
{
  "success": true,
  "data": [
    { "key": "about",    "label": "About",    "order": 0 },
    { "key": "skills",   "label": "Skills",   "order": 1 },
    { "key": "projects", "label": "Projects", "order": 2 },
    { "key": "articles", "label": "Articles", "order": 6 },
    { "key": "contact",  "label": "Contact",  "order": 7 }
  ]
}
```

Note: `is_active` is not included in the public response — inactive sections are simply omitted.

### GET `/articles`
Returns published articles visible to the public.

Filters: `status = 'published'` AND `published_at <= NOW()`
Order: `published_at DESC`

Optional query params:
- `?page=1` — pagination (default page size: 10)

```json
// Response
{
  "success": true,
  "data": {
    "data": [
      {
        "id": 1,
        "title": "Belajar Laravel dari Nol",
        "slug": "belajar-laravel-dari-nol",
        "excerpt": "Panduan lengkap memulai Laravel...",
        "thumbnail": "https://bucket.idcloudhost.com/articles/thumb-abc.jpg",
        "published_at": "2025-05-01T10:00:00Z",
        "read_time": 5
      }
    ],
    "meta": { "current_page": 1, "last_page": 3, "total": 28 }
  }
}
```

### GET `/articles/{slug}`
Returns a single published article by slug.

Returns 404 if not found or not yet published (`published_at > NOW()` or `status = draft`).

```json
// Response
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Belajar Laravel dari Nol",
    "slug": "belajar-laravel-dari-nol",
    "excerpt": "Panduan lengkap...",
    "thumbnail": "https://bucket.idcloudhost.com/articles/thumb-abc.jpg",
    "content": "<h2>Intro</h2><p>...</p>",
    "published_at": "2025-05-01T10:00:00Z",
    "read_time": 5,
    "meta_title": "Belajar Laravel | Naufal",
    "meta_description": "Panduan lengkap...",
    "og_image": "https://bucket.idcloudhost.com/articles/og-abc.jpg"
  }
}
```

---

## Admin Endpoints (auth required)

All prefixed `/admin/`. Require `Authorization: Bearer {token}`.

---

### Hero

| Method | Endpoint | Action |
|---|---|---|
| GET | `/admin/hero` | Get hero content |
| PUT | `/admin/hero` | Update hero content |

---

### Skills

| Method | Endpoint | Action |
|---|---|---|
| GET | `/admin/skills` | List all (including soft-deleted optionally) |
| GET | `/admin/skills/{id}` | Get single |
| POST | `/admin/skills` | Create |
| PUT | `/admin/skills/{id}` | Update |
| DELETE | `/admin/skills/{id}` | Soft delete |
| POST | `/admin/skills/reorder` | Reorder (see reorder format below) |

---

### Projects

| Method | Endpoint | Action |
|---|---|---|
| GET | `/admin/projects` | List all |
| GET | `/admin/projects/{id}` | Get single |
| POST | `/admin/projects` | Create |
| PUT | `/admin/projects/{id}` | Update |
| DELETE | `/admin/projects/{id}` | Soft delete |
| POST | `/admin/projects/reorder` | Reorder |

---

### Experiences

| Method | Endpoint | Action |
|---|---|---|
| GET | `/admin/experiences` | List all |
| GET | `/admin/experiences/{id}` | Get single |
| POST | `/admin/experiences` | Create |
| PUT | `/admin/experiences/{id}` | Update |
| DELETE | `/admin/experiences/{id}` | Soft delete |

---

### Educations

| Method | Endpoint | Action |
|---|---|---|
| GET | `/admin/educations` | List all |
| GET | `/admin/educations/{id}` | Get single |
| POST | `/admin/educations` | Create |
| PUT | `/admin/educations/{id}` | Update |
| DELETE | `/admin/educations/{id}` | Soft delete |

---

### Certificates

| Method | Endpoint | Action |
|---|---|---|
| GET | `/admin/certificates` | List all |
| GET | `/admin/certificates/{id}` | Get single |
| POST | `/admin/certificates` | Create |
| PUT | `/admin/certificates/{id}` | Update |
| DELETE | `/admin/certificates/{id}` | Soft delete |
| POST | `/admin/certificates/reorder` | Reorder |

---

### Services

| Method | Endpoint | Action |
|---|---|---|
| GET | `/admin/services` | List all |
| GET | `/admin/services/{id}` | Get single |
| POST | `/admin/services` | Create |
| PUT | `/admin/services/{id}` | Update |
| DELETE | `/admin/services/{id}` | Soft delete |
| POST | `/admin/services/reorder` | Reorder |

---

### Contacts

| Method | Endpoint | Action |
|---|---|---|
| GET | `/admin/contacts` | List all |
| GET | `/admin/contacts/{id}` | Get single |
| POST | `/admin/contacts` | Create |
| PUT | `/admin/contacts/{id}` | Update |
| DELETE | `/admin/contacts/{id}` | Soft delete |

---

### Sections

Admin manages visibility and order of the 8 portfolio sections.

| Method | Endpoint | Action |
|---|---|---|
| GET | `/admin/sections` | List all sections with `is_active` and `order` |
| PATCH | `/admin/sections/{key}` | Toggle `is_active` for a section |
| POST | `/admin/sections/reorder` | Reorder sections (same format as other reorder endpoints) |

Note: `{key}` is the section key string (e.g. `skills`, `projects`), not a numeric ID.

```json
// GET /admin/sections — Response
{
  "success": true,
  "data": [
    { "key": "about",        "label": "About",        "is_active": true,  "order": 0 },
    { "key": "skills",       "label": "Skills",       "is_active": true,  "order": 1 },
    { "key": "projects",     "label": "Projects",     "is_active": true,  "order": 2 },
    { "key": "journey",      "label": "Journey",      "is_active": true,  "order": 3 },
    { "key": "certificates", "label": "Certificates", "is_active": false, "order": 4 },
    { "key": "services",     "label": "Services",     "is_active": true,  "order": 5 },
    { "key": "articles",     "label": "Articles",     "is_active": true,  "order": 6 },
    { "key": "contact",      "label": "Contact",      "is_active": true,  "order": 7 }
  ]
}

// PATCH /admin/sections/certificates — Response (after toggle)
{
  "success": true,
  "data": { "key": "certificates", "label": "Certificates", "is_active": true, "order": 4 },
  "message": "Section updated"
}

// POST /admin/sections/reorder — Request body (same as other reorder endpoints)
[
  { "key": "about",    "order": 0 },
  { "key": "projects", "order": 1 },
  { "key": "skills",   "order": 2 }
]
```

---

### Articles

| Method | Endpoint | Action |
|---|---|---|
| GET | `/admin/articles` | List all articles (all statuses) |
| GET | `/admin/articles/{id}` | Get single article by ID |
| POST | `/admin/articles` | Create article |
| PUT | `/admin/articles/{id}` | Update article |
| DELETE | `/admin/articles/{id}` | Soft delete |
| POST | `/admin/articles/upload-image` | Upload image for inline use in editor |
| PATCH | `/admin/articles/{id}/publish` | Publish immediately (sets `published_at = now()`) |
| PATCH | `/admin/articles/{id}/unpublish` | Revert to draft |

**GET `/admin/articles` — optional query params:**
- `?status=draft` or `?status=published` — filter by status
- `?page=1` — pagination

```json
// POST /admin/articles — Request body
{
  "title": "Belajar Laravel dari Nol",
  "slug": "belajar-laravel-dari-nol",         // optional — auto-generated if omitted
  "excerpt": "Panduan lengkap...",             // optional
  "thumbnail": "https://bucket.../thumb.jpg", // optional — URL from upload-image endpoint
  "content": "<h2>Intro</h2><p>...</p>",
  "status": "draft",                           // "draft" | "published"
  "published_at": "2025-06-01T08:00:00Z",     // optional — future = scheduled
  "meta_title": "Override SEO Title",         // optional
  "meta_description": "Override description", // optional
  "og_image": "https://bucket.../og.jpg"      // optional
}

// POST /admin/articles/upload-image — Request
// multipart/form-data, field name: "image"

// POST /admin/articles/upload-image — Response
{
  "success": true,
  "data": { "url": "https://bucket.idcloudhost.com/articles/images/abc123.jpg" }
}
```

The `url` returned from `upload-image` is used directly by TipTap to insert `<img src="...">` into the article body, and can also be used for the `thumbnail` or `og_image` fields.

---

## Shared Conventions

### Reorder endpoint format
All `POST /admin/{resource}/reorder` endpoints accept the same format:
```json
// For numeric-ID resources
[
  { "id": 3, "order": 0 },
  { "id": 1, "order": 1 },
  { "id": 5, "order": 2 }
]

// For sections (keyed by string)
[
  { "key": "about",    "order": 0 },
  { "key": "projects", "order": 1 },
  { "key": "skills",   "order": 2 }
]
```

### Soft delete
`DELETE` endpoints always soft delete — sets `deleted_at`, never hard deletes. Soft-deleted records do not appear in any list endpoint (public or admin) unless explicitly filtered.

### File uploads
- Use `multipart/form-data` for any request that includes a file
- All article file uploads (thumbnail, inline images) are stored on the `s3-idcloud` disk and return a full public URL
- Legacy file uploads (hero photo, project thumbnails) use Laravel local storage and return a relative path

### Null values
- `end_date` / `end_year` set to `null` renders as "Present" on frontend
- `published_at = null` with `status = published` should not occur — backend always sets `published_at = now()` if publishing immediately
- Optional SEO fields (`meta_title`, `meta_description`, `og_image`) — frontend falls back to primary fields when null
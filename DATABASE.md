# DATABASE.md

PostgreSQL schema for the portfolio project. All migrations must match this spec.

---

## Tables

### `hero_contents`
Single-row table. Always seed one record. Never allow delete from admin.

| Column | Type | Notes |
|---|---|---|
| id | bigint PK | |
| headline | varchar(255) | e.g. "Full-Stack Engineer" |
| subheadline | text | short bio paragraph |
| photo_path | varchar(255) | nullable, stored on local `public` disk |
| available_for_work | boolean | default true — controls "Available" badge |
| created_at | timestamp | |
| updated_at | timestamp | |

---

### `skills`

| Column | Type | Notes |
|---|---|---|
| id | bigint PK | |
| name | varchar(100) | e.g. "Laravel" |
| icon | varchar(100) | icon identifier (e.g. Devicon class or Tabler icon name) |
| category | varchar(50) | nullable — e.g. "Backend", "Frontend", "DevOps" |
| order | integer | default 0 |
| created_at | timestamp | |
| updated_at | timestamp | |
| deleted_at | timestamp | nullable, soft delete |

---

### `projects`

| Column | Type | Notes |
|---|---|---|
| id | bigint PK | |
| title | varchar(255) | |
| description | text | |
| tech_stacks | jsonb | array of strings e.g. `["Laravel", "React"]` |
| github_url | varchar(500) | nullable — badge only renders if not null |
| demo_url | varchar(500) | nullable — badge only renders if not null |
| thumbnail_path | varchar(255) | nullable, stored on local `public` disk |
| order | integer | default 0 |
| created_at | timestamp | |
| updated_at | timestamp | |
| deleted_at | timestamp | nullable, soft delete |

---

### `experiences`

| Column | Type | Notes |
|---|---|---|
| id | bigint PK | |
| title | varchar(255) | e.g. "Wakil Ketua" |
| organization | varchar(255) | e.g. "SMK Telesandi" |
| description | text | nullable |
| skills | jsonb | array of strings |
| start_date | date | |
| end_date | date | nullable — null renders as "Present" |
| created_at | timestamp | |
| updated_at | timestamp | |
| deleted_at | timestamp | nullable, soft delete |

Display order: `ORDER BY start_date DESC`

---

### `educations`

| Column | Type | Notes |
|---|---|---|
| id | bigint PK | |
| institution | varchar(255) | |
| major | varchar(255) | nullable |
| description | text | nullable — achievements, notes |
| start_year | smallint | |
| end_year | smallint | nullable — null renders as "Present" |
| created_at | timestamp | |
| updated_at | timestamp | |
| deleted_at | timestamp | nullable, soft delete |

Display order: `ORDER BY start_year DESC`

---

### `certificates`

| Column | Type | Notes |
|---|---|---|
| id | bigint PK | |
| title | varchar(255) | |
| issuer | varchar(255) | |
| year | smallint | |
| type | varchar(50) | `training` \| `achievement` \| `competition` |
| credential_url | varchar(500) | nullable |
| created_at | timestamp | |
| updated_at | timestamp | |
| deleted_at | timestamp | nullable, soft delete |

---

### `services`

| Column | Type | Notes |
|---|---|---|
| id | bigint PK | |
| title | varchar(255) | |
| description | text | |
| icon | varchar(100) | Tabler icon name |
| order | integer | default 0 |
| created_at | timestamp | |
| updated_at | timestamp | |
| deleted_at | timestamp | nullable, soft delete |

---

### `contacts`

| Column | Type | Notes |
|---|---|---|
| id | bigint PK | |
| type | varchar(50) | e.g. `email`, `linkedin`, `github`, `whatsapp` |
| label | varchar(100) | display label e.g. "LinkedIn" |
| value | varchar(255) | e.g. email address or profile URL |
| url | varchar(500) | nullable — clickable link if applicable |
| order | integer | default 0 |
| created_at | timestamp | |
| updated_at | timestamp | |
| deleted_at | timestamp | nullable, soft delete |

---

### `sections`
Controls which sections are visible on the public portfolio and in what order. Seeded once with 8 rows. Keys are immutable — admin can only toggle `is_active` and change `order`.

| Column | Type | Notes |
|---|---|---|
| id | bigint PK | |
| key | varchar(50) | unique — `about`, `skills`, `projects`, `journey`, `certificates`, `services`, `articles`, `contact` |
| label | varchar(100) | display name shown in admin UI e.g. "About", "Journey" |
| is_active | boolean | default true |
| order | integer | default 0 — controls render order on public page |
| created_at | timestamp | |
| updated_at | timestamp | |

No soft delete — these rows are permanent. No `deleted_at`.

**Seed data (SectionSeeder):**

| order | key | label | is_active |
|---|---|---|---|
| 0 | about | About | true |
| 1 | skills | Skills | true |
| 2 | projects | Projects | true |
| 3 | journey | Journey | true |
| 4 | certificates | Certificates | true |
| 5 | services | Services | true |
| 6 | articles | Articles | true |
| 7 | contact | Contact | true |

---

### `articles`

| Column | Type | Notes |
|---|---|---|
| id | bigint PK | |
| title | varchar(255) | |
| slug | varchar(255) | unique — auto-generated from title, admin can override |
| excerpt | text | nullable — shown on article cards and used as meta description fallback |
| thumbnail | varchar(255) | nullable — path/URL on `s3-idcloud` disk |
| content | longtext | HTML output from TipTap editor |
| status | varchar(20) | `draft` \| `published` |
| published_at | timestamp | nullable — null = draft or scheduled future publish |
| meta_title | varchar(255) | nullable — SEO title override; fallback to `title` |
| meta_description | text | nullable — SEO description override; fallback to `excerpt` |
| og_image | varchar(255) | nullable — social share image override; fallback to `thumbnail` |
| read_time | integer | nullable — estimated minutes, auto-calculated on save |
| created_at | timestamp | |
| updated_at | timestamp | |
| deleted_at | timestamp | nullable, soft delete |

**Visibility logic (evaluated at query time):**
- Visible publicly when: `status = 'published'` AND `published_at <= NOW()`
- Scheduled (not yet visible): `status = 'published'` AND `published_at > NOW()`
- Draft: `status = 'draft'` regardless of `published_at`

**Slug uniqueness:** On generate, check for collision; append `-2`, `-3`, etc. if taken.

**`read_time` calculation:** Strip HTML tags from `content`, count words, divide by 200 (average WPM), round up.

Display order (public): `ORDER BY published_at DESC`

---

### `users`
Admin user only. No public registration.

| Column | Type | Notes |
|---|---|---|
| id | bigint PK | |
| name | varchar(255) | |
| email | varchar(255) | unique |
| password | varchar(255) | bcrypt hashed |
| created_at | timestamp | |
| updated_at | timestamp | |

Seeded via `DatabaseSeeder`. Only one record ever exists.

---

## Conventions

- All foreign keys use `cascade` on delete where applicable
- `jsonb` preferred over `json` in PostgreSQL (indexed, queryable)
- `deleted_at` = soft delete on all content tables — never hard delete from admin UI
- `order` column = drag-to-reorder in admin; always `ORDER BY order ASC` for display
- `end_date / end_year = null` renders as "Present" on frontend
- Article and all new file uploads go to `s3-idcloud` disk; legacy uploads stay on local `public` disk
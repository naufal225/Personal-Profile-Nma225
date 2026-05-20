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
| photo_path | varchar(255) | nullable, stored in `storage/` |
| available_for_work | boolean | default true — controls "Available" badge |
| resume_url | varchar(255) | nullable, link to CV file |
| created_at | timestamp | |
| updated_at | timestamp | |

---

### `skills`

| Column | Type | Notes |
|---|---|---|
| id | bigint PK | |
| name | varchar(100) | e.g. "Laravel" |
| icon | varchar(100) | icon identifier (e.g. Tabler icon name or Devicon class) |
| category | varchar(50) | nullable — e.g. "Backend", "Frontend", "DevOps" |
| order | integer | default 0, used for display ordering |
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
| tech_stacks | jsonb | array of strings, e.g. `["Laravel", "React", "PostgreSQL"]` |
| github_url | varchar(500) | nullable — badge only renders if not null |
| demo_url | varchar(500) | nullable — badge only renders if not null |
| thumbnail_path | varchar(255) | nullable |
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
| end_date | date | nullable — null means "present" |
| created_at | timestamp | |
| updated_at | timestamp | |
| deleted_at | timestamp | nullable, soft delete |

Display order: `ORDER BY start_date DESC` (LIFO — most recent first).

---

### `educations`

| Column | Type | Notes |
|---|---|---|
| id | bigint PK | |
| institution | varchar(255) | |
| major | varchar(255) | nullable |
| description | text | nullable — achievements, notes |
| start_year | smallint | |
| end_year | smallint | nullable — null means "present" |
| created_at | timestamp | |
| updated_at | timestamp | |
| deleted_at | timestamp | nullable, soft delete |

Display order: `ORDER BY start_year DESC` (LIFO).

---

### `certificates`

| Column | Type | Notes |
|---|---|---|
| id | bigint PK | |
| title | varchar(255) | |
| issuer | varchar(255) | |
| year | smallint | |
| type | varchar(50) | enum-like: `training`, `achievement`, `competition` |
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
| label | varchar(100) | display label, e.g. "LinkedIn" |
| value | varchar(255) | e.g. "naufal@email.com" or "linkedin.com/in/naufal" |
| url | varchar(500) | nullable — clickable URL if applicable |
| order | integer | default 0 |
| created_at | timestamp | |
| updated_at | timestamp | |
| deleted_at | timestamp | nullable, soft delete |

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
- `deleted_at` = soft delete — never hard delete content records from admin UI
- `order` column = drag-to-reorder in admin; always `ORDER BY order ASC` when fetching for display
- Dates stored as `date` (not datetime) for experience/education — precision not needed
- `end_date / end_year = null` renders as "Present" on frontend
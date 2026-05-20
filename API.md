# API.md

REST API reference for the portfolio project. Base URL: `/api/v1`

All responses follow this envelope:
```json
{ "success": true, "data": {}, "message": "optional" }
{ "success": false, "message": "Error", "errors": {} }
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
// Response
{ "success": true, "message": "Logged out" }
```

---

## Public Endpoints (no auth)

### GET `/hero`
Returns single hero content record.

### GET `/skills`
Returns all skills ordered by `order ASC`.

### GET `/projects`
Returns all projects ordered by `order ASC`.

### GET `/experiences`
Returns all experiences ordered by `start_date DESC`.

### GET `/educations`
Returns all educations ordered by `start_year DESC`.

### GET `/certificates`
Returns all certificates ordered by `year DESC`.

### GET `/services`
Returns all services ordered by `order ASC`.

### GET `/contacts`
Returns all contacts ordered by `order ASC`.

---

## Admin Endpoints (auth required)

All prefixed `/admin/`. Require `Authorization: Bearer {token}`.

### Hero
| Method | Endpoint | Action |
|---|---|---|
| GET | `/admin/hero` | Get hero content |
| PUT | `/admin/hero` | Update hero content |

### Skills
| Method | Endpoint | Action |
|---|---|---|
| GET | `/admin/skills` | List all |
| POST | `/admin/skills` | Create |
| PUT | `/admin/skills/{id}` | Update |
| DELETE | `/admin/skills/{id}` | Soft delete |
| POST | `/admin/skills/reorder` | Update `order` for all (accepts array of `{id, order}`) |

### Projects
| Method | Endpoint | Action |
|---|---|---|
| GET | `/admin/projects` | List all |
| POST | `/admin/projects` | Create |
| PUT | `/admin/projects/{id}` | Update |
| DELETE | `/admin/projects/{id}` | Soft delete |
| POST | `/admin/projects/reorder` | Reorder |

### Experiences
| Method | Endpoint | Action |
|---|---|---|
| GET | `/admin/experiences` | List all |
| POST | `/admin/experiences` | Create |
| PUT | `/admin/experiences/{id}` | Update |
| DELETE | `/admin/experiences/{id}` | Soft delete |

### Educations
| Method | Endpoint | Action |
|---|---|---|
| GET | `/admin/educations` | List all |
| POST | `/admin/educations` | Create |
| PUT | `/admin/educations/{id}` | Update |
| DELETE | `/admin/educations/{id}` | Soft delete |

### Certificates
| Method | Endpoint | Action |
|---|---|---|
| GET | `/admin/certificates` | List all |
| POST | `/admin/certificates` | Create |
| PUT | `/admin/certificates/{id}` | Update |
| DELETE | `/admin/certificates/{id}` | Soft delete |

### Services
| Method | Endpoint | Action |
|---|---|---|
| GET | `/admin/services` | List all |
| POST | `/admin/services` | Create |
| PUT | `/admin/services/{id}` | Update |
| DELETE | `/admin/services/{id}` | Soft delete |
| POST | `/admin/services/reorder` | Reorder |

### Contacts
| Method | Endpoint | Action |
|---|---|---|
| GET | `/admin/contacts` | List all |
| POST | `/admin/contacts` | Create |
| PUT | `/admin/contacts/{id}` | Update |
| DELETE | `/admin/contacts/{id}` | Soft delete |

---

## Notes

- `DELETE` is always soft delete — sets `deleted_at`, never hard deletes
- `reorder` endpoint accepts: `[{ "id": 1, "order": 0 }, { "id": 3, "order": 1 }]`
- File uploads (photo, thumbnail) use `multipart/form-data`, stored via Laravel Storage, path saved to DB
- `end_date / end_year` accepts `null` to represent "Present"
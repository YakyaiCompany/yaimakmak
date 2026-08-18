# Proposed Backend API Contract

> **Proposal for alignment with the backend implementer.** This document is not
> an implemented API or a final schema. Confirm endpoint paths, authentication
> transport, object storage, pagination limits, and validation rules before the
> frontend replaces its current static content.

## Scope and conventions

- API prefix: `/api/v1`; public reads are under `/public`, CMS routes are under
  `/admin`.
- All request and response bodies use `application/json; charset=utf-8`.
- Dates are ISO 8601 UTC strings, for example `2026-07-27T09:30:00Z`.
- Public identifiers use stable UUIDs or strings; display routes use `slug`.
- Media fields are HTTPS URLs. The backend validates ownership/allowlisted
  storage origins before publishing a URL.
- List endpoints accept `page`, `pageSize`, `q`, and resource-specific filters.
  `pageSize` has a backend-enforced maximum (suggested: 100).

### Response envelopes

Successful single-resource response:

```json
{
  "data": {},
  "meta": {
    "requestId": "req_01H..."
  }
}
```

Successful list response:

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "pageSize": 24,
    "total": 120,
    "requestId": "req_01H..."
  }
}
```

Failure response:

```json
{
  "error": {
    "code": "validation_error",
    "message": "ข้อมูลไม่ถูกต้อง",
    "fields": {
      "email": "รูปแบบอีเมลไม่ถูกต้อง"
    }
  },
  "meta": {
    "requestId": "req_01H..."
  }
}
```

Do not include stack traces, database errors, tokens, or internal URLs in an
error response. The frontend request helper normalizes transport and HTTP errors
into Thai messages; a structured `fields` object may later be surfaced next to
form controls.

## Public content endpoints

Public read endpoints expose **published** content only. Unpublished, scheduled,
or archived records return `404` rather than leaking their existence.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/v1/public/products` | Paginated published product cards |
| `GET` | `/api/v1/public/products/:slug` | Product detail |
| `GET` | `/api/v1/public/projects` | Paginated projects; filters: `industry`, `year` |
| `GET` | `/api/v1/public/projects/:slug` | Project detail including gallery |
| `GET` | `/api/v1/public/articles` | Paginated article cards; filters: `category`, `tag` |
| `GET` | `/api/v1/public/articles/:slug` | Full published article |
| `GET` | `/api/v1/public/downloads` | Published downloads, optionally filtered by `category` |

### Product shape

```json
{
  "id": "prd_01H...",
  "slug": "gasifier-1500kw",
  "title": "เตาแก๊สซิไฟเออร์ 1.5 MW",
  "subtitle": "สำหรับโรงงานอุตสาหกรรมขนาดใหญ่",
  "description": "...",
  "coverImage": {
    "url": "https://cdn.example.com/products/gasifier-1500kw.jpg",
    "alt": "เตาแก๊สซิไฟเออร์ 1.5 MW"
  },
  "highlights": ["กำลังผลิตความร้อน 1,500 kW"],
  "specifications": [{ "label": "กำลังผลิต", "value": "1,500 kW" }],
  "fuelTypes": ["แกลบ", "ไม้สับ"],
  "updatedAt": "2026-07-27T09:30:00Z"
}
```

### Project shape, including gallery

```json
{
  "id": "prj_01H...",
  "slug": "cassava-dryer-kamphaeng-phet",
  "title": "ระบบอบแห้งกากมัน 10 ตัน/ชม.",
  "province": "กำแพงเพชร",
  "industry": "โรงงานมันสำปะหลัง",
  "completedYear": 2022,
  "system": "Rotary Dryer + Gasifier 750 kW",
  "summary": "...",
  "coverImage": {
    "url": "https://cdn.example.com/projects/cassava-cover.jpg",
    "alt": "ระบบอบแห้งกากมัน"
  },
  "gallery": [
    {
      "id": "med_01H...",
      "url": "https://cdn.example.com/projects/cassava-01.jpg",
      "alt": "ภาพติดตั้งระบบอบแห้ง",
      "caption": "ระหว่างติดตั้ง",
      "sortOrder": 1
    }
  ],
  "updatedAt": "2026-07-27T09:30:00Z"
}
```

The list response may omit `summary` and `gallery` to reduce payload size, but
must retain fields needed by a project card: `slug`, `title`, `province`,
`industry`, `completedYear`, `system`, and `coverImage`.

### Article shape

```json
{
  "id": "art_01H...",
  "slug": "biomass-gasifier-basics",
  "title": "หลักการทำงานของเตาแก๊สซิไฟเออร์ชีวมวลแบบง่าย",
  "excerpt": "...",
  "body": "Markdown or sanitized HTML, to be agreed",
  "category": "ความรู้",
  "tags": ["ชีวมวล", "แก๊สซิไฟเออร์"],
  "coverImage": {
    "url": "https://cdn.example.com/articles/basics.jpg",
    "alt": "..."
  },
  "publishedAt": "2026-07-27T09:30:00Z",
  "updatedAt": "2026-07-27T09:30:00Z"
}
```

The backend must choose one body format. If HTML is returned, it must be
sanitized server-side and the frontend must render it using a reviewed sanitizer;
Markdown is preferred for a safer content boundary.

### Download shape

```json
{
  "id": "dwl_01H...",
  "title": "โบรชัวร์ระบบแก๊สซิไฟเออร์",
  "description": "รายละเอียดผลิตภัณฑ์และข้อมูลจำเพาะ",
  "category": "brochure",
  "file": {
    "url": "https://cdn.example.com/downloads/gasifier-brochure.pdf",
    "fileName": "gasifier-brochure.pdf",
    "mimeType": "application/pdf",
    "sizeBytes": 2458176
  },
  "updatedAt": "2026-07-27T09:30:00Z"
}
```

For protected or licensed files, return a short-lived download URL only after
authorization rather than exposing a permanent object URL.

## Public contact and quote leads

`VITE_CONTACT_ENDPOINT` is a **public URL only** and should normally be set to
`/api/v1/public/leads/contact`. It must never contain an API key, webhook secret,
or embedded credentials. The browser helper sends JSON with
`credentials: "same-origin"` and a 15-second timeout.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/v1/public/leads/contact` | General contact request |
| `POST` | `/api/v1/public/leads/quote` | Product/project quotation request |

Contact request body:

```json
{
  "name": "สมชาย ใจดี",
  "company": "บริษัท ตัวอย่าง จำกัด",
  "email": "somchai@example.com",
  "phone": "0812345678",
  "message": "สนใจระบบอบแห้ง",
  "consent": true,
  "source": "website-contact"
}
```

Quote request body extends the contact request:

```json
{
  "name": "สมชาย ใจดี",
  "email": "somchai@example.com",
  "phone": "0812345678",
  "message": "ขอใบเสนอราคา",
  "consent": true,
  "productSlug": "gasifier-1500kw",
  "projectType": "dryer",
  "capacityRequirement": "10 ตัน/ชั่วโมง",
  "province": "กำแพงเพชร",
  "source": "website-quote"
}
```

Both endpoints return `201 Created`:

```json
{
  "data": {
    "id": "lead_01H...",
    "status": "received"
  },
  "meta": {
    "requestId": "req_01H..."
  }
}
```

Backend requirements for leads:

- Require `name`, `message`, and `consent: true`; require at least one valid
  contact method (`email` or `phone`).
- Validate lengths, normalize phone numbers, reject unexpected fields, and
  sanitize data before it reaches notifications, CRM, logs, or templates.
- Add IP-based rate limiting, a server-verified CAPTCHA or equivalent
  anti-automation control, and a hidden honeypot field.
- Store consent timestamp, privacy-policy version, source, and minimal request
  metadata for auditability; define retention/deletion policy with the owner.
- Use idempotency keys or a short deduplication window if retries can create
  duplicate sales leads.

## Admin authentication and CMS

### Authentication and session endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/v1/admin/auth/login` | Start administrator session |
| `POST` | `/api/v1/admin/auth/logout` | End current session |
| `POST` | `/api/v1/admin/auth/refresh` | Rotate/refresh current session if needed |
| `GET` | `/api/v1/admin/auth/me` | Current administrator and permissions |

Suggested login body:

```json
{
  "email": "editor@example.com",
  "password": "submitted only over HTTPS"
}
```

The response should set an `HttpOnly`, `Secure`, `SameSite` session cookie and
return only safe session metadata:

```json
{
  "data": {
    "user": {
      "id": "usr_01H...",
      "name": "Content Editor",
      "email": "editor@example.com",
      "roles": ["editor"]
    }
  }
}
```

Do not return long-lived bearer tokens to browser JavaScript. If the backend
requires bearer tokens, use short-lived access tokens, secure rotation, and a
separate threat-model review before adoption.

### CMS content endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET`, `POST` | `/api/v1/admin/products` | List/create products |
| `GET`, `PATCH`, `DELETE` | `/api/v1/admin/products/:id` | Read/update/archive product |
| `GET`, `POST` | `/api/v1/admin/projects` | List/create projects |
| `GET`, `PATCH`, `DELETE` | `/api/v1/admin/projects/:id` | Read/update/archive project |
| `GET`, `POST` | `/api/v1/admin/projects/:id/gallery` | List/add project gallery media |
| `PATCH`, `DELETE` | `/api/v1/admin/projects/:id/gallery/:mediaId` | Reorder/update/remove gallery item |
| `GET`, `POST` | `/api/v1/admin/articles` | List/create articles |
| `GET`, `PATCH`, `DELETE` | `/api/v1/admin/articles/:id` | Read/update/archive article |
| `GET`, `POST` | `/api/v1/admin/downloads` | List/create downloads |
| `GET`, `PATCH`, `DELETE` | `/api/v1/admin/downloads/:id` | Read/update/archive download |
| `POST` | `/api/v1/admin/media/upload-url` | Create a constrained direct-upload URL |
| `GET` | `/api/v1/admin/leads` | Search/filter leads for authorized staff |
| `GET`, `PATCH` | `/api/v1/admin/leads/:id` | Inspect/update lead status and assignment |

CMS mutations accept the public shapes above plus administrative fields such as
`status` (`draft`, `scheduled`, `published`, `archived`), `publishedAt`, and
`revision`. `PATCH` should use optimistic concurrency (`If-Match`/ETag or a
revision field) so one editor cannot silently overwrite another editor's work.
`DELETE` should normally archive records and retain a clear audit trail.

## Security and authorization requirements

1. **Transport and CORS** — Require HTTPS in production. Permit CORS only for
   explicitly configured frontend origins; never use `*` with credentials. The
   frontend fetch policy is `credentials: "same-origin"`; a separately hosted
   frontend should use an explicit, reviewed cross-origin session design.
2. **Authentication** — CMS and lead-management routes require a valid session.
   Apply role-based authorization on every route and resource: suggested roles
   are `admin`, `editor`, and `sales`. Enforce authorization on the server, not
   by hiding UI controls.
3. **CSRF** — Any cookie-authenticated state-changing endpoint requires CSRF
   protection, such as a synchronizer token or validated double-submit token.
   SameSite cookies supplement but do not replace this requirement.
4. **Input and output safety** — Validate with a server-side schema, enforce
   payload/file-size limits, sanitize rich content, encode output, and protect
   against IDOR by checking ownership/role before every admin read or mutation.
5. **Abuse prevention** — Rate limit login, refresh, lead, upload, and download
   endpoints. Add progressive delays/lockout for failed logins and log security
   events without logging passwords or session values.
6. **Media uploads** — Use short-lived, content-type/size-constrained signed
   upload URLs. Scan uploads, generate safe derivatives, and do not trust a
   client-provided media URL or MIME type.
7. **Observability and privacy** — Return a request ID, emit structured audit
   logs for admin mutations, encrypt personal data at rest where appropriate,
   and document retention, access, export, and deletion processes.

## Configuration boundary

The client may read only these public build-time values:

| Variable | Purpose | Example |
| --- | --- | --- |
| `VITE_CONTACT_ENDPOINT` | Contact lead POST URL | `/api/v1/public/leads/contact` |
| `VITE_CMS_API_BASE_URL` | Public/CMS API base URL when not same-origin | `https://api.example.com/api/v1` |
| `VITE_HERO_VIDEO_URL` | Public HTTPS hero-video URL | `https://player.vimeo.com/video/123` |

Vite embeds `VITE_*` values into the browser bundle. Do **not** use these
variables for database URLs, service credentials, webhook secrets, private API
keys, or bearer tokens.

## Items to decide with the backend implementer

- Confirm whether public content is served from the application API, a CMS API,
  or generated static data, and set cache/ETag behavior accordingly.
- Confirm article-body format (Markdown preferred versus sanitized HTML), image
  transformations, storage host, and CDN cache invalidation behavior.
- Confirm whether lead submissions need a public CSRF token, CAPTCHA provider,
  idempotency header, CRM integration, and notification/retry semantics.
- Confirm admin roles, MFA/SSO requirements, session lifetime, and whether the
  admin portal shares an origin with the public site.
- Confirm localized-content requirements and whether `locale` is a query
  parameter, URL prefix, or field within each resource.

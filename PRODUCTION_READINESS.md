# Production Readiness

The frontend implements public-page flows, route handling, accessible modal
patterns, and an **interactive local-state CMS prototype**. It is not safe to
publish the CMS or accept lead data until the following server-side work is
complete.

## Required environment

Copy `.env.example` to the deployment environment and set only public frontend
configuration values. `VITE_*` values are included in the browser bundle; never
store credentials, tokens, private API URLs, or service secrets in them.

`VITE_CONTACT_ENDPOINT` should be a same-origin HTTPS endpoint such as
`/api/v1/public/leads/contact`. Without it, contact and quote forms intentionally
fail closed in production. The development preview uses an explicit demo state
that simulates success while stating that no data is sent or stored.
`VITE_DEMO_MODE=true` may be used for a client prototype only and must remain
false in production. The proposed request and CMS contract is documented in
`BACKEND_API_CONTRACT.md`.

## Required backend controls

### Lead forms

- Validate and normalize every field on the server; client validation is only a
  usability aid.
- Enforce origin checks and CSRF protection for cookie-authenticated requests.
- Apply IP and account rate limits, abuse monitoring, and a bot-control service
  such as Turnstile where appropriate.
- Store the minimum personal data needed, encrypt it in transit and at rest,
  restrict access by role, and define deletion/retention rules.
- Avoid recording form contents, e-mail addresses, or phone numbers in logs.
- Return generic error messages and do not expose internal service details.

### CMS and admin access

- Protect `/admin` on the server before returning administration data. The
  current UI uses a visible client-side demo login and in-memory mock data; it
  does not implement authentication, authorization, or persistence.
- Use a server-managed, `HttpOnly`, `Secure`, `SameSite` session cookie; do not
  store administrator tokens in local storage.
- Require MFA for privileged accounts, apply least-privilege roles, expire
  sessions, and audit content changes.
- Authorize every read and write action on the server. Never rely on hidden UI
  controls for access control.

### Files and media

- Require authorization before upload and download.
- Validate extension, MIME type, size, and file signature; malware-scan uploads.
- Generate server-side filenames, store outside the executable web root, and
  serve private media through short-lived signed URLs where required.
- Supply real alt text and captions with every published image.

## Required HTTPS headers

The meta Content Security Policy in `index.html` is a client fallback. Configure
these as HTTP response headers at the hosting layer and tighten the allowed
sources to the final assets and services:

```text
Content-Security-Policy: default-src 'self'; object-src 'none'; base-uri 'self'
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
X-Frame-Options: DENY
```

Use `frame-ancestors 'none'` in the HTTP CSP if the site must never be embedded.
Deploy HSTS only after HTTPS is working correctly on the canonical domain.

## Content and legal release gate

Before publishing, replace every placeholder and test asset with approved
company data:

- company logo, contacts, map, LINE OA, social destinations, and office hours;
- real product PDFs, project galleries, specifications, and permissions to use
  customer names/images;
- author, article body, captions, related-content links, and SEO metadata;
- a privacy policy reviewed for the actual collection, retention, sharing, and
  data-subject-request process;
- all CMS preview data with server-provided data.

## Verification before release

1. Run `pnpm build` and `pnpm exec tsc --noEmit`.
2. Test direct loads, refreshes, and Back/Forward for `/projects`,
   `/projects/:slug`, `/news`, `/news/:slug`, `/privacy-policy`, `/404`, and
   `/admin`. Configure the web server to fall back to `index.html` for public
   client routes.
3. Test keyboard-only navigation, focus order, modal focus trapping, Escape,
   screen-reader labels, zoom at 200%, and reduced-motion behavior.
4. Test desktop, tablet, and mobile widths using real devices.
5. Run automated accessibility and security scans against the deployed HTTPS
   site, then conduct a manual review of lead-form and CMS authorization flows.

# Frontend Architecture

## Current incremental structure

```text
src/
├── App.tsx                   # Temporary composition root and client-side route state
├── AdminPortal.tsx           # Interactive local-state CMS prototype
├── LegalPages.tsx            # Privacy and 404 pages
├── config/
│   ├── company.ts            # Central public company/contact/map configuration
│   └── environment.ts        # Validated public runtime configuration
├── data/
│   ├── downloads.ts          # Public document metadata
│   └── siteContent.ts        # Mock products, projects, articles and site content
├── lib/
│   └── api.ts                # Fetch client, timeout and normalized API errors
├── pages/
│   └── DownloadsPage.tsx     # Dedicated `/downloads` page
├── types/
│   └── content.ts            # Product, project and article domain models
└── index.css                 # Global tokens, focus and reduced-motion rules
```

`App.tsx` was the initial Figma Make prototype and still owns several public
sections. New work should not add additional page-sized components or content
data to this file.

## Target structure for continued development

```text
src/
├── app/
│   ├── App.tsx               # Route composition and app providers only
│   ├── routes.ts             # URL parsing and page-to-path mappings
│   └── providers.tsx         # Locale, toast, query and auth providers
├── components/
│   ├── site/                 # Header, Footer, logo, floating actions
│   └── ui/                   # Button, input, modal, badge, empty state, icons
├── config/
│   ├── company.ts            # Public display data only; never secrets
│   └── environment.ts        # Validated public runtime configuration
├── data/                     # Temporary mock data, removed after CMS/API integration
├── features/
│   ├── home/                 # Hero, trust, about, products, services and industries
│   ├── projects/             # List, detail, filters and project gallery
│   ├── news/                 # List, detail, category filters and sharing
│   ├── downloads/            # Document listing and document-card UI
│   ├── contact/              # Contact and quote forms, client validation
│   └── admin/                # Protected CMS screens, audit-log UI and API adapters
├── lib/
│   ├── api.ts                # Fetch client, error normalization and CSRF handling
│   ├── validation.ts         # Shared client validation schemas
│   └── security.ts           # Safe external URL helpers and formatters
├── pages/                    # Route-level components composed from features
├── types/                    # Domain models shared between features
└── index.css
```

## Rules for the refactor

1. Move one feature at a time and keep its route working before moving the
   next. Do not make a single large rewrite of `App.tsx`.
2. Keep raw API calls out of components. Feature API adapters belong in
   `features/<name>/api.ts` and use `lib/api.ts`.
3. Treat `data/` as mock-only. Replace it with typed API responses after the
   CMS/backend is available.
4. Keep product, project and article domain types in `types/`, not inside UI
   components.
5. Keep reusable primitives in `components/ui`; site-specific layout belongs in
   `components/site` or a feature.
6. Store only public, non-secret display configuration in `config/`. Server
   secrets and access-control decisions must remain on the backend.

## Recommended migration order

1. Extract Header, Footer and shared icons into `components/site` and
   `components/ui`.
2. Move `projects`, `news` and `contact` into individual features with their
   types and mock data.
3. Replace the History API state router with a tested router once backend URL
   behavior and server rewrites are configured.
4. Connect the CMS and contact forms to authenticated, validated backend APIs.
5. Replace mock values and the local-state admin prototype once live data is available.

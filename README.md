# Job Application Tracker

A dashboard for tracking job applications — company, role, status, date applied,
posting link, and notes — built to demonstrate modern Next.js App Router
patterns: Server Components, Client Component islands, Route Handlers, and
real database persistence.

## Tech stack

- **Next.js 14** (App Router) + **React 18**
- **TypeScript** throughout
- **Tailwind CSS** for styling
- **Prisma ORM + SQLite** — zero-config local persistence (single file, no DB server)

## Features

- Dashboard (`/`) listing all applications, server-rendered from the database
- Detail page per application (`/applications/[id]`, dynamic route)
- New-application form (`/applications/new`) posting to an API route
- Inline status updates via a dropdown (Applied / Interview / Offer / Rejected)
- Delete with confirmation
- Route-level `loading.tsx` skeletons, `error.tsx` boundaries, and `not-found.tsx`
- Empty state, UI-level error messages, and server-side input validation
- Database seeded with 6 demo applications on first run

## Project structure

```
├── prisma/
│   ├── schema.prisma            # Application model + SQLite datasource
│   ├── seed.ts                  # 6 demo applications (idempotent)
│   └── migrations/              # SQL migration history
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root shell (nav)
│   │   ├── page.tsx             # `/` dashboard
│   │   ├── loading.tsx          # Route-level loading skeleton
│   │   ├── error.tsx            # Route-level error boundary
│   │   ├── applications/
│   │   │   ├── new/page.tsx     # New-application form
│   │   │   └── [id]/
│   │   │       ├── page.tsx     # Detail page
│   │   │       ├── loading.tsx / error.tsx / not-found.tsx
│   │   └── api/applications/
│   │       ├── route.ts         # GET (list), POST (create)
│   │       └── [id]/route.ts    # GET (one), PATCH (update), DELETE
│   ├── components/
│   │   ├── StatusSelect.tsx     # Interactive status dropdown
│   │   ├── DeleteButton.tsx     # Delete + redirect
│   │   ├── StatusBadge.tsx      # Presentational status pill
│   │   └── EmptyState.tsx       # "No applications yet" UI
│   └── lib/
│       ├── prisma.ts            # PrismaClient singleton
│       ├── status.ts            # Status type + labels (shared server/client)
│       └── utils.ts             # formatDate
└── .env                         # DATABASE_URL="file:./dev.db" (no secrets)
```

## Server vs. Client Components — the reasoning

The guiding rule in this repo: **Server Components read, Client Components write.**

| File | Type | Why |
|---|---|---|
| `app/page.tsx` (dashboard) | Server | Queries Prisma directly and renders HTML. No data-fetching JS is shipped to the browser. |
| `app/applications/[id]/page.tsx` | Server | Same — `findUnique(params.id)` runs on the server; `notFound()` handles bad ids. |
| `app/layout.tsx` | Server | Static shell with links only — zero layout JS on the client. |
| `app/loading.tsx` | Server | Pure skeleton markup. Next.js auto-wraps the segment in `<Suspense>` while the async page streams in. |
| `app/error.tsx` | **Client (required)** | Next.js *requires* error boundaries to be Client Components (they use React's catch lifecycle). The sanctioned exception. |
| `app/applications/new/page.tsx` | Client | Needs `useState` for form state, `onSubmit`, and browser `fetch()` → POST. |
| `components/StatusSelect.tsx` | Client | Needs `onChange` + browser `fetch()` → PATCH, then `router.refresh()`. |
| `components/DeleteButton.tsx` | Client | Needs `onClick`, `confirm()`, browser `fetch()` → DELETE, then redirect. |
| `components/StatusBadge.tsx`, `EmptyState.tsx` | Server-renderable | No hooks, no events — no `"use client"` means no JS shipped. |

**How data flows:**

1. Pages are async Server Components that read from SQLite via Prisma — no HTTP
   round-trip, no `useEffect` fetching.
2. Client Components can't import Prisma (it runs in Node, not the browser), so
   mutations go through the API routes under `/api/applications/*`.
3. After a successful mutation, the client calls `router.refresh()`, which makes
   Next.js re-render the Server Components with fresh database data — the UI
   updates without a full page reload.
4. Interactive Client Components are small "islands" inside server-rendered
   pages, keeping the client bundle minimal (~97 kB first load, mostly the
   React/Next runtime).

## API endpoints

| Method | Route | Body | Returns |
|---|---|---|---|
| `GET` | `/api/applications` | — | `200` array of applications |
| `POST` | `/api/applications` | `{ company*, role*, url?, notes?, status?, appliedAt? }` | `201` created record / `400` validation error |
| `GET` | `/api/applications/:id` | — | `200` record / `404` |
| `PATCH` | `/api/applications/:id` | `{ status: "APPLIED" \| "INTERVIEW" \| "OFFER" \| "REJECTED" }` | `200` updated record / `400` / `404` |
| `DELETE` | `/api/applications/:id` | — | `204` / `404` |

All inputs are validated server-side; the UI surfaces the API's error messages.

## Data model

```prisma
model Application {
  id        String   @id @default(cuid())
  company   String
  role      String
  status    String   @default("APPLIED") // APPLIED | INTERVIEW | OFFER | REJECTED
  url       String?
  notes     String?
  appliedAt DateTime @default(now())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

SQLite has no enum support in Prisma, so valid statuses are constrained at the
application layer (`src/lib/status.ts`, enforced in the API routes).

## Getting started

Requires Node.js 18.17+.

```bash
npm install
npx prisma migrate dev   # creates prisma/dev.db, applies migrations, runs the seed (6 demo applications)
npm run dev              # http://localhost:3000
```

Useful scripts:

| Command | Purpose |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` / `npm start` | Production build / serve |
| `npm run db:migrate` | Create/apply a new migration after schema changes |
| `npm run db:seed` | Reset + reseed the demo data |
| `npm run db:studio` | Open Prisma Studio to browse the DB |

## Deploying to Vercel

The app runs on Postgres (Vercel Storage → Neon) rather than the SQLite file
used in early local prototyping — Vercel's serverless functions have a
read-only, ephemeral filesystem, so a file-based `dev.db` can't be written to
reliably in production.

1. Vercel dashboard → **Storage** → **Create Database** → **Postgres**. This
   auto-attaches `DATABASE_URL` (pooled) and `DATABASE_URL_UNPOOLED` (direct)
   to the project's env vars — `prisma/schema.prisma` reads the latter as
   `directUrl`, since Prisma Migrate needs a direct connection and can't run
   through a pooler.
2. Import this repo into the Vercel project (or link it, if the database was
   created from an already-linked project).
3. Deploy. The `build` script runs `prisma migrate deploy && next build`, so
   the tracked migrations in `prisma/migrations/` apply automatically on every
   deploy — no manual migration step needed.
4. Optional: reseed the remote DB once by pointing your local `.env` at the
   production `DATABASE_URL` / `DATABASE_URL_UNPOOLED` and running
   `npm run db:seed`.

## Notes & known limitations

- `not-found.tsx` renders correctly for unknown ids, but with a `200` status on
  initial load — a known Next.js streaming behavior: `loading.tsx` flushes the
  shell before the async page calls `notFound()`. Removed `loading.tsx` → real
  `404`; kept it because route-level loading states were a project goal.
- Possible next steps: auth (Auth.js), a full edit form, search/filter, and
  tests for the API routes.

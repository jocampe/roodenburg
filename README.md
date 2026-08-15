# L.V. Roodenburg website

A working bilingual frontend for the L.V. Roodenburg club website. It includes the homepage, club and membership pages, news, team pages, match details, a member account area, and a complete clickable sitemap.

## Current status

- Dutch and English routes under `/nl` and `/en`
- Responsive layouts, keyboard-friendly controls, metadata, and a custom 404 page
- Reusable article, team, fixture, result, standings, and match-detail components
- Typed local sample content behind a provider-neutral `ContentSource`
- Production source includes Payload/PostgreSQL member authentication and persistent contact intake; the current review deployment remains frontend-only
- Versioned Sportlink snapshot importer and public adapter are implemented; real credentials and confirmed provider IDs are still required
- Portable SMTP delivery, member status notifications and password recovery are implemented; real credentials and club recipients are still required
- Launch controls include security headers, trusted-proxy and edge-rate-limit gates, privacy-safe recovery links, an enforceable contact-retention job, and an acceptance runbook
- No provider-specific application APIs in page components

The review deployment currently runs through Vinext. The production target is standard Next.js plus Payload CMS in a Node.js container, with PostgreSQL and S3-compatible object storage. See `docs/ARCHITECTURE.md` for the portable deployment design, `docs/PRODUCTION_OPERATIONS.md` for storage, email, backup and restore procedures, and `docs/LAUNCH_ACCEPTANCE.md` for the release gate.

## Run locally

Requirements: Node.js 22.13 or newer, npm, and Linux/WSL or a container.

```bash
npm ci
npm run dev
```

Useful checks:

```bash
npm run build
npm run lint
npm test
```

## GitHub Pages demo

The repository includes a static showcase build for `https://jocampe.github.io/roodenburg/`. It preserves the bilingual public routes and client-side interactions while using bundled sample content. Forms demonstrate validation but do not send data; CMS administration, authentication, PostgreSQL, uploads, email and Sportlink synchronization remain production-only.

After creating `github.com/jocampe/roodenburg`:

1. Push this source to the repository's `main` branch.
2. Open **Settings → Pages** and select **GitHub Actions** as the source.
3. The included `Deploy GitHub Pages demo` workflow builds and publishes the site automatically on every push to `main`.

Test the Pages artifact locally with:

```bash
npm run build:pages
```

The static output is written to `out/`. The normal `npm run build` and the standalone application under `production/` are unchanged.

## Project map

- `app/[locale]/` — public routes
- `app/content/` — content-provider boundary
- `app/site-data.ts` — current typed sample content
- `app/site-header.tsx` — persistent navigation
- `public/` — crest and presentation assets
- `docs/` — architecture, CMS model, and implementation handoff
- `production/` — deployable Next.js, Payload CMS, and PostgreSQL application

The administration boundary and role model are documented in `docs/ADMINISTRATION.md`.

## Content and football data

Pages request editorial and football content through provider boundaries. The review frontend reads local typed data; the production Payload adapter reads the last successful football snapshot and falls back safely when none exists.

The standalone sync command validates a normalized Sportlink snapshot, stores checksum-versioned teams, fixtures, results and standings in PostgreSQL, and publishes the snapshot atomically. An external scheduler invokes it. Editorial team descriptions and images remain owned by Payload. See `docs/SPORTLINK_INTEGRATION.md`.

## Portability rules

- Configuration is supplied through environment variables.
- PostgreSQL changes are versioned migrations.
- Media uses an S3-compatible storage adapter.
- Scheduled work runs as a standalone job, not a hosting-vendor cron API.
- Application code avoids Vercel-only APIs, edge-only runtime assumptions, and filesystem uploads.

## Content disclaimer

The club crest was supplied for this project. Photography, match data, team data, people, sponsors, and editorial copy in the prototype are provisional until the club confirms or replaces them in the CMS.

## Production foundation

The standalone production application now lives in `production/`. It includes the approved bilingual frontend, a Payload-backed content adapter with safe typed fallbacks, versioned football snapshots and an idempotent Sportlink sync command, the Payload admin and REST/GraphQL routes, PostgreSQL migrations and backup workflows, bilingual collections and globals, role-based editorial access, pending member registration and secure member sessions, persistent contact intake, validated S3-compatible media storage, SMTP notifications and password recovery, container packaging, and liveness/readiness endpoints. Its own README contains local and deployment instructions.

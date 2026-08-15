# Production application

This directory is the provider-neutral production application for the L.V. Roodenburg website: the approved bilingual frontend on standard Next.js, Payload CMS, PostgreSQL, S3-compatible media storage, and SMTP email delivery.

Public routes read published Payload news, team-editorial overlays and the last successful football snapshot through an asynchronous content adapter. Until editors populate the CMS and the first football synchronization succeeds, the adapter returns the approved typed sample content so a new environment never renders an empty website.

## Local development

```bash
cp .env.example .env
npm ci
docker compose up -d postgres
npm run migrate
npm run dev
```

Open the website at `http://localhost:3000`, the CMS at `http://localhost:3000/admin`, and create the first administrator account.

The public surface includes `/nl` and `/en`, news and article routes, the full team directory, reusable team and match pages, club and membership content, a member account portal, persistent contact intake, and the sitemap.

## Member accounts and contact intake

Public registrations create a pending member account. An administrator must verify the club membership, optionally add the member number, and change the account status to `active` before login succeeds. Public member sessions use their own HTTP-only cookie and never grant access to `/admin`; members can view their account and update only their display name and preferred language.

The public contact endpoint validates input server-side, enforces same-origin requests, uses a honeypot and short-window rate limit, records consent, and calculates `deleteAfter` from `CONTACT_RETENTION_DAYS` (180 days by default). Submissions appear in the CMS contact workflow. The `contact-retention` job reports expired records by default and deletes them only with `RETENTION_PURGE_CONFIRM=true`; schedule it externally after reviewing a dry run. Generate and apply a database migration after changing either collection schema.

The in-process rate limit is a conservative first application layer. Forwarded client-IP headers are ignored unless `TRUST_PROXY_HEADERS=true`; set that only when the application can be reached solely through a proxy that overwrites `PROXY_IP_HEADER`. A multi-instance production deployment must enforce a shared rate limit at its reverse proxy or ingress. The readiness gate can require operator attestation with `EDGE_RATE_LIMIT_REQUIRED=true` and `EDGE_RATE_LIMIT_VERIFIED=true`.

When SMTP is configured, registrations and account status changes generate bilingual member messages, contact and registration events notify the configured club mailboxes, and active members can request a 30-minute password-reset link. The token is delivered in a URL fragment, captured and removed by the browser before it can reach server or referrer logs. Password-reset requests always return the same public response so they do not reveal whether an account exists.

## Football data synchronization

`npm run sync:football` fetches and validates the normalized Sportlink snapshot, writes checksum-versioned teams, matches and standings, and publishes the new snapshot atomically. Re-running identical source data is idempotent. Failed runs are recorded without replacing the last successful public snapshot. Configure this command in an external scheduler; the application contains no provider-specific cron dependency.

The exact normalized input contract and activation steps are documented in `../docs/SPORTLINK_INTEGRATION.md`. Real Sportlink credentials, club IDs and team IDs are intentionally not included.

## Initialize the CMS

After creating the first administrator:

```bash
npm run seed
npm run verify:access
npm run verify:infrastructure
npm run verify:launch
npm run verify:public-api
npm run verify:football
```

The seed is idempotent and imports the approved bilingual news plus initial settings. The CMS dashboard then shows content, draft, media, contact, staff and member-account totals. Configure `PREVIEW_SECRET` for draft preview and optionally `ANALYTICS_PROVIDER` plus `ANALYTICS_DASHBOARD_URL` for the external analytics shortcut.

## Schema workflow

After changing a collection or global:

```bash
npm run generate:types
npm run migration:create -- descriptive_migration_name
npm run migrate
```

Commit generated migrations. Production startup must apply `npm run migrate` as a release step before the new application container receives traffic.

## Container deployment

The Docker image uses Next.js standalone output and contains no database or uploaded media. Supply environment variables at runtime, apply migrations as a separate job, and connect a managed PostgreSQL database plus S3-compatible bucket. Set `S3_REQUIRED=true` and `SMTP_REQUIRED=true` in production to reject incomplete integration configuration.

The same image can run on a managed container host, AWS ECS, Kubernetes, or a VPS. No application route depends on a Vercel-only API.

Database backup and guarded restore jobs are available as Docker Compose profiles. Configuration, media acceptance, email acceptance, backup scheduling and restore drills are documented in `../docs/PRODUCTION_OPERATIONS.md`; the full security, privacy, accessibility, performance and monitoring gate is in `../docs/LAUNCH_ACCEPTANCE.md`.

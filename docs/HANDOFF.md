# Implementation handoff

## Complete in this milestone

- Responsive bilingual frontend with Dutch and English routes
- Persistent navigation, breadcrumbs, mobile navigation, and accessible tabs
- Homepage, club, membership, news, article, team, match, account, and sitemap routes
- Localized metadata, custom not-found experience, and route-level navigation checks
- Typed sample data isolated behind a content-provider interface
- Portable CMS, storage, database, and Sportlink architecture

## Production foundation completed

- Standalone Next.js and Payload application under `production/`
- PostgreSQL adapter with explicit migration directory and release commands
- Payload admin, REST, and GraphQL route handlers
- Dutch/English localization at field level
- Collections for users, media, news, club pages, events, sponsors, team overlays, and contact submissions
- Globals for site and membership settings
- Administrator, editor, team-editor, and sponsor-editor access boundaries
- Optional S3-compatible media storage with local filesystem fallback
- Provider-neutral Docker image, Docker Compose development database, and health endpoints
- Locked dependency versions and a database-free compile-mode production build

## Frontend and CMS adapter completed

- Approved responsive frontend migrated into the standalone production application
- Dutch and English route tree preserved without URL changes
- Persistent navigation, breadcrumbs, dropdown behavior, team tabs, and match-detail links preserved
- Homepage match-centre action still opens the featured match directly
- Published Payload news mapped into the existing bilingual article model
- Payload team overlays merged with the football-data fallback
- Empty or temporarily unavailable CMS falls back to approved typed content
- Production build includes all public routes alongside Payload admin and APIs

## Administration and editorial workflow completed

- Payload `/admin` configured as the staff administration area
- CMS staff and member accounts separated into different authentication collections
- Administrator-only member-account management foundation
- Custom dashboard with operational content, draft, media, contact and account statistics
- External analytics link boundary without storing tracking events in the CMS database
- Draft preview URLs protected by an independent secret and signed draft-mode cookie
- Visible preview banner and exit-preview action
- Idempotent bilingual initial-content seed
- Automated assertions for administrator, editor, team-editor and sponsor-editor boundaries

## Member and contact workflow completed

- Public member registration with server-side validation, consent capture and pending approval
- Administrator activation boundary; pending, suspended and closed accounts cannot log in
- Member sessions isolated from CMS staff sessions in an HTTP-only cookie
- Authenticated member profile view and limited self-service update for name and language
- Persistent contact intake with normalized topics, consent timestamp and deletion date
- Same-origin enforcement, request-size bounds, honeypots and application-layer rate limits
- Automated assertions for public input validation and origin checks

## Football synchronization foundation completed

- Normalized Sportlink snapshot contract without assuming undocumented provider fields
- Strict team, match, score, route and standings validation before database writes
- Checksum-addressed immutable snapshots and idempotent record upserts
- Atomic public snapshot pointer; failed imports preserve the last successful data
- Imported team, match, standing and sync-run collections in Payload/PostgreSQL
- Public team, match-detail, standings and homepage match-centre reads connected to synchronized data
- Homepage match-centre action continues to open the featured match directly
- CMS dashboard surfaces football sync status and current record totals
- Standalone `sync:football` command for an external scheduler

## Production operations foundation completed

- Validated S3-compatible configuration with workload-identity or paired static credentials
- Production-required switches that prevent silent local media or disabled email
- Payload SMTP adapter for auth and application email
- Contact, account-request and member-status notifications with safe failure handling
- Non-enumerating password recovery with 30-minute bilingual reset links
- CMS and readiness visibility without exposing secrets or recipient addresses
- Checksum-validating PostgreSQL dump job and deliberately guarded restore job
- Provider-neutral media, email, backup and restore acceptance runbook

## Not production-ready

- Official football data remains on the approved fallback until Sportlink credentials and confirmed club/team IDs are supplied and the first sync succeeds.
- Outbound notifications and password reset are implemented but remain inactive until SMTP settings, club recipient mailboxes and final wording are confirmed.
- Sponsor names, staff roles, and other organizational details need club confirmation.
- Photography and most visual content are provisional.
- Environment-level launch evidence is still required for TLS/CDN headers, shared throttling, accessibility browsers, performance budgets, monitoring, integrations and the restore drill.

## Launch-readiness foundation completed

- CSP, HSTS, clickjacking, MIME, referrer, permissions and cross-origin response headers
- Private account and member API no-store/no-referrer/noindex policy
- Explicit trusted-proxy allowlist and shared edge-rate-limit readiness gate
- Password-reset token moved to a client-only fragment and removed immediately after capture
- Dry-run-first contact-retention purge job for external scheduling
- Automated launch assertions and a production evidence checklist covering accessibility, performance, monitoring, integrations and restore acceptance

## Recommended implementation sequence

1. ~~Create the production Next.js and Payload application shell.~~
2. ~~Move the approved components, CSS, routes, and assets without redesigning them.~~
3. ~~Connect PostgreSQL and establish the migration workflow.~~
4. ~~Implement the collections and globals in `CMS_CONTENT_MODEL.md`.~~
5. ~~Replace the local `ContentSource` with a Payload-backed implementation.~~
6. ~~Implement validated S3-compatible media and SMTP foundations.~~ Connect and verify the selected providers, then migrate approved assets.
7. ~~Complete CMS preview and verify the role model.~~ Assign real club editors before launch.
8. ~~Implement the contact workflow, consent, spam controls, and retention.~~ Add shared edge/proxy throttling before public launch.
9. Obtain and validate Sportlink documentation and credentials.
10. ~~Build the idempotent Sportlink sync command.~~ Configure its external schedule after credentials and networking are confirmed.
11. Replace every provisional record and image with confirmed club content.
12. ~~Implement the security, privacy, retention and acceptance gates.~~ Complete the environment-level evidence in `LAUNCH_ACCEPTANCE.md` before launch.

## CMS definition of done

- Authorized editors can create, preview, publish, unpublish, and restore bilingual content.
- Public pages render only published records and degrade safely when optional fields are empty.
- Media has required alternative text and cannot be orphaned silently.
- Changes are attributable through users and version history.
- Database migrations, backups, and restore steps are documented and tested.
- The same application image runs outside the original review host.

## Source archive

The handoff archive excludes repository history, dependencies, build output, provider runtime caches, and local secrets. Restore it with `npm ci` before development.

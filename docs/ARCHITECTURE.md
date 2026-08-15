# Portable production architecture

## Goal

Run one modular application without coupling the club to a hosting vendor. The current prototype is a review frontend; the production implementation should be standard Next.js and Payload CMS in a Node.js container.

```text
Visitors and editors
        |
Next.js + Payload CMS container
        |
PostgreSQL | S3-compatible media | SMTP adapter | Sportlink sync job
```

## Data ownership

| Concern | System of record |
| --- | --- |
| Editorial pages, news, events, sponsors, media, settings | Payload CMS |
| CMS users, roles, drafts, and versions | Payload CMS |
| Official teams, matches, results, and standings | Sportlink |
| Cached public football data | PostgreSQL |
| Uploaded files | S3-compatible object storage |
| Presentation and public routing | Next.js |

## Supported hosting shapes

- Managed container host plus managed PostgreSQL and object storage
- AWS ECS, RDS, and S3
- A VPS using Docker Compose
- Kubernetes when operational scale justifies it

The same container image and migration process should work in every shape.

The executable foundation for this design is checked in under `production/`. The current Sites/Vinext application remains the review surface until the approved frontend is moved into that standalone application.

## Application boundaries

The frontend consumes `ContentSource`, currently implemented by local typed data. The production implementation reads Payload through its local API. Equivalent replaceable interfaces should isolate media, football data, and email:

```ts
interface MediaStorage { put(file: Blob): Promise<string>; delete(key: string): Promise<void> }
interface FootballDataSource { sync(): Promise<void> }
interface Mailer { send(message: Message): Promise<void> }
```

## Environment contract

```text
DATABASE_URL
PAYLOAD_SECRET
S3_ENDPOINT
S3_REGION
S3_BUCKET
S3_ACCESS_KEY_ID
S3_SECRET_ACCESS_KEY
S3_REQUIRED
SMTP_HOST
SMTP_PORT
SMTP_USER
SMTP_PASSWORD
SMTP_FROM
SMTP_REQUIRED
SMTP_SECURE
CONTACT_NOTIFICATION_TO
MEMBER_NOTIFICATION_TO
SPORTLINK_API_URL
SPORTLINK_API_KEY
TRUST_PROXY_HEADERS
PROXY_IP_HEADER
EDGE_RATE_LIMIT_REQUIRED
EDGE_RATE_LIMIT_VERIFIED
CONTACT_RETENTION_DAYS
RETENTION_PURGE_CONFIRM
```

Secrets must stay outside the repository. Validate required values during application startup.

## Sportlink synchronization

Run the Sportlink importer as a standalone command invoked by an external scheduler. Each run should fetch, validate, upsert, and record its completion. Upserts must be idempotent so retries cannot duplicate matches or teams. Keep the last successful public snapshot available when the upstream service is unavailable.

The implemented importer uses versioned, checksum-addressed snapshots and changes the public snapshot pointer only after the full import succeeds. The upstream URL returns the normalized contract in `SPORTLINK_INTEGRATION.md`; the licensed Sportlink response is mapped at that boundary once the club confirms its product and identifiers.

## Operational safeguards

- Versioned PostgreSQL migrations and tested restore procedures
- Daily database backups and object-storage versioning
- Least-privilege CMS roles with audit history
- Contact-form rate limiting, spam protection, consent capture, and retention rules
- MIME/type, size, and image-dimension validation for uploads
- Health endpoints, structured logs, uptime checks, and error monitoring
- Global browser security headers and private-route no-store/no-referrer policy
- Explicit trusted-proxy boundary plus a production gate for shared ingress throttling
- Externally scheduled, dry-run-first contact-retention enforcement

Production can require durable integrations with `S3_REQUIRED=true` and `SMTP_REQUIRED=true`. Configuration validation rejects partial credentials at startup. The readiness response and CMS dashboard expose only integration modes, not secret values. Database backup and guarded restore jobs use standard PostgreSQL tools; object versioning and lifecycle policy remain portable storage-provider responsibilities. See `PRODUCTION_OPERATIONS.md`.

Release acceptance across security, privacy, accessibility, performance and monitoring is defined in `LAUNCH_ACCEPTANCE.md`.

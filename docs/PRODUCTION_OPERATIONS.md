# Production operations

## Configuration policy

The application keeps credentials outside the source tree and validates integration settings before it starts. Local development can use filesystem media and disabled email. Production should set both `S3_REQUIRED=true` and `SMTP_REQUIRED=true` so an incomplete deployment fails immediately instead of silently using an ephemeral filesystem or dropping messages.

## Durable media

Set `S3_BUCKET`, `S3_REGION`, and optionally `S3_ENDPOINT` for any S3-compatible service. Static access keys are optional when the runtime supplies workload credentials. When static credentials are used, both `S3_ACCESS_KEY_ID` and `S3_SECRET_ACCESS_KEY` are required. Use `S3_FORCE_PATH_STYLE=true` only for providers that require path-style bucket URLs.

The Payload storage adapter writes original images and generated thumbnail, card, and hero variants under the `media` prefix. Local storage remains available only when S3 is not configured. Before launch:

1. Create a private bucket in the same region as the application.
2. Grant the application identity read, write, list, and delete access only to that bucket/prefix.
3. Enable bucket versioning and a lifecycle policy appropriate for deleted media.
4. Configure bucket CORS only if direct browser uploads are enabled later.
5. Upload and delete a test image through `/admin`, then verify all generated variants.

## Transactional email

Set `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_FROM`, and the provider credentials. Authenticated SMTP is optional for trusted internal relays; if credentials are used, username and password must be supplied together.

`CONTACT_NOTIFICATION_TO` and `MEMBER_NOTIFICATION_TO` accept comma-separated recipient lists. `SMTP_OVERRIDE_RECIPIENT` redirects every message to one safe mailbox during acceptance testing. Remove it before launch.

Configured email supports:

- internal notification for new contact submissions;
- member acknowledgment and administrator notification for account requests;
- member notification when an account becomes active, suspended, or closed;
- non-enumerating password-reset requests with a 30-minute recovery link.

Sending failures are logged without deleting the contact or account change that triggered them. The CMS dashboard and `/health/ready` expose only safe configuration state, never credentials or recipient addresses.

## PostgreSQL backups

Create a verified custom-format database dump:

```bash
docker compose --profile operations run --rm database-backup
```

The job writes a timestamped `.dump` and SHA-256 file under `production/backups/`. Copy both files to encrypted storage outside the application host. Schedule this job externally at least daily and retain enough history to recover from delayed editorial or account-data mistakes.

## Contact retention

Run `docker compose --profile jobs run --rm contact-retention` without confirmation to report the number of expired submissions. After review, schedule it externally with `RETENTION_PURGE_CONFIRM=true` to delete records whose `deleteAfter` timestamp has passed. Keep the confirmation flag scoped to that job, alert on non-zero exits, and remember that backup expiry is a separate privacy control.

## Restore drill

Always test a restore against an empty, disposable database before using a production target. The restore job is deliberately blocked unless the operator supplies an explicit dump path and acknowledgment:

```bash
docker compose --profile restore run --rm \
  -e BACKUP_FILE=/backups/lv-roodenburg-YYYYMMDDTHHMMSSZ.dump \
  -e ALLOW_DATABASE_RESTORE=true \
  database-restore
```

The script verifies the checksum when present, validates the archive, and restores with ownership and provider-specific privileges removed. After a restore, apply `npm run migrate`, start the application, and verify `/health/ready`, CMS login, published news, member counts, and the active football snapshot.

## Acceptance evidence

Record the following outside the repository for each production environment:

- date and result of the latest database restore drill;
- database backup retention and encryption policy;
- object-storage versioning and lifecycle policy;
- successful S3 upload/delete test;
- successful SMTP test with the override recipient, followed by a real club mailbox test;
- uptime monitor target for `/health/live` and readiness monitor target for `/health/ready`.

The complete release checklist and evidence fields are in `LAUNCH_ACCEPTANCE.md`.

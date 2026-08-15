# Administration model

## One admin URL, separated responsibilities

The production application exposes Payload at `/admin`. It is the secure working area for club staff, but it keeps two identity domains separate:

| Area | Purpose | Who can access |
| --- | --- | --- |
| CMS staff | Admin login, editorial roles, content, media, drafts and publishing | Authorized staff only |
| Members | Website/member-portal accounts and account status | Administrators only |
| Operational dashboard | Content totals, drafts, media, new contacts and account counts | Authenticated CMS staff |
| Visitor analytics | Traffic, referrals and engagement | External analytics service linked from the dashboard |

Member accounts never grant CMS access. The Payload `users` collection is the configured admin identity; `members` is a separate authenticated collection used by the public member portal.

New public registrations always enter the `pending` state. An administrator checks the request against club records, adds the member number where applicable, and changes the status to `active`. Pending, suspended and closed accounts cannot log in. Members can update only their display name and preferred language through the public portal.

## Roles

| Role | Intended permissions |
| --- | --- |
| Administrator | CMS staff, members, all content and settings |
| Editor | General editorial content and contact workflow |
| Team editor | Assigned football/team editorial content |
| Sponsor editor | Sponsor records and commercial assets |

Automated access assertions live in `production/src/scripts/verify-access.ts` and run with `npm run verify:access`.

## Dashboard statistics

The built-in CMS home screen displays operational data already stored in PostgreSQL: published and draft stories, media assets, new contact submissions, CMS staff and active member accounts.

Visitor analytics are deliberately not written into the CMS database. Configure `ANALYTICS_PROVIDER` and `ANALYTICS_DASHBOARD_URL` to surface a link to a dedicated, privacy-controlled analytics product. This keeps tracking retention and consent independent from editorial records.

## Editorial preview

News and team-overlay edit screens provide a preview action. The generated link validates `PREVIEW_SECRET`, enables a signed Next.js draft-mode cookie, and opens the correct Dutch or English public URL. A visible banner identifies draft mode and provides an exit action.

Only saved drafts are previewed in this milestone. Published public requests continue to enforce Payload access control and cannot read drafts.

## Initial content

After migrations and the first administrator account are ready, run `npm run seed`. The idempotent script creates or updates the approved bilingual news content and initial site/membership settings. It does not create passwords, administrators, member accounts or unconfirmed Sportlink identifiers.

## Contact workflow

The public contact form writes a normalized record to `contact-submissions`; it cannot set workflow status, assignee or retention dates. The server records consent and calculates the deletion date from `CONTACT_RETENTION_DAYS`. Editors can triage the resulting `new` submissions, while only administrators can delete them. A separately scheduled retention job reports expired records by default and performs deletion only with the explicit `RETENTION_PURGE_CONFIRM=true` deployment setting.

When SMTP is configured, new contact submissions notify `CONTACT_NOTIFICATION_TO`. Member requests notify `MEMBER_NOTIFICATION_TO`; members receive bilingual status messages when administrators activate, suspend, or close an account. Delivery failures are logged but do not discard the underlying CMS record or status change.

The dashboard infrastructure panel reports whether durable S3 media and SMTP are configured, plus whether contact and member notification destinations exist. It never displays credentials or recipient addresses.

It also reports safe trusted-proxy, shared-rate-limit and contact-retention state. These indicators describe configuration, not proof that a CDN/WAF policy or scheduled job is operating; retain external acceptance evidence.

## Football data

Imported teams, matches and standings appear under **Football data** for inspection, but their fields are read-only in the admin interface. The external synchronization command owns these records. The dashboard shows whether a Sportlink snapshot is active and links to the sync history. Team descriptions, images, staff and related stories remain editable in **Team overlays**.

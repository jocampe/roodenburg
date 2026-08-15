# Payload CMS content model

## Collections

### News posts

`slug`, `kind`, bilingual `title`, `intro`, and `body`, `category`, `publishedAt`, `author`, `heroImage`, `status`, and related content. Enable drafts and versions.

### Media

Upload, bilingual alternative text and caption, source/credit, focal point, consent record, and optional expiry date.

### Club pages

Stable page key, bilingual title and body fields, reusable content sections, hero media, navigation order, and draft/published state.

### Events

Bilingual title and description, start/end time, venue, registration link, image, audience, and publication state.

### Sponsors

Name, tier, logo, website, bilingual description, display order, active dates, and publication state.

### Team editorial overlays

Sportlink team ID, stable public route slug, bilingual description, hero/team image, staff display data, related news, and display overrides. Fixtures, results, and standings remain owned by Sportlink.

### Imported football snapshots

Read-only snapshot collections store official teams, matches and standing rows. Every record contains a deterministic snapshot ID and source ID. A separate sync-run collection records success/failure and counts; the `FootballSyncState` global points public reads at the last fully successful snapshot.

### Contact submissions

Name, contact details, subject, message, locale, consent timestamp, processing status, assignee, and retention/deletion date. Restrict collection access to authorized staff.

## Globals

- `SiteSettings`: navigation, footer, social links, contact details, emergency notices, and default SEO fields
- `MembershipSettings`: fees, age bands, registration links, season dates, and membership contacts

## Roles

| Role | Access |
| --- | --- |
| Administrator | Configuration, users, all content, publishing |
| Editor | All editorial collections, drafts, publishing |
| Team editor | Assigned team overlays and related news |
| Sponsor editor | Sponsor records and assets |

Public APIs must return published content only. Editors preview drafts through authenticated Payload access. Keep version history enabled for editorial collections.

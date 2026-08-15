# Launch acceptance

This checklist is the release gate for the standalone application under `production/`. Record evidence for the selected production environment; source-level checks alone do not prove that DNS, the CDN, SMTP, storage, Sportlink, backups or monitoring are configured correctly.

## Automated gate

Run from `production/` on every release candidate:

```bash
npm ci
npm run generate:types
npx tsc --noEmit
npm run verify:access
npm run verify:infrastructure
npm run verify:public-api
npm run verify:football
npm run verify:launch
npm run build
```

`verify:launch` asserts the application security headers, private-route cache policy, trusted-proxy boundary, shared-rate-limit readiness gate, fragment-based password recovery and dry-run retention default.

## Security and privacy

- Serve only HTTPS and verify HSTS, CSP, clickjacking, MIME-sniffing, referrer and permissions headers at the public hostname.
- Keep the application unreachable except through the named proxy before setting `TRUST_PROXY_HEADERS=true`; configure `PROXY_IP_HEADER` to the single header that proxy overwrites.
- Enforce shared contact, login, registration and password-recovery rate limits at the CDN/WAF or ingress. Set `EDGE_RATE_LIMIT_REQUIRED=true` and `EDGE_RATE_LIMIT_VERIFIED=true` only after testing them; readiness fails when required but unverified.
- Rotate application, preview, database, S3, SMTP and Sportlink secrets through the deployment secret store. Never commit them.
- Confirm member and CMS cookies are Secure, HTTP-only and SameSite; confirm account pages and member/contact APIs return `no-store`.
- Confirm password-reset tokens use the URL fragment, are removed immediately by the account page, expire after 30 minutes and cannot be reused.
- Review administrator and editor accounts, remove test users, enable MFA at the identity/proxy layer where available, and run the access assertions.
- Publish the final privacy notice, lawful basis, contact channel and data-subject request procedure before accepting real submissions.

## Retention

Each contact submission receives a `deleteAfter` date. Run a safe report first:

```bash
docker compose --profile jobs run --rm contact-retention
```

Schedule the same job externally with `RETENTION_PURGE_CONFIRM=true` only after the dry-run count has been reviewed. The job deletes expired records in bounded batches and writes structured counts. Run it daily, alert on failures, and retain job logs according to club policy. Database backups can retain deleted personal data; document their expiry and access controls separately.

## Accessibility acceptance

- Complete keyboard-only journeys for navigation, language switch, match centre, news, contact and member account. Focus must remain visible and logical with no traps.
- Test current Chrome, Safari and Firefox plus VoiceOver or NVDA at 320 CSS pixels and 200% zoom.
- Verify headings, landmarks, names, errors, status announcements, form instructions and required fields.
- Check text and interactive contrast against WCAG 2.2 AA and test forced colors and reduced motion.
- Confirm every approved editorial image has meaningful alternative text or is explicitly decorative.
- Record any exception with owner and deadline. This checklist is not a claim of formal WCAG certification.

## Performance acceptance

- Run Lighthouse against an uncached production mobile session on the homepage, news article, team page, featured match, account and contact pages.
- Target at the 75th percentile: LCP at or below 2.5 seconds, INP at or below 200 ms, and CLS at or below 0.1.
- Confirm responsive image sizes/formats, font loading, compression, CDN caching for immutable assets, and `no-store` only on private/dynamic responses.
- Investigate any public route with more than 250 KB compressed first-party JavaScript or a hero image over 300 KB.

## Reliability and monitoring

- Monitor `/health/live` for process availability and `/health/ready` for database and required configuration readiness from outside the hosting network.
- Send structured application and job logs to a retained log service; alert on elevated 5xx responses, authentication abuse, failed email, failed Sportlink sync, retention failure and backup failure.
- Connect provider-neutral error monitoring with source maps scrubbed of personal data.
- Complete an S3 upload/delete test, SMTP override test followed by a real mailbox test, and the first validated Sportlink sync.
- Schedule encrypted off-host PostgreSQL backups and record a successful restore drill. Verify object-storage versioning and lifecycle policy.

## Release sign-off

Record release commit, container digest, migration result, DNS/TLS result, browser/accessibility evidence, performance measurements, integration tests, backup/restore date, open exceptions, approver and launch date. The review deployment is frontend-only; sign-off applies to the separately hosted production application.

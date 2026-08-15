import assert from "node:assert/strict";
import { memberPasswordResetEmail } from "../infrastructure/email";
import {
  operationalConfiguration,
  resolveContactRetentionConfiguration,
  resolveS3Configuration,
  resolveSecurityConfiguration,
  resolveSMTPConfiguration,
} from "../infrastructure/runtime-config";

assert.deepEqual(operationalConfiguration({}), {
  media: { mode: "local", required: false },
  email: {
    mode: "disabled",
    required: false,
    contactNotifications: false,
    memberNotifications: false,
  },
  security: { trustedProxy: false, edgeRateLimit: "not-verified" },
  privacy: { contactRetentionDays: 180, purgeMode: "dry-run" },
});

assert.deepEqual(resolveS3Configuration({
  S3_BUCKET: "club-media",
  S3_REGION: "eu-central-1",
}), {
  accessKeyId: undefined,
  bucket: "club-media",
  enabled: true,
  endpoint: undefined,
  forcePathStyle: false,
  region: "eu-central-1",
  required: false,
  secretAccessKey: undefined,
});

assert.throws(
  () => resolveS3Configuration({ S3_ACCESS_KEY_ID: "partial" }),
  /S3_BUCKET/,
);
assert.throws(
  () => resolveS3Configuration({ S3_BUCKET: "club-media", S3_ACCESS_KEY_ID: "partial" }),
  /configured together/,
);
assert.throws(
  () => resolveS3Configuration({ S3_REQUIRED: "true" }),
  /S3_BUCKET/,
);

const smtp = resolveSMTPConfiguration({
  SMTP_HOST: "smtp.example.nl",
  SMTP_PORT: "465",
  SMTP_SECURE: "true",
  SMTP_FROM: "website@example.nl",
  SMTP_USER: "mailer",
  SMTP_PASSWORD: "secret",
  CONTACT_NOTIFICATION_TO: "contact@example.nl,secretary@example.nl",
});
assert.equal(smtp.enabled, true);
assert.equal(smtp.secure, true);
assert.equal(smtp.port, 465);
assert.deepEqual(smtp.contactRecipients, ["contact@example.nl", "secretary@example.nl"]);
assert.throws(
  () => resolveSMTPConfiguration({ SMTP_HOST: "smtp.example.nl", SMTP_USER: "partial" }),
  /configured together/,
);
assert.throws(
  () => resolveSMTPConfiguration({ SMTP_REQUIRED: "true" }),
  /SMTP_HOST/,
);

const reset = memberPasswordResetEmail({
  token: "safe-token",
  user: { preferredLocale: "en" },
});
assert.match(reset.subject, /Reset your password/);
assert.match(reset.html, /#reset=safe-token/);
assert.match(reset.html, /30 minutes/);

assert.deepEqual(resolveSecurityConfiguration({}), {
  edgeRateLimitRequired: false,
  edgeRateLimitVerified: false,
  proxyIPHeader: "x-forwarded-for",
  trustProxyHeaders: false,
});
assert.deepEqual(resolveContactRetentionConfiguration({}), { days: 180, purgeConfirmed: false });

console.log("Verified S3, SMTP, notification and password-reset configuration boundaries.");

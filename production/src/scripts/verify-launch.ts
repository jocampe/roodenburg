import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { privateRouteHeaders, securityHeaders } from "../../security-headers.mjs";
import {
  resolveContactRetentionConfiguration,
  resolveSecurityConfiguration,
} from "../infrastructure/runtime-config";

const header = (headers: { key: string; value: string }[], key: string) =>
  headers.find((entry) => entry.key === key)?.value || "";

assert.match(header(securityHeaders, "Content-Security-Policy"), /frame-ancestors 'none'/);
assert.equal(header(securityHeaders, "X-Content-Type-Options"), "nosniff");
assert.equal(header(securityHeaders, "X-Frame-Options"), "DENY");
assert.equal(header(privateRouteHeaders, "Referrer-Policy"), "no-referrer");
assert.match(header(privateRouteHeaders, "Cache-Control"), /no-store/);

assert.deepEqual(resolveSecurityConfiguration({}), {
  edgeRateLimitRequired: false,
  edgeRateLimitVerified: false,
  proxyIPHeader: "x-forwarded-for",
  trustProxyHeaders: false,
});
assert.throws(
  () => resolveSecurityConfiguration({ TRUST_PROXY_HEADERS: "true", PROXY_IP_HEADER: "client-ip" }),
  /PROXY_IP_HEADER/,
);
assert.throws(
  () => resolveSecurityConfiguration({ EDGE_RATE_LIMIT_REQUIRED: "true" }),
  /EDGE_RATE_LIMIT_VERIFIED/,
);
assert.equal(resolveContactRetentionConfiguration({}).purgeConfirmed, false);
assert.equal(resolveContactRetentionConfiguration({ CONTACT_RETENTION_DAYS: "90" }).days, 90);
assert.throws(() => resolveContactRetentionConfiguration({ CONTACT_RETENTION_DAYS: "800" }), /between 30 and 365/);

const emailSource = await readFile(new URL("../infrastructure/email.ts", import.meta.url), "utf8");
assert.match(emailSource, /account#reset=/);
assert.doesNotMatch(emailSource, /account\?resetToken=/);

const purgeSource = await readFile(new URL("./purge-contact-retention.ts", import.meta.url), "utf8");
assert.match(purgeSource, /if \(!retention\.purgeConfirmed\)/);

console.log("Verified launch security headers, trusted-proxy boundary, private recovery links and retention safeguards.");

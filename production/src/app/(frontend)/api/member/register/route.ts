import config from "@payload-config";
import { getPayload } from "payload";
import {
  assertSameOrigin,
  emailField,
  enforceRateLimit,
  errorResponse,
  noStoreJSON,
  parseJSON,
  PublicAPIError,
  textField,
} from "../../../../../lib/public-api";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    enforceRateLimit(request, "member-register", { limit: 5, windowMs: 60 * 60 * 1000 });
    const body = await parseJSON(request);

    if (body.website) return noStoreJSON({ ok: true, pending: true }, { status: 202 });
    if (body.consent !== true) throw new PublicAPIError(400, "consent_required");

    const name = textField(body, "name", { min: 2, max: 120 });
    const email = emailField(body);
    const password = textField(body, "password", { min: 12, max: 128 });
    const locale = body.locale === "en" ? "en" : "nl";
    const payload = await getPayload({ config });

    const existing = await payload.find({
      collection: "members",
      limit: 1,
      overrideAccess: true,
      where: { email: { equals: email } },
    });

    if (existing.totalDocs === 0) {
      await payload.create({
        collection: "members",
        overrideAccess: true,
        data: {
          name,
          email,
          password,
          status: "pending",
          preferredLocale: locale,
          consentedAt: new Date().toISOString(),
        },
      });
    }

    return noStoreJSON({ ok: true, pending: true }, { status: 202 });
  } catch (error) {
    return errorResponse(error);
  }
}

import config from "@payload-config";
import { getPayload } from "payload";
import {
  assertSameOrigin,
  emailField,
  enforceRateLimit,
  errorResponse,
  optionalTextField,
  noStoreJSON,
  parseJSON,
  PublicAPIError,
  textField,
} from "../../../../lib/public-api";
import { resolveContactRetentionConfiguration } from "../../../../infrastructure/runtime-config";

const topics = ["general", "membership", "team", "volunteering", "sponsoring", "organisation"] as const;
const subjectLabels = {
  general: "General question",
  membership: "Membership",
  team: "Team question",
  volunteering: "Volunteering",
  sponsoring: "Sponsorship",
  organisation: "Organisation",
} as const;

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    enforceRateLimit(request, "contact", { limit: 6, windowMs: 30 * 60 * 1000 });
    const body = await parseJSON(request);

    if (body.website) return noStoreJSON({ ok: true }, { status: 202 });
    if (body.consent !== true) throw new PublicAPIError(400, "consent_required");

    const topic = typeof body.topic === "string" && topics.includes(body.topic as typeof topics[number])
      ? body.topic as typeof topics[number]
      : "general";
    const locale = body.locale === "en" ? "en" : "nl";
    const retentionDays = resolveContactRetentionConfiguration().days;
    const deleteAfter = new Date(Date.now() + retentionDays * 24 * 60 * 60 * 1000);
    const payload = await getPayload({ config });

    await payload.create({
      collection: "contact-submissions",
      overrideAccess: true,
      data: {
        name: textField(body, "name", { min: 2, max: 120 }),
        email: emailField(body),
        phone: optionalTextField(body, "phone", 40),
        topic,
        subject: subjectLabels[topic],
        message: textField(body, "message", { min: 10, max: 5_000 }),
        locale,
        consentedAt: new Date().toISOString(),
        status: "new",
        deleteAfter: deleteAfter.toISOString(),
      },
    });

    return noStoreJSON({ ok: true }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}

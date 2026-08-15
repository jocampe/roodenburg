import config from "@payload-config";
import { getPayload } from "payload";
import {
  assertSameOrigin,
  emailField,
  enforceRateLimit,
  errorResponse,
  parseJSON,
} from "../../../../../lib/public-api";
import { resolveSMTPConfiguration } from "../../../../../infrastructure/runtime-config";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    enforceRateLimit(request, "member-forgot-password", { limit: 3, windowMs: 60 * 60 * 1000 });
    const body = await parseJSON(request);
    const email = emailField(body);
    const payload = await getPayload({ config });
    const smtp = resolveSMTPConfiguration();

    if (smtp.enabled) {
      const member = await payload.find({
        collection: "members",
        limit: 1,
        overrideAccess: true,
        where: {
          and: [
            { email: { equals: email } },
            { status: { equals: "active" } },
          ],
        },
      });

      if (member.totalDocs > 0) {
        try {
          await payload.forgotPassword({
            collection: "members",
            data: { email },
            overrideAccess: true,
          });
        } catch (error) {
          payload.logger.error({ err: error, event: "member.password-reset.request" }, "Password reset email failed");
        }
      }
    }

    const response = Response.json({ ok: true }, { status: 202 });
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch (error) {
    return errorResponse(error);
  }
}

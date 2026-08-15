import config from "@payload-config";
import { getPayload } from "payload";
import {
  assertSameOrigin,
  enforceRateLimit,
  errorResponse,
  parseJSON,
  PublicAPIError,
  textField,
} from "../../../../../lib/public-api";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    enforceRateLimit(request, "member-reset-password", { limit: 5, windowMs: 60 * 60 * 1000 });
    const body = await parseJSON(request);
    const token = textField(body, "token", { min: 20, max: 1_024 });
    const password = textField(body, "password", { min: 12, max: 128 });
    const payload = await getPayload({ config });

    try {
      await payload.resetPassword({
        collection: "members",
        data: { password, token },
        overrideAccess: true,
      });
    } catch {
      throw new PublicAPIError(400, "invalid_or_expired_token");
    }

    const response = Response.json({ ok: true });
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch (error) {
    return errorResponse(error);
  }
}

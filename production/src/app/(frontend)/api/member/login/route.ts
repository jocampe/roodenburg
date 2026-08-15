import config from "@payload-config";
import { getPayload } from "payload";
import {
  assertSameOrigin,
  emailField,
  enforceRateLimit,
  errorResponse,
  parseJSON,
  PublicAPIError,
  textField,
} from "../../../../../lib/public-api";
import { memberCookieName, publicMember } from "../../../../../lib/member-session";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    enforceRateLimit(request, "member-login", { limit: 10, windowMs: 15 * 60 * 1000 });
    const body = await parseJSON(request);
    const email = emailField(body);
    const password = textField(body, "password", { max: 128 });
    const payload = await getPayload({ config });
    const found = await payload.find({
      collection: "members",
      limit: 1,
      overrideAccess: true,
      where: { email: { equals: email } },
    });
    const candidate = found.docs[0];

    if (!candidate || candidate.status !== "active") {
      throw new PublicAPIError(401, "account_unavailable");
    }

    let result;
    try {
      result = await payload.login({
        collection: "members",
        data: { email, password },
        overrideAccess: false,
      });
    } catch {
      throw new PublicAPIError(401, "invalid_credentials");
    }
    if (!result.token || !result.user) throw new PublicAPIError(401, "invalid_credentials");

    const authenticatedAt = new Date().toISOString();
    const member = await payload.update({
      collection: "members",
      id: result.user.id,
      overrideAccess: true,
      data: { lastAuthenticatedAt: authenticatedAt },
    });
    const response = Response.json({ ok: true, member: publicMember(member) });
    const maxAge = result.exp ? Math.max(0, result.exp - Math.floor(Date.now() / 1000)) : 28_800;
    response.headers.append("Set-Cookie", `${memberCookieName}=${encodeURIComponent(result.token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${process.env.NODE_ENV === "production" ? "; Secure" : ""}`);
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch (error) {
    return errorResponse(error);
  }
}

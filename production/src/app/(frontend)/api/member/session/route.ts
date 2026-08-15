import {
  assertSameOrigin,
  errorResponse,
  parseJSON,
  PublicAPIError,
  textField,
} from "../../../../../lib/public-api";
import { authenticateMember, publicMember } from "../../../../../lib/member-session";

export async function GET(request: Request) {
  try {
    const authenticated = await authenticateMember(request);
    if (!authenticated) throw new PublicAPIError(401, "not_authenticated");
    return Response.json(
      { ok: true, member: publicMember(authenticated.member) },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(request: Request) {
  try {
    assertSameOrigin(request);
    const authenticated = await authenticateMember(request);
    if (!authenticated) throw new PublicAPIError(401, "not_authenticated");
    const body = await parseJSON(request);
    const name = textField(body, "name", { min: 2, max: 120 });
    const preferredLocale = body.preferredLocale === "en" ? "en" : "nl";
    const member = await authenticated.payload.update({
      collection: "members",
      id: authenticated.member.id,
      overrideAccess: true,
      data: { name, preferredLocale },
    });
    return Response.json(
      { ok: true, member: publicMember(member) },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return errorResponse(error);
  }
}

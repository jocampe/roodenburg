import { assertSameOrigin, errorResponse } from "../../../../../lib/public-api";
import { memberCookieName } from "../../../../../lib/member-session";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const response = Response.json({ ok: true });
    response.headers.append("Set-Cookie", `${memberCookieName}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${process.env.NODE_ENV === "production" ? "; Secure" : ""}`);
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch (error) {
    return errorResponse(error);
  }
}

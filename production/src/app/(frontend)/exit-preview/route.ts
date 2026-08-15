import { draftMode } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const locale = url.searchParams.get("locale") === "en" ? "en" : "nl";
  (await draftMode()).disable();
  return NextResponse.redirect(new URL(`/${locale}`, url.origin));
}

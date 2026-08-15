import { draftMode } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const expectedSecret = process.env.PREVIEW_SECRET;
  const suppliedSecret = url.searchParams.get("secret");
  const collection = url.searchParams.get("collection");
  const slug = url.searchParams.get("slug") || "";
  const locale = url.searchParams.get("locale") === "en" ? "en" : "nl";

  if (!expectedSecret || suppliedSecret !== expectedSecret) {
    return Response.json({ error: "Invalid preview token" }, { status: 401 });
  }

  if (!/^[a-z0-9-]+$/.test(slug) || !["news-posts", "team-overlays"].includes(collection || "")) {
    return Response.json({ error: "Invalid preview target" }, { status: 400 });
  }

  const target = collection === "news-posts"
    ? `/${locale}/news/${slug}`
    : `/${locale}/teams/${slug}`;

  (await draftMode()).enable();
  return NextResponse.redirect(new URL(target, url.origin));
}

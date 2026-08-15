type PreviewCollection = "news-posts" | "team-overlays";

export const buildPreviewURL = ({
  collection,
  locale,
  slug,
}: {
  collection: PreviewCollection;
  locale?: string;
  slug: string;
}) => {
  const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";
  const url = new URL("/preview", serverURL);
  url.searchParams.set("collection", collection);
  url.searchParams.set("slug", slug);
  url.searchParams.set("locale", locale === "en" ? "en" : "nl");
  url.searchParams.set("secret", process.env.PREVIEW_SECRET || "");
  return url.toString();
};

import config from "@payload-config";
import { getPayload } from "payload";
import { newsPosts } from "../app/(frontend)/site-data";

const lexicalDocument = (paragraphs: string[]) => ({
  root: {
    type: "root" as const,
    children: paragraphs.map((paragraph) => ({
      type: "paragraph" as const,
      direction: "ltr" as const,
      format: "" as const,
      indent: 0,
      version: 1,
      children: [{
        type: "text" as const,
        detail: 0,
        format: 0,
        mode: "normal" as const,
        style: "",
        text: paragraph,
        version: 1,
      }],
    })),
    direction: "ltr" as const,
    format: "" as const,
    indent: 0,
    version: 1,
  },
});

const payload = await getPayload({ config });

for (const [index, post] of newsPosts.entries()) {
  const existing = await payload.find({
    collection: "news-posts",
    where: { slug: { equals: post.slug } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  });

  const shared = {
    slug: post.slug,
    kind: (post.kind === "report" ? "match-report" : "news") as "match-report" | "news",
    publishedAt: new Date(Date.UTC(2026, 7, 22 - index, 10)).toISOString(),
    _status: "published" as const,
  };

  const dutch = {
    ...shared,
    title: post.title.nl,
    intro: post.intro.nl,
    category: post.category.nl,
    body: lexicalDocument(post.body.map((paragraph) => paragraph.nl)),
  };

  const english = {
    title: post.title.en,
    intro: post.intro.en,
    category: post.category.en,
    body: lexicalDocument(post.body.map((paragraph) => paragraph.en)),
  };

  const document = existing.docs[0]
    ? await payload.update({
        collection: "news-posts",
        id: existing.docs[0].id,
        locale: "nl",
        data: dutch,
        overrideAccess: true,
      })
    : await payload.create({
        collection: "news-posts",
        locale: "nl",
        data: dutch,
        overrideAccess: true,
      });

  await payload.update({
    collection: "news-posts",
    id: document.id,
    locale: "en",
    data: english,
    overrideAccess: true,
  });
}

await payload.updateGlobal({
  slug: "site-settings",
  locale: "nl",
  overrideAccess: true,
  data: {
    clubName: "L.V. Roodenburg",
    contactEmail: "info@lvroodenburg.nl",
    address: "Sportpark Noord, Leiden",
    defaultSeoTitle: "L.V. Roodenburg",
    defaultSeoDescription: "Teams, wedstrijden, nieuws en clubinformatie van L.V. Roodenburg.",
  },
});

await payload.updateGlobal({
  slug: "site-settings",
  locale: "en",
  overrideAccess: true,
  data: {
    defaultSeoTitle: "L.V. Roodenburg",
    defaultSeoDescription: "Teams, matches, news and club information from L.V. Roodenburg.",
  },
});

await payload.updateGlobal({
  slug: "membership-settings",
  locale: "nl",
  overrideAccess: true,
  data: {
    season: "2026–2027",
    contactEmail: "ledenadministratie@lvroodenburg.nl",
  },
});

const seeded = await payload.count({ collection: "news-posts", overrideAccess: true });
payload.logger.info(`Seed complete: ${seeded.totalDocs} news posts available.`);
process.exit(0);

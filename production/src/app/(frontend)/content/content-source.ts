import config from "@payload-config";
import { draftMode } from "next/headers";
import { getPayload } from "payload";
import {
  ClubMatch,
  ClubStanding,
  ClubTeam,
  Locale,
  NewsPost,
  clubTeams as fallbackTeams,
  newsPosts as fallbackNewsPosts,
} from "../site-data";

type PayloadDocument = Record<string, unknown>;

export interface ContentSource {
  listTeams(): Promise<readonly ClubTeam[]>;
  getTeam(slug: string): Promise<ClubTeam | undefined>;
  listNewsPosts(kind?: NewsPost["kind"]): Promise<readonly NewsPost[]>;
  getNewsPost(slug: string): Promise<NewsPost | undefined>;
}

const asString = (value: unknown, fallback = "") => typeof value === "string" ? value : fallback;
const asNumber = (value: unknown, fallback = 0) => typeof value === "number" && Number.isFinite(value) ? value : fallback;

const previewEnabled = async () => {
  try {
    return (await draftMode()).isEnabled;
  } catch {
    return false;
  }
};

const relationshipName = (value: unknown, fallback: string) => {
  if (!value || typeof value !== "object") return fallback;
  return asString((value as PayloadDocument).name, fallback);
};

const mediaValue = (value: unknown, field: "url" | "alt", fallback: string) => {
  if (!value || typeof value !== "object") return fallback;
  return asString((value as PayloadDocument)[field], fallback);
};

const lexicalText = (value: unknown): string[] => {
  if (!value || typeof value !== "object") return [];
  const root = (value as PayloadDocument).root;
  if (!root || typeof root !== "object") return [];
  const children = (root as PayloadDocument).children;
  if (!Array.isArray(children)) return [];

  const readNode = (node: unknown): string => {
    if (!node || typeof node !== "object") return "";
    const record = node as PayloadDocument;
    const ownText = asString(record.text);
    const nested = Array.isArray(record.children) ? record.children.map(readNode).join("") : "";
    return ownText || nested;
  };

  return children.map(readNode).map((paragraph) => paragraph.trim()).filter(Boolean);
};

const formatDate = (value: unknown, locale: Locale, style: "short" | "long") => {
  const raw = asString(value);
  if (!raw) return locale === "nl" ? "Binnenkort" : "Coming soon";
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return raw;
  return new Intl.DateTimeFormat(locale === "nl" ? "nl-NL" : "en-GB", style === "long"
    ? { day: "numeric", month: "long", year: "numeric" }
    : { day: "numeric", month: "long" }).format(date);
};

const toNewsPost = (nl: PayloadDocument, en: PayloadDocument): NewsPost => {
  const kindValue = asString(nl.kind, "news");
  const kind: NewsPost["kind"] = kindValue === "match-report" ? "report" : "news";
  const nlBody = lexicalText(nl.body);
  const enBody = lexicalText(en.body);
  const nlIntro = asString(nl.intro);
  const enIntro = asString(en.intro, nlIntro);

  return {
    slug: asString(nl.slug),
    kind,
    category: {
      nl: asString(nl.category, kind === "report" ? "Wedstrijdverslag" : "Clubnieuws"),
      en: asString(en.category, kind === "report" ? "Match report" : "Club news"),
    },
    title: { nl: asString(nl.title), en: asString(en.title, asString(nl.title)) },
    date: { nl: formatDate(nl.publishedAt, "nl", "short"), en: formatDate(en.publishedAt, "en", "short") },
    published: { nl: formatDate(nl.publishedAt, "nl", "long"), en: formatDate(en.publishedAt, "en", "long") },
    author: {
      nl: relationshipName(nl.author, "Redactie Roodenburg"),
      en: relationshipName(en.author, "Roodenburg editorial team"),
    },
    intro: { nl: nlIntro, en: enIntro },
    body: (nlBody.length ? nlBody : [nlIntro]).map((paragraph, index) => ({
      nl: paragraph,
      en: enBody[index] || enBody[0] || enIntro,
    })),
    image: mediaValue(nl.heroImage, "url", "/gallery-match.webp"),
    imageAlt: {
      nl: mediaValue(nl.heroImage, "alt", "L.V. Roodenburg"),
      en: mediaValue(en.heroImage, "alt", "L.V. Roodenburg"),
    },
  };
};

class PayloadContentSource implements ContentSource {
  private async findNews(locale: Locale) {
    const payload = await getPayload({ config });
    const preview = await previewEnabled();
    const result = await payload.find({
      collection: "news-posts",
      locale,
      fallbackLocale: false,
      depth: 2,
      limit: 100,
      sort: "-publishedAt",
      draft: preview,
      overrideAccess: preview,
    });
    return result.docs as unknown as PayloadDocument[];
  }

  async listNewsPosts(kind?: NewsPost["kind"]) {
    try {
      const [nlDocuments, enDocuments] = await Promise.all([this.findNews("nl"), this.findNews("en")]);
      if (nlDocuments.length === 0) throw new Error("CMS contains no published news posts");
      const englishBySlug = new Map(enDocuments.map((document) => [asString(document.slug), document]));
      const posts = nlDocuments.map((document) => toNewsPost(document, englishBySlug.get(asString(document.slug)) || document));
      return kind ? posts.filter((post) => post.kind === kind) : posts;
    } catch {
      return kind ? fallbackNewsPosts.filter((post) => post.kind === kind) : fallbackNewsPosts;
    }
  }

  async getNewsPost(slug: string) {
    return (await this.listNewsPosts()).find((post) => post.slug === slug);
  }

  async listTeams() {
    try {
      const payload = await getPayload({ config });
      const preview = await previewEnabled();
      const state = await payload.findGlobal({
        slug: "football-sync-state",
        overrideAccess: false,
      }) as unknown as PayloadDocument;
      const snapshotId = asString(state.currentSnapshotId);

      const overlaysResult = await payload.find({
        collection: "team-overlays",
        locale: "nl",
        fallbackLocale: false,
        depth: 0,
        limit: 100,
        draft: preview,
        overrideAccess: preview,
      });
      const overlays = overlaysResult.docs as unknown as PayloadDocument[];

      if (!snapshotId) {
        const overlayBySlug = new Map(overlays.map((overlay) => [asString(overlay.routeSlug), overlay]));
        return fallbackTeams.map((team) => {
          const overlay = overlayBySlug.get(team.slug);
          return {
            ...team,
            dataOrigin: "sample" as const,
            name: overlay ? asString(overlay.displayName, team.name) : team.name,
          };
        });
      }

      const [teamsResult, matchesResult, standingsResult] = await Promise.all([
        payload.find({
          collection: "football-teams",
          limit: 500,
          pagination: false,
          overrideAccess: false,
          sort: "name",
          where: { and: [{ snapshotId: { equals: snapshotId } }, { active: { equals: true } }] },
        }),
        payload.find({
          collection: "football-matches",
          limit: 5_000,
          pagination: false,
          overrideAccess: false,
          sort: "startsAt",
          where: { snapshotId: { equals: snapshotId } },
        }),
        payload.find({
          collection: "football-standings",
          limit: 5_000,
          pagination: false,
          overrideAccess: false,
          sort: "position",
          where: { snapshotId: { equals: snapshotId } },
        }),
      ]);

      const teamDocuments = teamsResult.docs as unknown as PayloadDocument[];
      if (teamDocuments.length === 0) throw new Error("Published football snapshot contains no active teams");
      const matchDocuments = matchesResult.docs as unknown as PayloadDocument[];
      const standingDocuments = standingsResult.docs as unknown as PayloadDocument[];
      const overlayBySourceId = new Map(overlays.map((overlay) => [asString(overlay.sportlinkTeamId), overlay]));
      const fallbackBySlug = new Map(fallbackTeams.map((team) => [team.slug, team]));

      return teamDocuments.map((document): ClubTeam => {
        const sourceId = asString(document.sourceId);
        const overlay = overlayBySourceId.get(sourceId);
        const routeSlug = asString(overlay?.routeSlug, asString(document.routeSlug));
        const fallback = fallbackBySlug.get(routeSlug);
        const teamMatches = matchDocuments
          .filter((match) => asString(match.teamSourceId) === sourceId)
          .map((match): ClubMatch => {
            const status = asString(match.status, "scheduled") as ClubMatch["status"];
            return {
              id: asString(match.publicSlug, asString(match.sourceId)),
              startsAt: asString(match.startsAt),
              kind: status === "finished" ? "results" : "fixtures",
              status,
              competition: asString(match.competitionType, "other") as ClubMatch["competition"],
              competitionName: asString(match.competitionName),
              location: asString(match.teamSide, "home") as ClubMatch["location"],
              home: asString(match.homeTeam),
              away: asString(match.awayTeam),
              homeScore: typeof match.homeScore === "number" ? match.homeScore : null,
              awayScore: typeof match.awayScore === "number" ? match.awayScore : null,
              venue: asString(match.venue),
            };
          });
        const firstUpcoming = teamMatches.find((match) => match.kind === "fixtures" && match.status === "scheduled");
        if (firstUpcoming) firstUpcoming.next = true;

        const standings: ClubTeam["standings"] = {};
        for (const split of ["overall", "home", "away"] as const) {
          const rows = standingDocuments
            .filter((row) => asString(row.teamSourceId) === sourceId && asString(row.split) === split)
            .map((row): ClubStanding => ({
              position: asNumber(row.position),
              clubName: asString(row.clubName),
              played: asNumber(row.played),
              points: asNumber(row.points),
              goalDifference: asNumber(row.goalsFor) - asNumber(row.goalsAgainst),
            }));
          if (rows.length) standings[split] = rows;
        }

        const footballType = asString(document.footballType, "outdoor");
        return {
          slug: routeSlug,
          name: asString(overlay?.displayName, asString(document.name)),
          category: asString(document.category, "senioren") as ClubTeam["category"],
          football: fallback?.football || (footballType === "futsal"
            ? { nl: "Zaalvoetbal", en: "Futsal" }
            : { nl: "Veldvoetbal", en: "Outdoor football" }),
          competition: asString(document.competition),
          training: fallback?.training || { nl: "Bekijk het programma", en: "See the schedule" },
          featured: fallback?.featured,
          matches: teamMatches,
          standings,
          season: asString(document.season),
          dataOrigin: "sportlink",
          syncedAt: asString(state.lastSuccessfulAt),
        };
      });
    } catch {
      return fallbackTeams.map((team) => ({ ...team, dataOrigin: "sample" as const }));
    }
  }

  async getTeam(slug: string) {
    return (await this.listTeams()).find((team) => team.slug === slug);
  }
}

export const contentSource: ContentSource = new PayloadContentSource();

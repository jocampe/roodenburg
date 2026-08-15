import { ClubTeam, NewsPost, clubTeams, newsPosts } from "../site-data";

export interface ContentSource {
  listTeams(): readonly ClubTeam[];
  getTeam(slug: string): ClubTeam | undefined;
  listNewsPosts(kind?: NewsPost["kind"]): readonly NewsPost[];
  getNewsPost(slug: string): NewsPost | undefined;
}

class LocalContentSource implements ContentSource {
  listTeams() {
    return clubTeams;
  }

  getTeam(slug: string) {
    return clubTeams.find((team) => team.slug === slug);
  }

  listNewsPosts(kind?: NewsPost["kind"]) {
    return kind ? newsPosts.filter((post) => post.kind === kind) : newsPosts;
  }

  getNewsPost(slug: string) {
    return newsPosts.find((post) => post.slug === slug);
  }
}

// Swap only this provider when Payload becomes the editorial content source.
export const contentSource: ContentSource = new LocalContentSource();

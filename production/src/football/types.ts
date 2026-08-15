import { createHash } from "node:crypto";

export const footballCategories = ["senioren", "jeugd", "pupillen", "zaal"] as const;
export const footballTypes = ["outdoor", "futsal"] as const;
export const matchStatuses = ["scheduled", "finished", "postponed", "cancelled"] as const;
export const competitionTypes = ["league", "cup", "friendly", "other"] as const;
export const teamSides = ["home", "away"] as const;
export const standingSplits = ["overall", "home", "away"] as const;

export type FootballCategory = typeof footballCategories[number];
export type FootballType = typeof footballTypes[number];
export type MatchStatus = typeof matchStatuses[number];
export type CompetitionType = typeof competitionTypes[number];
export type TeamSide = typeof teamSides[number];
export type StandingSplit = typeof standingSplits[number];

export type FootballTeamSnapshot = {
  id: string;
  slug: string;
  name: string;
  category: FootballCategory;
  footballType: FootballType;
  competition: string;
  season: string;
  active: boolean;
};

export type FootballMatchSnapshot = {
  id: string;
  slug: string;
  teamId: string;
  startsAt: string;
  status: MatchStatus;
  competitionType: CompetitionType;
  competitionName: string;
  teamSide: TeamSide;
  homeTeam: string;
  awayTeam: string;
  homeScore: number | null;
  awayScore: number | null;
  venue: string;
};

export type FootballStandingSnapshot = {
  id: string;
  teamId: string;
  season: string;
  split: StandingSplit;
  position: number;
  clubName: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
};

export type FootballSnapshot = {
  provider: "sportlink";
  generatedAt: string;
  teams: FootballTeamSnapshot[];
  matches: FootballMatchSnapshot[];
  standings: FootballStandingSnapshot[];
};

export class FootballSnapshotError extends Error {}

const record = (value: unknown, path: string) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new FootballSnapshotError(`${path} must be an object`);
  }
  return value as Record<string, unknown>;
};

const list = (value: unknown, path: string) => {
  if (!Array.isArray(value)) throw new FootballSnapshotError(`${path} must be an array`);
  return value;
};

const stringValue = (value: unknown, path: string, max = 180) => {
  if (typeof value !== "string" || value.trim().length === 0 || value.trim().length > max) {
    throw new FootballSnapshotError(`${path} must be a non-empty string of at most ${max} characters`);
  }
  return value.trim();
};

const dateValue = (value: unknown, path: string) => {
  const date = stringValue(value, path, 64);
  if (Number.isNaN(Date.parse(date))) throw new FootballSnapshotError(`${path} must be an ISO date`);
  return new Date(date).toISOString();
};

const integerValue = (value: unknown, path: string, min = 0) => {
  if (!Number.isInteger(value) || Number(value) < min) {
    throw new FootballSnapshotError(`${path} must be an integer greater than or equal to ${min}`);
  }
  return Number(value);
};

const nullableScore = (value: unknown, path: string) => value === null
  ? null
  : integerValue(value, path);

const enumValue = <T extends string>(value: unknown, allowed: readonly T[], path: string): T => {
  if (typeof value !== "string" || !allowed.includes(value as T)) {
    throw new FootballSnapshotError(`${path} has an unsupported value`);
  }
  return value as T;
};

const unique = (values: string[], path: string) => {
  if (new Set(values).size !== values.length) throw new FootballSnapshotError(`${path} contains duplicate IDs`);
};

export const validateFootballSnapshot = (input: unknown): FootballSnapshot => {
  const root = record(input, "snapshot");
  if (root.provider !== "sportlink") throw new FootballSnapshotError("snapshot.provider must be sportlink");

  const teams = list(root.teams, "snapshot.teams").map((item, index): FootballTeamSnapshot => {
    const team = record(item, `snapshot.teams[${index}]`);
    const slug = stringValue(team.slug, `snapshot.teams[${index}].slug`, 120);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      throw new FootballSnapshotError(`snapshot.teams[${index}].slug must be URL-safe`);
    }
    return {
      id: stringValue(team.id, `snapshot.teams[${index}].id`, 120),
      slug,
      name: stringValue(team.name, `snapshot.teams[${index}].name`),
      category: enumValue(team.category, footballCategories, `snapshot.teams[${index}].category`),
      footballType: enumValue(team.footballType, footballTypes, `snapshot.teams[${index}].footballType`),
      competition: stringValue(team.competition, `snapshot.teams[${index}].competition`),
      season: stringValue(team.season, `snapshot.teams[${index}].season`, 32),
      active: team.active !== false,
    };
  });
  if (teams.length === 0) throw new FootballSnapshotError("snapshot.teams must contain at least one team");
  unique(teams.map((team) => team.id), "snapshot.teams");
  unique(teams.map((team) => team.slug), "snapshot.teams slugs");
  const teamIDs = new Set(teams.map((team) => team.id));

  const matches = list(root.matches, "snapshot.matches").map((item, index): FootballMatchSnapshot => {
    const match = record(item, `snapshot.matches[${index}]`);
    const teamId = stringValue(match.teamId, `snapshot.matches[${index}].teamId`, 120);
    if (!teamIDs.has(teamId)) throw new FootballSnapshotError(`snapshot.matches[${index}] references an unknown team`);
    const status = enumValue(match.status, matchStatuses, `snapshot.matches[${index}].status`);
    const homeScore = nullableScore(match.homeScore, `snapshot.matches[${index}].homeScore`);
    const awayScore = nullableScore(match.awayScore, `snapshot.matches[${index}].awayScore`);
    if ((homeScore === null) !== (awayScore === null) || (status === "finished") !== (homeScore !== null)) {
      throw new FootballSnapshotError(`snapshot.matches[${index}] has an invalid score/status combination`);
    }
    const slug = stringValue(match.slug, `snapshot.matches[${index}].slug`, 160);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      throw new FootballSnapshotError(`snapshot.matches[${index}].slug must be URL-safe`);
    }
    return {
      id: stringValue(match.id, `snapshot.matches[${index}].id`, 120),
      slug,
      teamId,
      startsAt: dateValue(match.startsAt, `snapshot.matches[${index}].startsAt`),
      status,
      competitionType: enumValue(match.competitionType, competitionTypes, `snapshot.matches[${index}].competitionType`),
      competitionName: stringValue(match.competitionName, `snapshot.matches[${index}].competitionName`),
      teamSide: enumValue(match.teamSide, teamSides, `snapshot.matches[${index}].teamSide`),
      homeTeam: stringValue(match.homeTeam, `snapshot.matches[${index}].homeTeam`),
      awayTeam: stringValue(match.awayTeam, `snapshot.matches[${index}].awayTeam`),
      homeScore,
      awayScore,
      venue: stringValue(match.venue, `snapshot.matches[${index}].venue`),
    };
  });
  unique(matches.map((match) => match.id), "snapshot.matches");
  unique(matches.map((match) => match.slug), "snapshot.matches slugs");

  const standings = list(root.standings, "snapshot.standings").map((item, index): FootballStandingSnapshot => {
    const standing = record(item, `snapshot.standings[${index}]`);
    const teamId = stringValue(standing.teamId, `snapshot.standings[${index}].teamId`, 120);
    if (!teamIDs.has(teamId)) throw new FootballSnapshotError(`snapshot.standings[${index}] references an unknown team`);
    const played = integerValue(standing.played, `snapshot.standings[${index}].played`);
    const won = integerValue(standing.won, `snapshot.standings[${index}].won`);
    const drawn = integerValue(standing.drawn, `snapshot.standings[${index}].drawn`);
    const lost = integerValue(standing.lost, `snapshot.standings[${index}].lost`);
    if (won + drawn + lost !== played) {
      throw new FootballSnapshotError(`snapshot.standings[${index}] has inconsistent played/won/drawn/lost totals`);
    }
    return {
      id: stringValue(standing.id, `snapshot.standings[${index}].id`, 160),
      teamId,
      season: stringValue(standing.season, `snapshot.standings[${index}].season`, 32),
      split: enumValue(standing.split, standingSplits, `snapshot.standings[${index}].split`),
      position: integerValue(standing.position, `snapshot.standings[${index}].position`, 1),
      clubName: stringValue(standing.clubName, `snapshot.standings[${index}].clubName`),
      played,
      won,
      drawn,
      lost,
      goalsFor: integerValue(standing.goalsFor, `snapshot.standings[${index}].goalsFor`),
      goalsAgainst: integerValue(standing.goalsAgainst, `snapshot.standings[${index}].goalsAgainst`),
      points: integerValue(standing.points, `snapshot.standings[${index}].points`),
    };
  });
  unique(standings.map((row) => row.id), "snapshot.standings");

  return {
    provider: "sportlink",
    generatedAt: dateValue(root.generatedAt, "snapshot.generatedAt"),
    teams,
    matches,
    standings,
  };
};

export const footballSnapshotChecksum = (snapshot: FootballSnapshot) => createHash("sha256")
  .update(JSON.stringify({
    ...snapshot,
    teams: [...snapshot.teams].sort((left, right) => left.id.localeCompare(right.id)),
    matches: [...snapshot.matches].sort((left, right) => left.id.localeCompare(right.id)),
    standings: [...snapshot.standings].sort((left, right) => left.id.localeCompare(right.id)),
  }))
  .digest("hex");

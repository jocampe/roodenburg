import type { CollectionConfig } from "payload";
import { administrators, authenticated } from "../access";

const snapshotFields = [
  { name: "recordKey", type: "text", required: true, unique: true, index: true, admin: { readOnly: true } },
  { name: "snapshotId", type: "text", required: true, index: true, admin: { readOnly: true, position: "sidebar" } },
  { name: "sourceId", type: "text", required: true, index: true, admin: { readOnly: true } },
] as const;

const importedAccess = {
  create: administrators,
  delete: administrators,
  read: () => true,
  update: administrators,
};

export const FootballTeams: CollectionConfig = {
  slug: "football-teams",
  admin: {
    group: "Football data",
    useAsTitle: "name",
    defaultColumns: ["name", "routeSlug", "competition", "season", "snapshotId"],
    description: "Read-only public snapshot imported by the external football sync command.",
  },
  access: importedAccess,
  fields: [
    ...snapshotFields,
    { name: "routeSlug", type: "text", required: true, index: true },
    { name: "name", type: "text", required: true },
    { name: "category", type: "select", required: true, options: ["senioren", "jeugd", "pupillen", "zaal"] },
    { name: "footballType", type: "select", required: true, options: ["outdoor", "futsal"] },
    { name: "competition", type: "text", required: true },
    { name: "season", type: "text", required: true, index: true },
    { name: "active", type: "checkbox", required: true, defaultValue: true },
  ],
};

export const FootballMatches: CollectionConfig = {
  slug: "football-matches",
  admin: {
    group: "Football data",
    useAsTitle: "publicSlug",
    defaultColumns: ["startsAt", "homeTeam", "awayTeam", "status", "snapshotId"],
  },
  access: importedAccess,
  fields: [
    ...snapshotFields,
    { name: "teamSourceId", type: "text", required: true, index: true },
    { name: "publicSlug", type: "text", required: true, index: true },
    { name: "startsAt", type: "date", required: true, index: true },
    { name: "status", type: "select", required: true, options: ["scheduled", "finished", "postponed", "cancelled"] },
    { name: "competitionType", type: "select", required: true, options: ["league", "cup", "friendly", "other"] },
    { name: "competitionName", type: "text", required: true },
    { name: "teamSide", type: "select", required: true, options: ["home", "away"] },
    { name: "homeTeam", type: "text", required: true },
    { name: "awayTeam", type: "text", required: true },
    { name: "homeScore", type: "number", min: 0 },
    { name: "awayScore", type: "number", min: 0 },
    { name: "venue", type: "text", required: true },
  ],
};

export const FootballStandings: CollectionConfig = {
  slug: "football-standings",
  admin: {
    group: "Football data",
    useAsTitle: "clubName",
    defaultColumns: ["position", "clubName", "played", "points", "split", "snapshotId"],
  },
  access: importedAccess,
  fields: [
    ...snapshotFields,
    { name: "teamSourceId", type: "text", required: true, index: true },
    { name: "season", type: "text", required: true, index: true },
    { name: "split", type: "select", required: true, options: ["overall", "home", "away"], index: true },
    { name: "position", type: "number", required: true, min: 1 },
    { name: "clubName", type: "text", required: true },
    { name: "played", type: "number", required: true, min: 0 },
    { name: "won", type: "number", required: true, min: 0 },
    { name: "drawn", type: "number", required: true, min: 0 },
    { name: "lost", type: "number", required: true, min: 0 },
    { name: "goalsFor", type: "number", required: true, min: 0 },
    { name: "goalsAgainst", type: "number", required: true, min: 0 },
    { name: "points", type: "number", required: true, min: 0 },
  ],
};

export const FootballSyncRuns: CollectionConfig = {
  slug: "football-sync-runs",
  admin: {
    group: "Football data",
    useAsTitle: "snapshotId",
    defaultColumns: ["status", "startedAt", "completedAt", "teamCount", "matchCount", "standingCount"],
  },
  access: {
    create: administrators,
    delete: administrators,
    read: authenticated,
    update: administrators,
  },
  fields: [
    { name: "snapshotId", type: "text", required: true, unique: true, index: true },
    { name: "provider", type: "select", required: true, options: ["sportlink"] },
    { name: "status", type: "select", required: true, options: ["running", "succeeded", "failed"], index: true },
    { name: "sourceChecksum", type: "text", index: true },
    { name: "sourceGeneratedAt", type: "date" },
    { name: "startedAt", type: "date", required: true },
    { name: "completedAt", type: "date" },
    { name: "teamCount", type: "number", min: 0, defaultValue: 0 },
    { name: "matchCount", type: "number", min: 0, defaultValue: 0 },
    { name: "standingCount", type: "number", min: 0, defaultValue: 0 },
    { name: "errorMessage", type: "textarea" },
  ],
};

export const footballCollections: CollectionConfig[] = [
  FootballTeams,
  FootballMatches,
  FootballStandings,
  FootballSyncRuns,
];

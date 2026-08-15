import assert from "node:assert/strict";
import { FootballSnapshotError, footballSnapshotChecksum, validateFootballSnapshot } from "../football/types";

const snapshot = {
  provider: "sportlink",
  generatedAt: "2026-08-14T12:00:00.000Z",
  teams: [{
    id: "team-1",
    slug: "zaterdag-1",
    name: "Roodenburg 1",
    category: "senioren",
    footballType: "outdoor",
    competition: "Competition pending",
    season: "2026-2027",
    active: true,
  }],
  matches: [{
    id: "match-1",
    slug: "roodenburg-opponent-2026-08-29",
    teamId: "team-1",
    startsAt: "2026-08-29T12:30:00.000Z",
    status: "scheduled",
    competitionType: "league",
    competitionName: "League",
    teamSide: "home",
    homeTeam: "Roodenburg 1",
    awayTeam: "Opponent",
    homeScore: null,
    awayScore: null,
    venue: "Sportpark Noord",
  }],
  standings: [{
    id: "standing-team-1-opponent",
    teamId: "team-1",
    season: "2026-2027",
    split: "overall",
    position: 1,
    clubName: "Roodenburg 1",
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    points: 0,
  }],
};

const parsed = validateFootballSnapshot(snapshot);
assert.equal(parsed.teams[0].slug, "zaterdag-1");
assert.equal(parsed.matches[0].status, "scheduled");
assert.equal(parsed.standings[0].points, 0);
assert.equal(footballSnapshotChecksum(parsed), footballSnapshotChecksum(validateFootballSnapshot(structuredClone(snapshot))));

assert.throws(
  () => validateFootballSnapshot({ ...snapshot, matches: [{ ...snapshot.matches[0], teamId: "missing" }] }),
  FootballSnapshotError,
);
assert.throws(
  () => validateFootballSnapshot({ ...snapshot, matches: [{ ...snapshot.matches[0], status: "finished" }] }),
  FootballSnapshotError,
);

console.log("Verified normalized football snapshot validation and referential integrity.");

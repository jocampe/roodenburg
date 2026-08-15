import { randomUUID } from "node:crypto";
import config from "@payload-config";
import { getPayload, type Payload } from "payload";
import type { FootballSnapshotProvider } from "./sportlink-client";
import { footballSnapshotChecksum } from "./types";

type SyncSummary = {
  snapshotId: string;
  teams: number;
  matches: number;
  standings: number;
  reused: boolean;
};

const findByRecordKey = async (payload: Payload, collection: string, recordKey: string) => {
  const result = await payload.find({
    collection: collection as never,
    limit: 1,
    overrideAccess: true,
    where: { recordKey: { equals: recordKey } },
  });
  return result.docs[0] as { id: number | string } | undefined;
};

const upsert = async (
  payload: Payload,
  collection: string,
  recordKey: string,
  data: Record<string, unknown>,
) => {
  const existing = await findByRecordKey(payload, collection, recordKey);
  if (existing) {
    await payload.update({
      collection: collection as never,
      id: existing.id,
      data: { ...data, recordKey } as never,
      overrideAccess: true,
    });
  } else {
    await payload.create({
      collection: collection as never,
      data: { ...data, recordKey } as never,
      overrideAccess: true,
    });
  }
};

const upsertRun = async (
  payload: Payload,
  snapshotId: string,
  data: Record<string, unknown>,
) => {
  const result = await payload.find({
    collection: "football-sync-runs" as never,
    limit: 1,
    overrideAccess: true,
    where: { snapshotId: { equals: snapshotId } },
  });
  const existing = result.docs[0] as { id: number | string } | undefined;
  if (existing) {
    await payload.update({
      collection: "football-sync-runs" as never,
      id: existing.id,
      data: data as never,
      overrideAccess: true,
    });
  } else {
    await payload.create({
      collection: "football-sync-runs" as never,
      data: { snapshotId, ...data } as never,
      overrideAccess: true,
    });
  }
};

const cleanupSnapshots = async (payload: Payload, currentSnapshotId: string) => {
  const configuredRetention = Number(process.env.FOOTBALL_SNAPSHOT_RETENTION || 3);
  const retention = Number.isFinite(configuredRetention)
    ? Math.min(10, Math.max(2, Math.floor(configuredRetention)))
    : 3;
  const runs = await payload.find({
    collection: "football-sync-runs" as never,
    limit: 20,
    overrideAccess: true,
    sort: "-completedAt",
    where: { status: { equals: "succeeded" } },
  });
  const keep = Array.from(new Set([
    currentSnapshotId,
    ...runs.docs.map((run) => String((run as { snapshotId?: unknown }).snapshotId || "")),
  ].filter(Boolean))).slice(0, retention);

  for (const collection of ["football-teams", "football-matches", "football-standings"]) {
    await payload.delete({
      collection: collection as never,
      overrideAccess: true,
      where: { snapshotId: { not_in: keep } },
    });
  }
};

export const runFootballSync = async (provider: FootballSnapshotProvider): Promise<SyncSummary> => {
  const payload = await getPayload({ config });
  const startedAt = new Date().toISOString();
  let snapshotId = `failed-${Date.now()}-${randomUUID().slice(0, 8)}`;

  try {
    const snapshot = await provider.fetchSnapshot();
    const sourceChecksum = footballSnapshotChecksum(snapshot);
    snapshotId = sourceChecksum.slice(0, 24);
    const existingState = await payload.findGlobal({
      slug: "football-sync-state" as never,
      overrideAccess: true,
    }) as { currentSnapshotId?: string | null };
    const reused = existingState.currentSnapshotId === snapshotId;

    await upsertRun(payload, snapshotId, {
      provider: snapshot.provider,
      status: "running",
      sourceChecksum,
      sourceGeneratedAt: snapshot.generatedAt,
      startedAt,
      completedAt: null,
      errorMessage: null,
      teamCount: snapshot.teams.length,
      matchCount: snapshot.matches.length,
      standingCount: snapshot.standings.length,
    });

    for (const team of snapshot.teams) {
      const recordKey = `${snapshotId}:${team.id}`;
      await upsert(payload, "football-teams", recordKey, {
        snapshotId,
        sourceId: team.id,
        routeSlug: team.slug,
        name: team.name,
        category: team.category,
        footballType: team.footballType,
        competition: team.competition,
        season: team.season,
        active: team.active,
      });
    }

    for (const match of snapshot.matches) {
      const recordKey = `${snapshotId}:${match.id}`;
      await upsert(payload, "football-matches", recordKey, {
        snapshotId,
        sourceId: match.id,
        teamSourceId: match.teamId,
        publicSlug: match.slug,
        startsAt: match.startsAt,
        status: match.status,
        competitionType: match.competitionType,
        competitionName: match.competitionName,
        teamSide: match.teamSide,
        homeTeam: match.homeTeam,
        awayTeam: match.awayTeam,
        homeScore: match.homeScore,
        awayScore: match.awayScore,
        venue: match.venue,
      });
    }

    for (const standing of snapshot.standings) {
      const recordKey = `${snapshotId}:${standing.id}`;
      await upsert(payload, "football-standings", recordKey, {
        snapshotId,
        sourceId: standing.id,
        teamSourceId: standing.teamId,
        season: standing.season,
        split: standing.split,
        position: standing.position,
        clubName: standing.clubName,
        played: standing.played,
        won: standing.won,
        drawn: standing.drawn,
        lost: standing.lost,
        goalsFor: standing.goalsFor,
        goalsAgainst: standing.goalsAgainst,
        points: standing.points,
      });
    }

    const completedAt = new Date().toISOString();
    await upsertRun(payload, snapshotId, {
      provider: snapshot.provider,
      status: "succeeded",
      sourceChecksum,
      sourceGeneratedAt: snapshot.generatedAt,
      startedAt,
      completedAt,
      errorMessage: null,
      teamCount: snapshot.teams.length,
      matchCount: snapshot.matches.length,
      standingCount: snapshot.standings.length,
    });
    await payload.updateGlobal({
      slug: "football-sync-state" as never,
      overrideAccess: true,
      data: {
        currentSnapshotId: snapshotId,
        provider: snapshot.provider,
        lastSuccessfulAt: completedAt,
        sourceGeneratedAt: snapshot.generatedAt,
        teamCount: snapshot.teams.length,
        matchCount: snapshot.matches.length,
        standingCount: snapshot.standings.length,
      } as never,
    });
    try {
      await cleanupSnapshots(payload, snapshotId);
    } catch (cleanupError) {
      payload.logger.warn({ err: cleanupError }, "Football snapshot cleanup failed; the published snapshot remains active");
    }

    return {
      snapshotId,
      teams: snapshot.teams.length,
      matches: snapshot.matches.length,
      standings: snapshot.standings.length,
      reused,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message.slice(0, 1_000) : "Unknown football sync error";
    try {
      await upsertRun(payload, snapshotId, {
        provider: "sportlink",
        status: "failed",
        startedAt,
        completedAt: new Date().toISOString(),
        errorMessage: message,
        teamCount: 0,
        matchCount: 0,
        standingCount: 0,
      });
    } catch (recordError) {
      payload.logger.error({ err: recordError }, "Could not record football sync failure");
    }
    throw error;
  }
};

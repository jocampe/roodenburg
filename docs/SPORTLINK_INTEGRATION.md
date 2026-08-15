# Sportlink synchronization contract

## Boundary

The production application imports official football data through a provider-neutral snapshot boundary. `SPORTLINK_API_URL` must return the normalized JSON contract below. A small adapter or gateway can translate the club's licensed Sportlink response into this contract once the exact Sportlink product, endpoint documentation, club ID and team IDs are confirmed.

This boundary avoids embedding an assumed or undocumented Sportlink response shape in the website.

## Normalized snapshot

```json
{
  "provider": "sportlink",
  "generatedAt": "2026-08-14T12:00:00.000Z",
  "teams": [{
    "id": "provider-team-id",
    "slug": "zaterdag-1",
    "name": "Roodenburg 1",
    "category": "senioren",
    "footballType": "outdoor",
    "competition": "Official competition name",
    "season": "2026-2027",
    "active": true
  }],
  "matches": [{
    "id": "provider-match-id",
    "slug": "roodenburg-opponent-2026-08-29",
    "teamId": "provider-team-id",
    "startsAt": "2026-08-29T12:30:00.000Z",
    "status": "scheduled",
    "competitionType": "league",
    "competitionName": "Official competition name",
    "teamSide": "home",
    "homeTeam": "Roodenburg 1",
    "awayTeam": "Opponent",
    "homeScore": null,
    "awayScore": null,
    "venue": "Sportpark Noord"
  }],
  "standings": [{
    "id": "team-season-split-club",
    "teamId": "provider-team-id",
    "season": "2026-2027",
    "split": "overall",
    "position": 1,
    "clubName": "Roodenburg 1",
    "played": 0,
    "won": 0,
    "drawn": 0,
    "lost": 0,
    "goalsFor": 0,
    "goalsAgainst": 0,
    "points": 0
  }]
}
```

All IDs and public slugs must be stable. Dates are ISO 8601. A finished match must contain both scores; every other status must contain `null` scores. Standing totals must satisfy `won + drawn + lost = played`.

## Running the importer

Configure the endpoint and credentials, apply the Payload schema migration, then run:

```bash
npm run verify:football
npm run sync:football
```

For the containerized development stack, the dedicated job image can run the same command:

```bash
docker compose --profile jobs run --rm football-sync
```

Invoke `sync:football` from an external scheduler, container job, Kubernetes CronJob, GitHub Actions workflow with private networking, or a host cron. The application does not depend on a hosting-vendor scheduler.

## Publication safety

Each validated source payload receives a deterministic checksum-based snapshot ID. Teams, matches and standings are written under that immutable ID. Only after every record succeeds does the importer update `football-sync-state.currentSnapshotId`; public pages then switch to the new snapshot together.

If fetching, validation or persistence fails, the current pointer is unchanged and the last successful snapshot stays public. Replaying identical data reuses the same record keys. The importer keeps the latest configured number of successful snapshots for rollback and removes older data after publication.

## Editorial overlay

`team-overlays.sportlinkTeamId` links official records to the club-managed public slug, display name, description, media, staff and related news. Official fixtures, results and standings remain read-only in the CMS. Never seed unconfirmed provider IDs.

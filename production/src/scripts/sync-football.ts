import { SportlinkSnapshotClient } from "../football/sportlink-client";
import { runFootballSync } from "../football/sync";

try {
  const summary = await runFootballSync(new SportlinkSnapshotClient());
  console.log(JSON.stringify({ event: "football_sync_succeeded", ...summary }));
  process.exit(0);
} catch (error) {
  console.error(JSON.stringify({
    event: "football_sync_failed",
    message: error instanceof Error ? error.message : "Unknown football sync error",
  }));
  process.exit(1);
}

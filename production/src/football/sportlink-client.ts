import { validateFootballSnapshot, type FootballSnapshot } from "./types";

export interface FootballSnapshotProvider {
  fetchSnapshot(): Promise<FootballSnapshot>;
}

export class SportlinkSnapshotClient implements FootballSnapshotProvider {
  async fetchSnapshot() {
    const url = process.env.SPORTLINK_API_URL;
    const key = process.env.SPORTLINK_API_KEY;
    if (!url || !key) throw new Error("SPORTLINK_API_URL and SPORTLINK_API_KEY are required");

    const headerName = process.env.SPORTLINK_AUTH_HEADER || "Authorization";
    const scheme = process.env.SPORTLINK_AUTH_SCHEME ?? "Bearer";
    const configuredTimeout = Number(process.env.SPORTLINK_TIMEOUT_MS || 30_000);
    const timeoutMs = Number.isFinite(configuredTimeout)
      ? Math.min(120_000, Math.max(5_000, configuredTimeout))
      : 30_000;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
          [headerName]: scheme ? `${scheme} ${key}` : key,
        },
        signal: controller.signal,
      });
      if (!response.ok) throw new Error(`Sportlink snapshot request failed with status ${response.status}`);
      return validateFootballSnapshot(await response.json());
    } finally {
      clearTimeout(timeout);
    }
  }
}

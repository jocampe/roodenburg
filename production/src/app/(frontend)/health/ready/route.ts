import config from "@payload-config";
import { getPayload } from "payload";
import { operationalConfiguration } from "../../../../infrastructure/runtime-config";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const payload = await getPayload({ config });
    await payload.find({ collection: "users", limit: 1, depth: 0, overrideAccess: true });
    return Response.json({
      service: "lv-roodenburg",
      status: "ready",
      database: "connected",
      integrations: operationalConfiguration(),
    });
  } catch {
    return Response.json(
      { service: "lv-roodenburg", status: "not-ready", database: "unavailable" },
      { status: 503 },
    );
  }
}

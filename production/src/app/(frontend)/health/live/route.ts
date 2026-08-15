export const dynamic = "force-dynamic";

export function GET() {
  return Response.json({ service: "lv-roodenburg", status: "ok" });
}

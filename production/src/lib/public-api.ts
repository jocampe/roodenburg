import { createHash } from "node:crypto";
import { resolveSecurityConfiguration } from "../infrastructure/runtime-config";

type RateLimitEntry = { count: number; resetAt: number };

const rateLimits = new Map<string, RateLimitEntry>();

export class PublicAPIError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    public readonly retryAfter?: number,
  ) {
    super(code);
  }
}

export const assertSameOrigin = (request: Request) => {
  const origin = request.headers.get("origin");
  if (!origin) return;

  try {
    if (new URL(origin).host !== new URL(request.url).host) {
      throw new PublicAPIError(403, "invalid_origin");
    }
  } catch (error) {
    if (error instanceof PublicAPIError) throw error;
    throw new PublicAPIError(403, "invalid_origin");
  }
};

export const parseJSON = async (request: Request, maxBytes = 16_384) => {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > maxBytes) throw new PublicAPIError(413, "request_too_large");

  try {
    const body = await request.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      throw new PublicAPIError(400, "invalid_request");
    }
    return body as Record<string, unknown>;
  } catch (error) {
    if (error instanceof PublicAPIError) throw error;
    throw new PublicAPIError(400, "invalid_json");
  }
};

export const textField = (
  body: Record<string, unknown>,
  name: string,
  { max, min = 1 }: { max: number; min?: number },
) => {
  const value = typeof body[name] === "string" ? body[name].trim() : "";
  if (value.length < min || value.length > max) {
    throw new PublicAPIError(400, `invalid_${name}`);
  }
  return value;
};

export const emailField = (body: Record<string, unknown>, name = "email") => {
  const email = textField(body, name, { max: 254 }).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new PublicAPIError(400, `invalid_${name}`);
  }
  return email;
};

export const optionalTextField = (
  body: Record<string, unknown>,
  name: string,
  max: number,
) => {
  if (body[name] === undefined || body[name] === null || body[name] === "") return "";
  return textField(body, name, { max });
};

const clientKey = (request: Request, scope: string) => {
  const security = resolveSecurityConfiguration();
  const forwarded = security.trustProxyHeaders
    ? request.headers.get(security.proxyIPHeader)?.split(",")[0]?.trim() || "unknown"
    : "direct-client";
  const secret = process.env.PAYLOAD_SECRET || "local-development";
  return createHash("sha256").update(`${scope}:${secret}:${forwarded}`).digest("hex");
};

export const enforceRateLimit = (
  request: Request,
  scope: string,
  { limit, windowMs }: { limit: number; windowMs: number },
) => {
  const now = Date.now();
  const key = clientKey(request, scope);
  const current = rateLimits.get(key);

  if (!current || current.resetAt <= now) {
    rateLimits.set(key, { count: 1, resetAt: now + windowMs });
  } else {
    current.count += 1;
    if (current.count > limit) {
      throw new PublicAPIError(429, "rate_limited", Math.max(1, Math.ceil((current.resetAt - now) / 1_000)));
    }
  }

  if (rateLimits.size > 5_000) {
    for (const [entryKey, entry] of rateLimits) {
      if (entry.resetAt <= now) rateLimits.delete(entryKey);
    }
  }
};

export const errorResponse = (error: unknown) => {
  let response: Response;
  if (error instanceof PublicAPIError) {
    response = Response.json({ ok: false, code: error.code }, { status: error.status });
    if (error.retryAfter) response.headers.set("Retry-After", String(error.retryAfter));
  } else {
    response = Response.json({ ok: false, code: "server_error" }, { status: 500 });
  }
  response.headers.set("Cache-Control", "no-store");
  return response;
};

export const noStoreJSON = (body: unknown, init?: ResponseInit) => {
  const response = Response.json(body, init);
  response.headers.set("Cache-Control", "no-store");
  return response;
};

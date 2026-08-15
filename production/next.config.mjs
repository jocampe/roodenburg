import { withPayload } from "@payloadcms/next/withPayload";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { nextSecurityHeaders } from "./security-headers.mjs";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  poweredByHeader: false,
  headers: nextSecurityHeaders,
  turbopack: { root: projectRoot },
};

export default withPayload(nextConfig);

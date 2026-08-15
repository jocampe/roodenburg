import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1] || "roodenburg";
const pagesBasePath = isGitHubPages ? `/${repositoryName}` : "";

const nextConfig: NextConfig = {
  ...(isGitHubPages ? {
    output: "export",
    trailingSlash: true,
    basePath: pagesBasePath,
    assetPrefix: pagesBasePath,
    images: { unoptimized: true },
    // The repository also contains Cloudflare Worker/D1 entrypoints whose
    // platform globals are checked by the normal Vinext build, not Next export.
    typescript: { ignoreBuildErrors: true },
  } : {}),
};

export default nextConfig;

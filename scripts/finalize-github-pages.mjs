import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const outputDirectory = path.resolve(process.argv[2] || "out");
const repositoryName = (process.env.GITHUB_REPOSITORY || "jocampe/roodenburg").split("/")[1];
const basePath = `/${repositoryName}`;
const textExtensions = new Set([".css", ".html", ".js", ".json", ".txt", ".xml"]);
const publicAssets = [
  "favicon.svg",
  "gallery-club.webp",
  "gallery-match.webp",
  "gallery-youth.webp",
  "hero-roodenburg-concept.webp",
  "roodenburg-crest.png",
];

const files = [];
const visit = async (directory) => {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) await visit(entryPath);
    else files.push(entryPath);
  }
};
await visit(outputDirectory);

for (const file of files) {
  if (!textExtensions.has(path.extname(file))) continue;
  const source = await readFile(file, "utf8");
  let updated = source
    .replace(/(?<!\/roodenburg)\/(nl|en)(?=\/|[?#"'`\\])/g, `${basePath}/$1`);
  for (const asset of publicAssets) {
    updated = updated.replace(new RegExp(`(?<!${basePath})/${asset.replaceAll(".", "\\.")}`, "g"), `${basePath}/${asset}`);
  }
  if (updated !== source) await writeFile(file, updated);
}

await writeFile(path.join(outputDirectory, ".nojekyll"), "");
console.log(`Prepared static GitHub Pages output for ${basePath}.`);

import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";

const outputDirectory = path.resolve(process.argv[2] || "out");
const expected = [
  ".nojekyll",
  "index.html",
  "nl/index.html",
  "en/index.html",
  "nl/news/index.html",
  "en/teams/index.html",
  "nl/teams/zaterdag-1/index.html",
  "nl/teams/zaterdag-1/matches/roodenburg-voorschoten-29-aug/index.html",
];
await Promise.all(expected.map((file) => access(path.join(outputDirectory, file))));

const home = await readFile(path.join(outputDirectory, "nl/index.html"), "utf8");
assert.match(home, /\/roodenburg\/nl\/teams\/zaterdag-1\/matches\/roodenburg-voorschoten-29-aug/);
assert.match(home, /\/roodenburg\/_next\/static\//);
assert.doesNotMatch(home, /href="\/nl(?:\/|\?|#|\")/);
assert.doesNotMatch(home, /src="\/(?:gallery-|hero-|roodenburg-crest)/);

const cssDirectory = path.join(outputDirectory, "_next/static/chunks");
const styles = (await readdir(cssDirectory)).filter((file) => file.endsWith(".css"));
const compiledCSS = (await Promise.all(styles.map((file) => readFile(path.join(cssDirectory, file), "utf8")))).join("\n");
assert.match(compiledCSS, /\/roodenburg\/hero-roodenburg-concept\.webp/);

console.log("Validated GitHub Pages routes, assets and direct featured-match link.");

import { cp, mkdir, rm } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const output = resolve(root, "dist");
const siteAssets = [
  "index.html",
  "about.html",
  "assets",
  "data",
  "robots.txt",
  "sitemap.xml",
];

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

for (const asset of siteAssets) {
  await cp(resolve(root, asset), resolve(output, asset), { recursive: true });
}

console.log(`Built ${siteAssets.length} site entries in dist/.`);

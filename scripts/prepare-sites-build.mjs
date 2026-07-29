import { cp, mkdir, rm } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const output = resolve(root, "public");
const publicAssets = [
  "index.html",
  "about.html",
  "app.js",
  "about.js",
  "catalogue.js",
  "styles.css",
  "favicon.svg",
  "data",
];

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

for (const asset of publicAssets) {
  await cp(resolve(root, asset), resolve(output, asset), { recursive: true });
}

console.log(`Prepared ${publicAssets.length} public assets.`);

import { readFile } from "node:fs/promises";
import { validateCatalogueData } from "./catalogue-validation.mjs";

const storiesPath = new URL("../data/stories.json", import.meta.url);
const sitePath = new URL("../data/site.json", import.meta.url);

async function validateLinks(stories) {
  const urls = [
    ...new Set(
      stories.flatMap((story) => [
        story.reading?.url,
        ...story.awards.map((entry) => entry.sourceUrl),
      ]).filter(Boolean),
    ),
  ];
  const failures = [];

  console.log(`Checking ${urls.length} unique links...`);

  for (const url of urls) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    try {
      let response = await fetch(url, {
        method: "HEAD",
        redirect: "follow",
        signal: controller.signal,
        headers: { "user-agent": "SciFiShortStories-LinkCheck/1.0" },
      });

      if (response.status === 405 || response.status === 403) {
        response = await fetch(url, {
          method: "GET",
          redirect: "follow",
          signal: controller.signal,
          headers: {
            "user-agent": "SciFiShortStories-LinkCheck/1.0",
            range: "bytes=0-1024",
          },
        });
      }

      const status = response.status;
      const acceptable = status >= 200 && status < 400;
      console.log(`${acceptable ? "OK" : "FAIL"} ${status} ${url}`);
      if (!acceptable) failures.push(`${status} ${url}`);
    } catch (error) {
      console.log(`REVIEW ${error.name} ${url}`);
      failures.push(`${error.name} ${url}`);
    } finally {
      clearTimeout(timeout);
    }
  }

  return failures;
}

const stories = JSON.parse(await readFile(storiesPath, "utf8"));
const siteConfig = JSON.parse(await readFile(sitePath, "utf8"));
const { errors, warnings, stats } = validateCatalogueData(stories, siteConfig);

if (errors.length) {
  console.error("Data validation failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

if (warnings.length) {
  console.warn("Data validation warnings:");
  warnings.forEach((warning) => console.warn(`- ${warning}`));
}

console.log(
  `Data valid: ${stats.entries} unique entries, ${stats.awards} award records, ${stats.noAwards} no-award results, ${stats.notPresented} not-presented result.`,
);

if (process.argv.includes("--links")) {
  const linkFailures = await validateLinks(stories);
  if (linkFailures.length) {
    console.error(
      `\n${linkFailures.length} link(s) need manual review. Automated checks can be blocked by remote sites.`,
    );
    process.exit(2);
  }
}

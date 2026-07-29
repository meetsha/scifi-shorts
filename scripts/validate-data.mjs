import { readFile } from "node:fs/promises";

const storiesPath = new URL("../data/stories.json", import.meta.url);
const sitePath = new URL("../data/site.json", import.meta.url);
const expectedHugoYears = Array.from({ length: 25 }, (_, index) => 2025 - index);
const validAwards = new Set(["hugo", "nebula"]);
const errors = [];

function isHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function validateAward(entry, storyLabel, awardIndex) {
  const label = `${storyLabel}, award ${awardIndex + 1}`;

  if (!validAwards.has(entry.award)) {
    errors.push(`${label}: award must be "hugo" or "nebula"`);
  }
  if (!Number.isInteger(entry.year)) {
    errors.push(`${label}: year must be an integer`);
  }
  if (!isHttpUrl(entry.sourceUrl)) {
    errors.push(`${label}: sourceUrl must be an HTTP(S) URL`);
  }
}

function validateStory(story, index) {
  const label = `Story ${index + 1}`;
  const requiredStrings = ["id", "resultType", "title"];

  for (const field of requiredStrings) {
    if (typeof story[field] !== "string" || !story[field].trim()) {
      errors.push(`${label}: ${field} must be a non-empty string`);
    }
  }

  if (
    typeof story.id === "string" &&
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(story.id)
  ) {
    errors.push(`${label}: id must be a lowercase ASCII slug`);
  }

  if (!["winner", "no-award"].includes(story.resultType)) {
    errors.push(`${label}: resultType must be "winner" or "no-award"`);
  }

  if (story.resultType === "winner") {
    for (const field of ["author", "publication"]) {
      if (typeof story[field] !== "string" || !story[field].trim()) {
        errors.push(`${label}: ${field} is required for a winner`);
      }
    }
  } else {
    for (const field of ["author", "publication", "storyUrl"]) {
      if (story[field] !== null) {
        errors.push(`${label}: ${field} must be null for a no-award result`);
      }
    }
  }

  if (story.storyUrl !== null && !isHttpUrl(story.storyUrl)) {
    errors.push(`${label}: storyUrl must be null or an HTTP(S) URL`);
  }

  if (!Array.isArray(story.awards) || !story.awards.length) {
    errors.push(`${label}: awards must be a non-empty array`);
    return;
  }

  story.awards.forEach((entry, awardIndex) =>
    validateAward(entry, label, awardIndex),
  );

  const awardNames = story.awards.map((entry) => entry.award);
  const duplicateAwards = awardNames.filter(
    (award, awardIndex) => awardNames.indexOf(award) !== awardIndex,
  );
  if (duplicateAwards.length) {
    errors.push(
      `${label}: duplicate awards: ${[...new Set(duplicateAwards)].join(", ")}`,
    );
  }
}

async function validateLinks(stories) {
  const urls = [
    ...new Set(
      stories.flatMap((story) => [
        story.storyUrl,
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
        headers: { "user-agent": "SciFiShortStoryCollection-LinkCheck/1.0" },
      });

      if (response.status === 405 || response.status === 403) {
        response = await fetch(url, {
          method: "GET",
          redirect: "follow",
          signal: controller.signal,
          headers: {
            "user-agent": "SciFiShortStoryCollection-LinkCheck/1.0",
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

if (!Array.isArray(stories)) {
  errors.push("stories.json must contain an array");
} else {
  stories.forEach(validateStory);

  const ids = stories.map((story) => story.id);
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicateIds.length) {
    errors.push(`Duplicate story IDs: ${[...new Set(duplicateIds)].join(", ")}`);
  }

  const awardRecords = stories.flatMap((story) =>
    story.awards.map((entry) => ({ ...entry, storyId: story.id })),
  );
  const awardKeys = awardRecords.map((entry) => `${entry.award}:${entry.year}`);
  const duplicateAwardYears = awardKeys.filter(
    (key, index) => awardKeys.indexOf(key) !== index,
  );
  if (duplicateAwardYears.length) {
    errors.push(
      `Duplicate award-year results: ${[...new Set(duplicateAwardYears)].join(", ")}`,
    );
  }

  const hugoYears = awardRecords
    .filter((entry) => entry.award === "hugo")
    .map((entry) => entry.year);
  const missingHugoYears = expectedHugoYears.filter(
    (year) => !hugoYears.includes(year),
  );
  if (missingHugoYears.length) {
    errors.push(`Missing Hugo award years: ${missingHugoYears.join(", ")}`);
  }
}

if (
  siteConfig.correctionsEmail !== null &&
  (typeof siteConfig.correctionsEmail !== "string" ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(siteConfig.correctionsEmail))
) {
  errors.push("correctionsEmail must be null or a valid email address");
}

if (errors.length) {
  console.error("Data validation failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

const awardCount = stories.reduce((total, story) => total + story.awards.length, 0);
console.log(
  `Data valid: ${stories.length} unique entries, ${awardCount} award records, ${
    stories.filter((story) => story.resultType === "no-award").length
  } no-award result.`,
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

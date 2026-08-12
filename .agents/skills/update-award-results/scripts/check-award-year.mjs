#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const VALID_AWARDS = new Set(["hugo", "nebula"]);

function normalizeIdentity(value) {
  return String(value || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function storyIdentity(story) {
  if (story?.resultType === "winner") {
    return `${normalizeIdentity(story.title)}::${normalizeIdentity(story.author)}`;
  }
  return `${story?.resultType || "unknown"}::${normalizeIdentity(story?.title)}`;
}

function hasAwardYear(story, award, year) {
  return Array.isArray(story?.awards) && story.awards.some(
    (entry) => entry?.award === award && entry?.year === year,
  );
}

function summarize(story) {
  return {
    id: story.id,
    resultType: story.resultType,
    title: story.title,
    author: story.author ?? null,
  };
}

export function inspectAwardYear(stories, { award, year }) {
  if (!VALID_AWARDS.has(award)) {
    throw new Error('award must be "hugo" or "nebula"');
  }
  if (!Number.isInteger(year)) {
    throw new Error("year must be an integer");
  }
  if (!Array.isArray(stories)) {
    throw new Error("catalogue must be a JSON array");
  }

  const records = stories.filter((story) => hasAwardYear(story, award, year));
  return {
    status: records.length ? "FOUND" : "MISSING",
    award,
    year,
    records: records.map(summarize),
  };
}

export function compareAwardYear(stories, expectedStories, { award, year }) {
  const actual = stories.filter((story) => hasAwardYear(story, award, year));
  const expected = expectedStories.filter((story) =>
    hasAwardYear(story, award, year),
  );

  const actualByIdentity = new Map(
    actual.map((story) => [storyIdentity(story), story]),
  );
  const expectedByIdentity = new Map(
    expected.map((story) => [storyIdentity(story), story]),
  );
  const missing = [...expectedByIdentity]
    .filter(([identity]) => !actualByIdentity.has(identity))
    .map(([, story]) => story);
  const unexpected = [...actualByIdentity]
    .filter(([identity]) => !expectedByIdentity.has(identity))
    .map(([, story]) => story);
  const mismatches = [...expectedByIdentity]
    .filter(([identity]) => actualByIdentity.has(identity))
    .flatMap(([identity, expectedStory]) => {
      const actualStory = actualByIdentity.get(identity);
      const fields = ["resultType", "title", "author", "publication"];
      const fieldMismatches = fields
        .filter((field) => actualStory[field] !== expectedStory[field])
        .map((field) => ({
          field,
          actual: actualStory[field] ?? null,
          expected: expectedStory[field] ?? null,
        }));
      const actualSourceUrl = actualStory.awards.find(
        (entry) => entry?.award === award && entry?.year === year,
      )?.sourceUrl;
      const expectedSourceUrl = expectedStory.awards.find(
        (entry) => entry?.award === award && entry?.year === year,
      )?.sourceUrl;
      if (actualSourceUrl !== expectedSourceUrl) {
        fieldMismatches.push({
          field: "awards.sourceUrl",
          actual: actualSourceUrl ?? null,
          expected: expectedSourceUrl ?? null,
        });
      }
      return fieldMismatches.length
        ? [{ id: actualStory.id, fields: fieldMismatches }]
        : [];
    });

  if (unexpected.length || mismatches.length) {
    return {
      status: "NEEDS_REVIEW",
      award,
      year,
      missing: missing.map(summarize),
      unexpected: unexpected.map(summarize),
      mismatches,
      plans: [],
    };
  }

  const plans = missing.map((candidate) => {
    const existingStory = stories.find(
      (story) =>
        story?.resultType === "winner" &&
        candidate?.resultType === "winner" &&
        storyIdentity(story) === storyIdentity(candidate),
    );
    const awardEntry = candidate.awards.find(
      (entry) => entry?.award === award && entry?.year === year,
    );
    return existingStory
      ? {
          action: "MERGE_AWARD",
          storyId: existingStory.id,
          award: awardEntry,
        }
      : { action: "ADD_RECORD", record: candidate };
  });

  return {
    status: missing.length ? "UPDATE_NEEDED" : "UP_TO_DATE",
    award,
    year,
    missing: missing.map(summarize),
    unexpected: [],
    mismatches: [],
    plans,
  };
}

function parseArgs(argv) {
  const options = { repo: process.cwd(), excludeIds: [] };
  for (let index = 0; index < argv.length; index += 1) {
    const name = argv[index];
    const value = argv[index + 1];
    if (["--repo", "--catalogue", "--award", "--year", "--expected", "--exclude-id"].includes(name) && value === undefined) {
      throw new Error(`${name} requires a value`);
    }
    switch (name) {
      case "--repo":
        options.repo = value;
        index += 1;
        break;
      case "--catalogue":
        options.catalogue = value;
        index += 1;
        break;
      case "--award":
        options.award = value;
        index += 1;
        break;
      case "--year":
        options.year = Number(value);
        index += 1;
        break;
      case "--expected":
        options.expected = value;
        index += 1;
        break;
      case "--exclude-id":
        options.excludeIds.push(value);
        index += 1;
        break;
      default:
        throw new Error(`unknown argument: ${name}`);
    }
  }
  return options;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function resolveFromRepo(repo, value, fallback) {
  return path.resolve(repo, value || fallback);
}

function runCli() {
  const options = parseArgs(process.argv.slice(2));
  if (!options.award || !Number.isInteger(options.year)) {
    throw new Error("usage: --award <hugo|nebula> --year <integer>");
  }

  const repo = path.resolve(options.repo);
  const cataloguePath = resolveFromRepo(
    repo,
    options.catalogue,
    "data/stories.json",
  );
  const excluded = new Set(options.excludeIds);
  const stories = readJson(cataloguePath).filter(
    (story) => !excluded.has(story?.id),
  );
  const result = options.expected
    ? compareAwardYear(
        stories,
        readJson(resolveFromRepo(repo, options.expected)),
        options,
      )
    : inspectAwardYear(stories, options);

  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

const isDirectRun =
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));

if (isDirectRun) {
  try {
    runCli();
  } catch (error) {
    process.stderr.write(`check-award-year: ${error.message}\n`);
    process.exitCode = 2;
  }
}

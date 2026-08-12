import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { compareAwardYear, inspectAwardYear } from "./check-award-year.mjs";

const skillDirectory = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const repositoryRoot = path.resolve(skillDirectory, "../../..");
const stories = JSON.parse(
  fs.readFileSync(path.join(repositoryRoot, "data/stories.json"), "utf8"),
);
const target = { award: "nebula", year: 2025 };
const winnerId = "laser-eyes-aint-everything-effie-seiberg";

test("the real catalogue contains the official 2025 Nebula assignment", () => {
  const result = inspectAwardYear(stories, target);
  assert.equal(result.status, "FOUND");
  assert.deepEqual(result.records.map((record) => record.id), [winnerId]);
});

test("a missing-record fixture produces one deterministic add plan", () => {
  const fixture = stories.filter((story) => story.id !== winnerId);
  const result = compareAwardYear(fixture, stories, target);

  assert.equal(result.status, "UPDATE_NEEDED");
  assert.deepEqual(result.missing.map((record) => record.id), [winnerId]);
  assert.equal(result.plans.length, 1);
  assert.equal(result.plans[0].action, "ADD_RECORD");
  assert.equal(result.plans[0].record.id, winnerId);
});

test("the real catalogue is idempotently up to date", () => {
  const result = compareAwardYear(stories, stories, target);
  assert.equal(result.status, "UP_TO_DATE");
  assert.deepEqual(result.plans, []);
});

test("a conflicting official source URL requires review", () => {
  const expected = structuredClone(stories);
  const winner = expected.find((story) => story.id === winnerId);
  winner.awards[0].sourceUrl = "https://example.com/conflicting-result";

  const result = compareAwardYear(stories, expected, target);
  assert.equal(result.status, "NEEDS_REVIEW");
  assert.deepEqual(result.mismatches, [
    {
      id: winnerId,
      fields: [
        {
          field: "awards.sourceUrl",
          actual: "https://nebulas.sfwa.org/award-year/2025/",
          expected: "https://example.com/conflicting-result",
        },
      ],
    },
  ]);
});

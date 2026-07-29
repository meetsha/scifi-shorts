import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import {
  buildCatalogueSearch,
  filterAndSortStories,
  getCatalogueYears,
  paginateStories,
  parseCatalogueState,
} from "../catalogue.js";
import { validateCatalogueData } from "../scripts/catalogue-validation.mjs";

const stories = JSON.parse(
  await readFile(new URL("../data/stories.json", import.meta.url), "utf8"),
);

const dualWinner = {
  id: "shared-winner-example-author",
  resultType: "winner",
  title: "Shared Winner",
  author: "Example Author",
  publication: "Example Magazine",
  storyUrl: null,
  awards: [
    { award: "hugo", year: 2024, sourceUrl: "https://example.com/hugo" },
    { award: "nebula", year: 2023, sourceUrl: "https://example.com/nebula" },
  ],
};

const tiedNebulaWinner = {
  id: "tied-winner-another-author",
  resultType: "winner",
  title: "Tied Winner",
  author: "Another Author",
  publication: "Another Magazine",
  storyUrl: null,
  awards: [
    { award: "nebula", year: 2023, sourceUrl: "https://example.com/nebula" },
  ],
};

const testSiteConfig = { correctionsEmail: null };

test("catalogue covers every Hugo award year from 2001 through 2025", () => {
  assert.deepEqual(
    getCatalogueYears(stories, "hugo"),
    Array.from({ length: 25 }, (_, index) => 2025 - index),
  );
});

test("defaults to newest-first order", () => {
  const results = filterAndSortStories(stories);
  assert.equal(results[0].awards[0].year, 2025);
  assert.equal(results.at(-1).awards[0].year, 2001);
});

test("sorts oldest first", () => {
  const results = filterAndSortStories(stories, { sort: "oldest" });
  assert.equal(results[0].awards[0].year, 2001);
  assert.equal(results.at(-1).awards[0].year, 2025);
});

test("searches title, author, publication, award, and year", () => {
  assert.equal(filterAndSortStories(stories, { query: "Rabbit Test" }).length, 1);
  assert.equal(filterAndSortStories(stories, { query: "Ted Chiang" }).length, 1);
  assert.ok(
    filterAndSortStories(stories, { query: "Uncanny Magazine" }).length > 1,
  );
  assert.equal(filterAndSortStories(stories, { query: "2004" }).length, 1);
  assert.equal(filterAndSortStories(stories, { query: "hugo" }).length, 25);
});

test("combines award and exact-year filtering", () => {
  const fixture = [...stories, dualWinner];
  assert.equal(
    filterAndSortStories(fixture, { award: "nebula", year: "2023" }).length,
    1,
  );
  assert.equal(
    filterAndSortStories(fixture, { award: "nebula", year: "2024" }).length,
    0,
  );
  assert.equal(
    filterAndSortStories(fixture, { award: "hugo", year: "2024" }).length,
    2,
  );
});

test("keeps a shared winner as one story in either award filter", () => {
  assert.deepEqual(filterAndSortStories([dualWinner], { award: "hugo" }), [
    dualWinner,
  ]);
  assert.deepEqual(filterAndSortStories([dualWinner], { award: "nebula" }), [
    dualWinner,
  ]);
});

test("allows legitimate ties as separate stories in the same award year", () => {
  const fixture = [dualWinner, tiedNebulaWinner];
  const validation = validateCatalogueData(fixture, testSiteConfig, {
    expectedAwardYears: {},
  });
  const results = filterAndSortStories(fixture, {
    award: "nebula",
    year: 2023,
  });

  assert.deepEqual(validation.errors, []);
  assert.deepEqual(
    results.map((story) => story.id).sort(),
    [dualWinner.id, tiedNebulaWinner.id].sort(),
  );
});

test("rejects a duplicate award-year assignment within one story", () => {
  const fixture = [
    {
      ...dualWinner,
      awards: [...dualWinner.awards, { ...dualWinner.awards[0] }],
    },
  ];
  const validation = validateCatalogueData(fixture, testSiteConfig, {
    expectedAwardYears: {},
  });

  assert.ok(
    validation.errors.some((error) =>
      error.includes("duplicate award-year assignments: hugo:2024"),
    ),
  );
});

test("reports probable duplicate stories after normalizing title and author", () => {
  const fixture = [
    {
      ...dualWinner,
      id: "cafe-at-the-end-n-k-jemisin",
      title: "Café, at the End!",
      author: "N. K. Jemisin",
    },
    {
      ...tiedNebulaWinner,
      id: "cafe-at-end-nk-jemisin",
      title: "Cafe at the End",
      author: "N K Jemisin",
    },
  ];
  const validation = validateCatalogueData(fixture, testSiteConfig, {
    expectedAwardYears: {},
  });

  assert.equal(validation.warnings.length, 1);
  assert.match(validation.warnings[0], /Probable duplicate story records/);
});

test("searches all award metadata visible on a shared story card", () => {
  assert.deepEqual(
    filterAndSortStories([dualWinner], {
      award: "hugo",
      query: "nebula",
    }),
    [dualWinner],
  );
  assert.deepEqual(
    filterAndSortStories([dualWinner], {
      award: "hugo",
      query: "2023",
    }),
    [dualWinner],
  );
});

test("sorts shared winners by the selected award year", () => {
  const hugoOnly = {
    ...tiedNebulaWinner,
    id: "hugo-only",
    awards: [
      { award: "hugo", year: 2023, sourceUrl: "https://example.com/hugo-only" },
    ],
  };

  assert.deepEqual(
    filterAndSortStories([dualWinner, hugoOnly], { award: "hugo" }).map(
      (story) => story.id,
    ),
    [dualWinner.id, hugoOnly.id],
  );
});

test("paginates filtered stories in groups of 12", () => {
  const firstPage = paginateStories(stories, 1);
  const finalPage = paginateStories(stories, 3);

  assert.equal(firstPage.items.length, 12);
  assert.deepEqual(
    [firstPage.rangeStart, firstPage.rangeEnd, firstPage.totalPages],
    [1, 12, 3],
  );
  assert.equal(finalPage.items.length, 1);
  assert.deepEqual([finalPage.rangeStart, finalPage.rangeEnd], [25, 25]);
});

test("clamps invalid page requests", () => {
  assert.equal(paginateStories(stories, 0).page, 1);
  assert.equal(paginateStories(stories, 99).page, 3);
});

test("round-trips non-default catalogue URL state", () => {
  const state = {
    query: "Ted Chiang",
    award: "hugo",
    year: 2009,
    sort: "oldest",
    page: 2,
  };
  const search = buildCatalogueSearch(state);

  assert.deepEqual(parseCatalogueState(search), state);
});

test("omits default catalogue state from the URL", () => {
  assert.equal(
    buildCatalogueSearch({
      query: "",
      award: "all",
      year: null,
      sort: "newest",
      page: 1,
    }),
    "",
  );
});

test("includes unavailable stories and the no-award result", () => {
  assert.ok(
    stories.some(
      (story) => story.resultType === "winner" && story.storyUrl === null,
    ),
  );
  assert.deepEqual(
    stories
      .filter((story) => story.resultType === "no-award")
      .flatMap((story) => story.awards.map((entry) => entry.year)),
    [2015],
  );
});

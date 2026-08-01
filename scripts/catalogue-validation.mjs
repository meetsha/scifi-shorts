export const AWARD_COVERAGE = Object.freeze({
  hugo: Object.freeze({ firstYear: 1955, lastYear: 2025 }),
  nebula: Object.freeze({ firstYear: 1965, lastYear: 2025 }),
});

export const EXPECTED_AWARD_YEARS = Object.freeze(
  Object.fromEntries(
    Object.entries(AWARD_COVERAGE).map(([award, { firstYear, lastYear }]) => [
      award,
      Array.from(
        { length: lastYear - firstYear + 1 },
        (_, index) => lastYear - index,
      ),
    ]),
  ),
);

const VALID_AWARDS = new Set(["hugo", "nebula"]);

function isHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function normaliseIdentity(value) {
  return String(value || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function validateAward(entry, storyLabel, awardIndex, errors) {
  const label = `${storyLabel}, award ${awardIndex + 1}`;

  if (!entry || typeof entry !== "object") {
    errors.push(`${label}: must be an object`);
    return;
  }
  if (!VALID_AWARDS.has(entry.award)) {
    errors.push(`${label}: award must be "hugo" or "nebula"`);
  }
  if (!Number.isInteger(entry.year)) {
    errors.push(`${label}: year must be an integer`);
  }
  if (!isHttpUrl(entry.sourceUrl)) {
    errors.push(`${label}: sourceUrl must be an HTTP(S) URL`);
  }
}

function validateStory(story, index, errors) {
  const label = `Story ${index + 1}`;
  const requiredStrings = ["id", "resultType", "title"];

  if (!story || typeof story !== "object") {
    errors.push(`${label}: must be an object`);
    return;
  }

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

  if (!["winner", "no-award", "not-presented"].includes(story.resultType)) {
    errors.push(
      `${label}: resultType must be "winner", "no-award", or "not-presented"`,
    );
  }

  if (story.resultType === "winner") {
    for (const field of ["author", "publication"]) {
      if (typeof story[field] !== "string" || !story[field].trim()) {
        errors.push(`${label}: ${field} is required for a winner`);
      }
    }
  } else if (["no-award", "not-presented"].includes(story.resultType)) {
    for (const field of ["author", "publication", "storyUrl"]) {
      if (story[field] !== null) {
        errors.push(`${label}: ${field} must be null for a special result`);
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
    validateAward(entry, label, awardIndex, errors),
  );

  const assignments = story.awards
    .filter((entry) => entry && typeof entry === "object")
    .map((entry) => `${entry.award}:${entry.year}`);
  const duplicates = assignments.filter(
    (assignment, awardIndex) =>
      assignments.indexOf(assignment) !== awardIndex,
  );
  if (duplicates.length) {
    errors.push(
      `${label}: duplicate award-year assignments: ${[
        ...new Set(duplicates),
      ].join(", ")}`,
    );
  }
}

export function validateCatalogueData(
  stories,
  siteConfig,
  { expectedAwardYears = EXPECTED_AWARD_YEARS } = {},
) {
  const errors = [];
  const warnings = [];

  if (!Array.isArray(stories)) {
    errors.push("stories.json must contain an array");
  } else {
    stories.forEach((story, index) => validateStory(story, index, errors));

    const ids = stories
      .filter((story) => story && typeof story === "object")
      .map((story) => story.id);
    const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
    if (duplicateIds.length) {
      errors.push(
        `Duplicate story IDs: ${[...new Set(duplicateIds)].join(", ")}`,
      );
    }

    const awardRecords = stories.flatMap((story) =>
      Array.isArray(story?.awards)
        ? story.awards
            .filter((entry) => entry && typeof entry === "object")
            .map((entry) => ({ ...entry, storyId: story.id }))
        : [],
    );

    for (const [award, expectedYears] of Object.entries(expectedAwardYears)) {
      const actualYears = awardRecords
        .filter((entry) => entry.award === award)
        .map((entry) => entry.year);
      const missingYears = expectedYears.filter(
        (year) => !actualYears.includes(year),
      );
      if (missingYears.length) {
        const awardName = award[0].toUpperCase() + award.slice(1);
        errors.push(`Missing ${awardName} award years: ${missingYears.join(", ")}`);
      }
    }

    const probableDuplicates = new Map();
    for (const story of stories.filter(
      (entry) =>
        entry?.resultType === "winner" &&
        typeof entry.title === "string" &&
        typeof entry.author === "string",
    )) {
      const identity = `${normaliseIdentity(story.title)}::${normaliseIdentity(
        story.author,
      )}`;
      const matches = probableDuplicates.get(identity) || [];
      matches.push(story.id);
      probableDuplicates.set(identity, matches);
    }

    for (const storyIds of probableDuplicates.values()) {
      if (storyIds.length > 1) {
        warnings.push(
          `Probable duplicate story records need review: ${storyIds.join(", ")}`,
        );
      }
    }
  }

  if (
    !siteConfig ||
    typeof siteConfig !== "object" ||
    !Object.hasOwn(siteConfig, "correctionsUrl")
  ) {
    errors.push("site.json must define correctionsUrl");
  } else if (
    siteConfig.correctionsUrl !== null &&
    (typeof siteConfig.correctionsUrl !== "string" ||
      !isHttpUrl(siteConfig.correctionsUrl))
  ) {
    errors.push("correctionsUrl must be null or a valid HTTP(S) URL");
  }

  const validStories = Array.isArray(stories) ? stories : [];
  return {
    errors,
    warnings,
    stats: {
      entries: validStories.length,
      awards: validStories.reduce(
        (total, story) =>
          total + (Array.isArray(story?.awards) ? story.awards.length : 0),
        0,
      ),
      noAwards: validStories.filter(
        (story) => story?.resultType === "no-award",
      ).length,
      notPresented: validStories.filter(
        (story) => story?.resultType === "not-presented",
      ).length,
    },
  };
}

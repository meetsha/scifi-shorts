export const PAGE_SIZE = 10;

const VALID_AWARDS = new Set(["all", "hugo", "nebula"]);

function normaliseAward(award) {
  return VALID_AWARDS.has(award) ? award : "all";
}

function matchingAwards(story, award) {
  const selectedAward = normaliseAward(award);
  return selectedAward === "all"
    ? story.awards
    : story.awards.filter((entry) => entry.award === selectedAward);
}

function getSortYear(story, award, sort) {
  const years = matchingAwards(story, award).map((entry) => entry.year);
  return sort === "oldest" ? Math.min(...years) : Math.max(...years);
}

export function getCatalogueYears(stories, award = "all") {
  return [
    ...new Set(
      stories.flatMap((story) =>
        matchingAwards(story, award).map((entry) => entry.year),
      ),
    ),
  ].sort((a, b) => b - a);
}

export function filterAndSortStories(stories, filters = {}) {
  const query = String(filters.query || "").trim().toLowerCase();
  const year = filters.year ? Number(filters.year) : null;
  const award = normaliseAward(filters.award);
  const sort = filters.sort === "oldest" ? "oldest" : "newest";

  return stories
    .filter((story) => {
      const relevantAwards = matchingAwards(story, award);
      if (!relevantAwards.length) return false;
      if (year && !relevantAwards.some((entry) => entry.year === year)) return false;
      if (!query) return true;

      const searchableText = [
        story.title,
        story.author,
        story.publication,
        ...story.awards.flatMap((entry) => [entry.award, String(entry.year)]),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    })
    .sort((a, b) => {
      const yearDifference =
        getSortYear(a, award, sort) - getSortYear(b, award, sort);
      if (yearDifference) {
        return sort === "oldest" ? yearDifference : -yearDifference;
      }
      return a.title.localeCompare(b.title);
    });
}

export function paginateStories(stories, requestedPage, pageSize = PAGE_SIZE) {
  const totalItems = stories.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const page = Math.min(Math.max(Number(requestedPage) || 1, 1), totalPages);
  const startIndex = (page - 1) * pageSize;
  const items = stories.slice(startIndex, startIndex + pageSize);

  return {
    items,
    page,
    pageSize,
    totalItems,
    totalPages,
    rangeStart: totalItems ? startIndex + 1 : 0,
    rangeEnd: Math.min(startIndex + pageSize, totalItems),
  };
}

export function parseCatalogueState(search = "") {
  const params = new URLSearchParams(search);
  const rawYear = params.get("year");
  const rawPage = Number(params.get("page"));

  return {
    query: params.get("q") || "",
    award: normaliseAward(params.get("award")),
    year: rawYear && /^\d{4}$/.test(rawYear) ? Number(rawYear) : null,
    sort: params.get("sort") === "oldest" ? "oldest" : "newest",
    page: Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1,
  };
}

export function buildCatalogueSearch(state = {}) {
  const params = new URLSearchParams();
  const query = String(state.query || "").trim();
  const award = normaliseAward(state.award);
  const year = Number(state.year);
  const page = Number(state.page);

  if (query) params.set("q", query);
  if (award !== "all") params.set("award", award);
  if (Number.isInteger(year) && year > 0) params.set("year", String(year));
  if (state.sort === "oldest") params.set("sort", "oldest");
  if (Number.isInteger(page) && page > 1) params.set("page", String(page));

  return params.toString();
}

export function buildAuthorCatalogueState(author, sort = "newest") {
  return {
    query: author,
    award: "all",
    year: null,
    sort: sort === "oldest" ? "oldest" : "newest",
    page: 1,
  };
}

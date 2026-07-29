import {
  buildCatalogueSearch,
  filterAndSortStories,
  getCatalogueYears,
  paginateStories,
  parseCatalogueState,
} from "./catalogue.js?v=4";

const searchInput = document.querySelector("#search");
const awardButtons = [...document.querySelectorAll("[data-award]")];
const yearSelect = document.querySelector("#year-filter");
const sortSelect = document.querySelector("#sort-order");
const resetButton = document.querySelector("#reset-filters");
const listEl = document.querySelector("#story-list");
const resultCountEl = document.querySelector("#result-count");
const paginationViews = [...document.querySelectorAll("[data-pagination]")].map(
  (container) => ({
    container,
    pageNumbers: container.querySelector("[data-page-numbers]"),
    pageStatus: container.querySelector("[data-page-status]"),
    previousButton: container.querySelector('[data-page-action="previous"]'),
    nextButton: container.querySelector('[data-page-action="next"]'),
  }),
);
const catalogueEl = document.querySelector(".catalogue");

let stories = [];
let currentPage = 1;

function createExternalLink(url, label, className = "") {
  const link = document.createElement("a");
  link.href = url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = label;
  if (className) link.className = className;
  return link;
}

function renderMessage(message, className = "empty") {
  listEl.replaceChildren();
  const item = document.createElement("li");
  item.className = className;
  item.textContent = message;
  listEl.appendChild(item);
}

function createAwardBadge(entry) {
  const badge = document.createElement("span");
  badge.className = `award-badge award-badge--${entry.award}`;
  badge.textContent = `${entry.award} · ${entry.year}`;
  return badge;
}

function renderStories(visibleStories) {
  listEl.replaceChildren();

  if (!visibleStories.length) {
    renderMessage("No stories match these filters.");
    return;
  }

  for (const story of visibleStories) {
    const card = document.createElement("li");
    card.className = `story-card${
      story.resultType === "no-award" ? " story-card--no-award" : ""
    }`;

    const badges = document.createElement("div");
    badges.className = "award-badges";
    for (const award of [...story.awards].sort((a, b) => b.year - a.year)) {
      badges.appendChild(createAwardBadge(award));
    }
    if (story.resultType === "no-award") {
      const warning = document.createElement("span");
      warning.className = "result-warning";
      warning.setAttribute("aria-hidden", "true");
      warning.textContent = "!";
      badges.appendChild(warning);
    }

    const title = document.createElement("h3");
    title.textContent =
      story.resultType === "no-award"
        ? "No story received the award"
        : story.title;
    card.append(badges, title);

    if (story.resultType === "winner") {
      const meta = document.createElement("p");
      meta.className = "meta";

      const author = document.createElement("span");
      author.className = "meta-author";
      author.textContent = story.author;
      const separator = document.createElement("span");
      separator.className = "meta-separator";
      separator.setAttribute("aria-hidden", "true");
      separator.textContent = "/";
      const publication = document.createElement("span");
      publication.className = "meta-publication";
      publication.textContent = story.publication;

      meta.append(author, separator, publication);
      card.appendChild(meta);
    }

    const links = document.createElement("div");
    links.className = "links";

    if (story.storyUrl) {
      links.appendChild(
        createExternalLink(
          story.storyUrl,
          "Read story",
          "read-action read-link",
        ),
      );
    } else if (story.resultType === "winner") {
      const unavailable = document.createElement("span");
      unavailable.className = "read-action read-action--unavailable";

      const visibleLabel = document.createElement("span");
      visibleLabel.setAttribute("aria-hidden", "true");
      visibleLabel.textContent = "NA";

      const accessibleLabel = document.createElement("span");
      accessibleLabel.className = "sr-only";
      accessibleLabel.textContent = "Read story unavailable";

      unavailable.append(visibleLabel, accessibleLabel);
      links.appendChild(unavailable);
    }

    for (const award of [...story.awards].sort((a, b) => b.year - a.year)) {
      const awardName = award.award[0].toUpperCase() + award.award.slice(1);
      links.appendChild(
        createExternalLink(
          award.sourceUrl,
          `${awardName} source`,
          "secondary-link",
        ),
      );
    }

    card.appendChild(links);
    listEl.appendChild(card);
  }
}

function getSelectedAward() {
  return (
    awardButtons.find((button) => button.getAttribute("aria-pressed") === "true")
      ?.dataset.award || "all"
  );
}

function setSelectedAward(award) {
  const availableButton = awardButtons.find(
    (button) => button.dataset.award === award && !button.disabled,
  );
  const selectedAward = availableButton ? award : "all";

  for (const button of awardButtons) {
    button.setAttribute(
      "aria-pressed",
      String(button.dataset.award === selectedAward),
    );
  }
}

function setAwardAvailability() {
  const availableAwards = new Set(
    stories.flatMap((story) => story.awards.map((entry) => entry.award)),
  );

  for (const button of awardButtons) {
    if (button.dataset.award === "all") continue;
    button.disabled = !availableAwards.has(button.dataset.award);
  }
}

function populateYearFilter(award, preferredYear = null) {
  const allYearsOption = document.createElement("option");
  allYearsOption.value = "";
  allYearsOption.textContent = "All years";
  yearSelect.replaceChildren(allYearsOption);

  const years = getCatalogueYears(stories, award);
  for (const year of years) {
    const option = document.createElement("option");
    option.value = String(year);
    option.textContent = String(year);
    yearSelect.appendChild(option);
  }

  yearSelect.value = years.includes(Number(preferredYear))
    ? String(preferredYear)
    : "";
}

function getControlState() {
  return {
    query: searchInput.value,
    award: getSelectedAward(),
    year: yearSelect.value ? Number(yearSelect.value) : null,
    sort: sortSelect.value,
    page: currentPage,
  };
}

function writeUrl(mode) {
  const queryString = buildCatalogueSearch(getControlState());
  const nextUrl = `${window.location.pathname}${queryString ? `?${queryString}` : ""}`;
  window.history[`${mode}State`]({}, "", nextUrl);
}

function createPageButton(page, current) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "page-number";
  button.textContent = String(page);
  button.setAttribute("aria-label", `Page ${page}`);
  if (page === current) button.setAttribute("aria-current", "page");
  button.addEventListener("click", () => changePage(page));
  return button;
}

function getPageItems(current, total) {
  const pages = new Set([1, total, current - 1, current, current + 1]);
  const validPages = [...pages]
    .filter((page) => page >= 1 && page <= total)
    .sort((a, b) => a - b);
  const items = [];

  for (const page of validPages) {
    const previous = items.at(-1);
    if (typeof previous === "number" && page - previous > 1) items.push("gap");
    items.push(page);
  }

  return items;
}

function renderPagination(pageData) {
  for (const view of paginationViews) {
    view.container.hidden = pageData.totalPages <= 1;
    view.previousButton.disabled = pageData.page === 1;
    view.nextButton.disabled = pageData.page === pageData.totalPages;
    view.pageStatus.textContent = `Page ${pageData.page} of ${pageData.totalPages}`;
    view.pageNumbers.replaceChildren();

    for (const item of getPageItems(pageData.page, pageData.totalPages)) {
      if (item === "gap") {
        const gap = document.createElement("span");
        gap.className = "page-gap";
        gap.setAttribute("aria-hidden", "true");
        gap.textContent = "…";
        view.pageNumbers.appendChild(gap);
      } else {
        view.pageNumbers.appendChild(createPageButton(item, pageData.page));
      }
    }
  }
}

function updateResetState() {
  const state = getControlState();
  resetButton.disabled =
    !state.query &&
    state.award === "all" &&
    !state.year &&
    state.sort === "newest" &&
    state.page === 1;
}

function applyControls({ historyMode = null } = {}) {
  const state = getControlState();
  const filteredStories = filterAndSortStories(stories, state);
  const pageData = paginateStories(filteredStories, currentPage);
  currentPage = pageData.page;

  renderStories(pageData.items);
  renderPagination(pageData);
  resultCountEl.textContent = pageData.totalItems
    ? `${pageData.rangeStart}–${pageData.rangeEnd} of ${pageData.totalItems} entries`
    : "0 entries";
  updateResetState();

  if (historyMode) writeUrl(historyMode);
}

function applyState(state, { historyMode = null } = {}) {
  searchInput.value = state.query;
  setSelectedAward(state.award);
  populateYearFilter(getSelectedAward(), state.year);
  sortSelect.value = state.sort;
  currentPage = state.page;
  applyControls({ historyMode });
}

function changePage(page) {
  currentPage = page;
  applyControls({ historyMode: "push" });
  catalogueEl.scrollIntoView();
}

function resetControls() {
  applyState(
    {
      query: "",
      award: "all",
      year: null,
      sort: "newest",
      page: 1,
    },
    { historyMode: "push" },
  );
  searchInput.focus();
}

function handleAwardChange(button) {
  if (button.disabled || button.getAttribute("aria-pressed") === "true") return;
  setSelectedAward(button.dataset.award);
  populateYearFilter(button.dataset.award);
  currentPage = 1;
  applyControls({ historyMode: "push" });
}

async function loadCatalogue() {
  renderMessage("Loading catalogue…", "loading");
  resultCountEl.textContent = "";
  for (const view of paginationViews) view.container.hidden = true;

  try {
    const response = await fetch("./data/stories.json?v=3");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    if (!Array.isArray(data)) throw new Error("Catalogue data is not an array");

    stories = data;
    setAwardAvailability();
    applyState(parseCatalogueState(window.location.search), {
      historyMode: "replace",
    });
  } catch (error) {
    console.error("Unable to load catalogue:", error);
    renderMessage(
      "The catalogue could not be loaded. Please refresh the page or try again later.",
      "error",
    );
    resultCountEl.textContent = "Unavailable";
    searchInput.disabled = true;
    yearSelect.disabled = true;
    sortSelect.disabled = true;
    resetButton.disabled = true;
    for (const button of awardButtons) button.disabled = true;
  }
}

searchInput.addEventListener("input", () => {
  currentPage = 1;
  applyControls({ historyMode: "replace" });
});

yearSelect.addEventListener("change", () => {
  currentPage = 1;
  applyControls({ historyMode: "push" });
});

sortSelect.addEventListener("change", () => {
  currentPage = 1;
  applyControls({ historyMode: "push" });
});

resetButton.addEventListener("click", resetControls);
for (const view of paginationViews) {
  view.previousButton.addEventListener("click", () =>
    changePage(currentPage - 1),
  );
  view.nextButton.addEventListener("click", () => changePage(currentPage + 1));
}
for (const button of awardButtons) {
  button.addEventListener("click", () => handleAwardChange(button));
}

window.addEventListener("popstate", () => {
  applyState(parseCatalogueState(window.location.search));
});

loadCatalogue();

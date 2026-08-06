import {
  buildAuthorCatalogueState,
  buildCatalogueSearch,
  filterAndSortStories,
  getCatalogueYears,
  paginateStories,
  parseCatalogueState,
} from "./catalogue.js?v=6";
import {
  renderCatalogueMessage,
  renderPagination,
  renderStories,
} from "./catalogue-view.js?v=4";

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

  renderStories(listEl, pageData.items, (author) => {
    const queryString = buildCatalogueSearch(
      buildAuthorCatalogueState(author, sortSelect.value),
    );
    return `${window.location.pathname}?${queryString}`;
  });
  renderPagination(paginationViews, pageData, changePage);
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
}

function handleAwardChange(button) {
  if (button.disabled || button.getAttribute("aria-pressed") === "true") return;
  setSelectedAward(button.dataset.award);
  populateYearFilter(button.dataset.award);
  currentPage = 1;
  applyControls({ historyMode: "push" });
}

function handleAuthorFilter(event) {
  const authorLink = event.target.closest("[data-author-filter]");
  if (
    !authorLink ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey
  ) {
    return;
  }

  event.preventDefault();
  applyState(
    buildAuthorCatalogueState(authorLink.dataset.authorFilter, sortSelect.value),
    { historyMode: "push" },
  );
  catalogueEl.scrollIntoView();
}

async function loadCatalogue() {
  renderCatalogueMessage(listEl, "Loading catalogue…", "loading");
  resultCountEl.textContent = "";
  for (const view of paginationViews) view.container.hidden = true;

  try {
    const response = await fetch("./data/stories.json?v=10");
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
    renderCatalogueMessage(
      listEl,
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
listEl.addEventListener("click", handleAuthorFilter);
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

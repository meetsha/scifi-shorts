const RESULT_TITLES = {
  "no-award": "No story received the award",
  "not-presented": "Short fiction category not presented",
};

function createExternalLink(url, label, className = "") {
  const link = document.createElement("a");
  link.href = url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = label;
  if (className) link.className = className;
  return link;
}

function createAwardBadge(entry) {
  const awardName = entry.award[0].toUpperCase() + entry.award.slice(1);
  const badge = createExternalLink(
    entry.sourceUrl,
    "",
    `award-badge award-badge--${entry.award}`,
  );
  const label = document.createElement("span");
  label.className = "award-badge__label";
  label.textContent = `${entry.award} · ${entry.year}`;
  badge.appendChild(label);
  badge.setAttribute(
    "aria-label",
    `View official ${awardName} ${entry.year} award results`,
  );
  return badge;
}

function createReadAction(story) {
  if (story.storyUrl) {
    return createExternalLink(
      story.storyUrl,
      "Read story",
      "read-action read-link",
    );
  }

  if (story.resultType !== "winner") return null;

  const unavailable = document.createElement("span");
  unavailable.className = "read-action read-action--unavailable";

  const visibleLabel = document.createElement("span");
  visibleLabel.setAttribute("aria-hidden", "true");
  visibleLabel.textContent = "NA";

  const accessibleLabel = document.createElement("span");
  accessibleLabel.className = "sr-only";
  accessibleLabel.textContent = "Read story unavailable";

  unavailable.append(visibleLabel, accessibleLabel);
  return unavailable;
}

function createStoryCard(story) {
  const card = document.createElement("li");
  card.className = `story-card${
    story.resultType === "winner" ? "" : " story-card--special-result"
  }`;

  const badges = document.createElement("div");
  badges.className = "award-badges";
  for (const award of [...story.awards].sort((a, b) => b.year - a.year)) {
    badges.appendChild(createAwardBadge(award));
  }
  if (story.resultType !== "winner") {
    const warning = document.createElement("span");
    warning.className = "result-warning";
    warning.setAttribute("aria-hidden", "true");
    warning.textContent = "!";
    badges.appendChild(warning);
  }

  const title = document.createElement("h3");
  title.textContent = RESULT_TITLES[story.resultType] ?? story.title;
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

  const readAction = createReadAction(story);
  if (readAction) {
    const links = document.createElement("div");
    links.className = "links";
    links.appendChild(readAction);
    card.appendChild(links);
  }

  return card;
}

export function renderCatalogueMessage(
  listElement,
  message,
  className = "empty",
) {
  const item = document.createElement("li");
  item.className = className;
  item.textContent = message;
  listElement.replaceChildren(item);
}

export function renderStories(listElement, visibleStories) {
  if (!visibleStories.length) {
    renderCatalogueMessage(listElement, "No stories match these filters.");
    return;
  }

  listElement.replaceChildren(...visibleStories.map(createStoryCard));
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

function createPageButton(page, current, onPageChange) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "page-number";
  button.textContent = String(page);
  button.setAttribute("aria-label", `Page ${page}`);
  if (page === current) button.setAttribute("aria-current", "page");
  button.addEventListener("click", () => onPageChange(page));
  return button;
}

export function renderPagination(paginationViews, pageData, onPageChange) {
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
        view.pageNumbers.appendChild(
          createPageButton(item, pageData.page, onPageChange),
        );
      }
    }
  }
}

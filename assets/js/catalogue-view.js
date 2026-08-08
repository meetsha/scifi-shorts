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

export function getReadActionLabels(story) {
  if (story.reading) {
    const isPdf = story.reading.format === "pdf";
    return {
      visible: isPdf ? "Read PDF" : "Read story",
      accessible: isPdf ? `Read ${story.title} as a PDF` : `Read ${story.title}`,
    };
  }

  if (story.resultType === "winner") {
    return {
      visible: "NA",
      accessible: "Read story unavailable",
    };
  }

  return null;
}

function createReadAction(story) {
  const labels = getReadActionLabels(story);

  if (story.reading) {
    const link = createExternalLink(
      story.reading.url,
      labels.visible,
      "read-action read-link",
    );
    link.setAttribute("aria-label", labels.accessible);
    return link;
  }

  if (!labels) return null;

  const unavailable = document.createElement("span");
  unavailable.className = "read-action read-action--unavailable";

  const visibleLabel = document.createElement("span");
  visibleLabel.setAttribute("aria-hidden", "true");
  visibleLabel.textContent = labels.visible;

  const accessibleLabel = document.createElement("span");
  accessibleLabel.className = "sr-only";
  accessibleLabel.textContent = labels.accessible;

  unavailable.append(visibleLabel, accessibleLabel);
  return unavailable;
}

function createFinishedToggle(story, card, isFinished, onFinishedChange) {
  const label = document.createElement("label");
  label.className = "finished-toggle";
  label.title = isFinished ? "Mark as unfinished" : "Mark as finished";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "finished-toggle__input";
  checkbox.checked = isFinished;
  checkbox.setAttribute("aria-label", `Finished: ${story.title}`);
  checkbox.addEventListener("change", () => {
    card.classList.toggle("story-card--finished", checkbox.checked);
    label.title = checkbox.checked ? "Mark as unfinished" : "Mark as finished";
    onFinishedChange(story.id, checkbox.checked);
  });

  label.appendChild(checkbox);
  return label;
}

function createStoryCard(
  story,
  getAuthorHref,
  finishedStoryIds,
  onFinishedChange,
) {
  const card = document.createElement("li");
  card.className = `story-card${
    story.resultType === "winner" ? "" : " story-card--special-result"
  }`;

  const isFinished =
    story.resultType === "winner" && finishedStoryIds.has(story.id);
  card.classList.toggle("story-card--finished", isFinished);

  const badges = document.createElement("div");
  badges.className = "award-badges";
  for (const award of [...story.awards].sort((a, b) => b.year - a.year)) {
    badges.appendChild(createAwardBadge(award));
  }
  const title = document.createElement("h3");
  title.textContent = RESULT_TITLES[story.resultType] ?? story.title;
  card.append(badges, title);

  if (story.resultType === "winner") {
    const meta = document.createElement("p");
    meta.className = "meta";

    const author = document.createElement("a");
    author.className = "meta-author";
    author.textContent = story.author;
    author.href = getAuthorHref(story.author);
    author.dataset.authorFilter = story.author;
    author.setAttribute("aria-label", `Show all stories by ${story.author}`);

    const separator = document.createElement("span");
    separator.className = "meta-separator";
    separator.setAttribute("aria-hidden", "true");
    separator.textContent = "/";

    const publication = document.createElement("span");
    publication.className = "meta-publication";
    publication.textContent = story.publication;

    meta.append(author, separator, publication);
    card.appendChild(meta);

    const intro = document.createElement("p");
    intro.className = "story-intro";
    intro.textContent = story.intro;
    card.appendChild(intro);
  }

  const readAction = createReadAction(story);
  if (readAction) {
    const links = document.createElement("div");
    links.className = "links";
    links.append(
      readAction,
      createFinishedToggle(
        story,
        card,
        isFinished,
        onFinishedChange,
      ),
    );
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

export function renderStories(
  listElement,
  visibleStories,
  getAuthorHref,
  finishedStoryIds,
  onFinishedChange,
) {
  if (!visibleStories.length) {
    renderCatalogueMessage(listElement, "No stories match these filters.");
    return;
  }

  listElement.replaceChildren(
    ...visibleStories.map((story) =>
      createStoryCard(
        story,
        getAuthorHref,
        finishedStoryIds,
        onFinishedChange,
      ),
    ),
  );
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
    view.container.hidden = false;
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

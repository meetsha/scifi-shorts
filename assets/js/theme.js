const THEME_KEY = "scifi-theme";
const SUNPRINT_THEME = "sunprint";

const themeToggle = document.querySelector("[data-theme-toggle]");
const themeColor = document.querySelector('meta[name="theme-color"]');

function getStoredTheme() {
  try {
    return window.localStorage.getItem(THEME_KEY);
  } catch {
    return null;
  }
}

function storeTheme(theme) {
  try {
    if (theme === SUNPRINT_THEME) window.localStorage.setItem(THEME_KEY, theme);
    else window.localStorage.removeItem(THEME_KEY);
  } catch {
    // The visual preference still applies for this page when storage is unavailable.
  }
}

function applyTheme(theme, { persist = false } = {}) {
  const usesSunprint = theme === SUNPRINT_THEME;
  if (usesSunprint) document.documentElement.dataset.theme = SUNPRINT_THEME;
  else delete document.documentElement.dataset.theme;

  themeColor?.setAttribute("content", usesSunprint ? "#f4e4b8" : "#0a100d");

  if (themeToggle) {
    themeToggle.setAttribute(
      "aria-label",
      usesSunprint ? "Switch to night theme" : "Switch to Sunprint theme",
    );
    themeToggle.title = usesSunprint ? "Switch to night" : "Switch to Sunprint";
  }

  if (persist) storeTheme(usesSunprint ? SUNPRINT_THEME : "night");
}

applyTheme(getStoredTheme());

themeToggle?.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === SUNPRINT_THEME
    ? "night"
    : SUNPRINT_THEME;
  applyTheme(nextTheme, { persist: true });
});

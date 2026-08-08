export const FINISHED_STORIES_STORAGE_KEY =
  "scifi-short-stories:finished-story-ids:v1";

export function parseFinishedStoryIds(value) {
  if (!value) return new Set();

  try {
    const ids = JSON.parse(value);
    if (!Array.isArray(ids) || ids.some((id) => typeof id !== "string")) {
      return new Set();
    }
    return new Set(ids);
  } catch {
    return new Set();
  }
}

export function loadFinishedStoryIds(storage) {
  if (!storage) return new Set();

  try {
    return parseFinishedStoryIds(storage.getItem(FINISHED_STORIES_STORAGE_KEY));
  } catch {
    return new Set();
  }
}

export function saveFinishedStoryIds(storage, storyIds) {
  if (!storage) return false;

  try {
    storage.setItem(
      FINISHED_STORIES_STORAGE_KEY,
      JSON.stringify([...storyIds].sort()),
    );
    return true;
  } catch {
    return false;
  }
}

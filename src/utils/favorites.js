const KEY = "sd-favorites";

export function getFavorites() {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch (e) {
    return [];
  }
}

export function setFavorites(ids) {
  try {
    localStorage.setItem(KEY, JSON.stringify(ids));
  } catch (e) {
    // ignore
  }
}

export function isFavorite(id) {
  return getFavorites().includes(id);
}

export function toggleFavorite(id) {
  const cur = getFavorites();
  const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
  setFavorites(next);
  try {
    window.dispatchEvent(new CustomEvent("sd:favorites", { detail: next }));
  } catch (e) {
    // ignore
  }
  return next;
}

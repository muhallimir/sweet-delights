const PREFIX = "sd-reviews-";

export function starText(rating) {
  const r = Number(rating) || 0;
  const full = Math.round(r);
  return "★".repeat(Math.max(0, Math.min(5, full))) + "☆".repeat(5 - Math.max(0, Math.min(5, full)));
}

export function getReviews(productId) {
  try {
    const raw = localStorage.getItem(PREFIX + productId);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

export function addReview(productId, { name, rating, text }) {
  const entry = {
    name: String(name || "").trim(),
    rating: Math.min(5, Math.max(1, Number(rating) || 5)),
    text: String(text || "").trim(),
    date: new Date().toISOString(),
  };
  const cur = getReviews(productId);
  const next = [entry, ...cur].slice(0, 50);
  try {
    localStorage.setItem(PREFIX + productId, JSON.stringify(next));
  } catch (e) {
    // ignore
  }
  return next;
}

export function validateReview({ name, rating, text }) {
  const errors = {};
  if (!name || name.trim().length < 2) errors.name = "Please enter your name.";
  const r = Number(rating);
  if (!Number.isFinite(r) || r < 1 || r > 5) errors.rating = "Pick 1 to 5 stars.";
  if (!text || text.trim().length < 4) errors.text = "Tell us a bit more (min 4 characters).";
  if (text && text.trim().length > 500) errors.text = "Keep it under 500 characters.";
  return errors;
}

export const MAX_PHOTO_BYTES = 200 * 1024;

export function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("No file selected."));
      return;
    }
    if (typeof FileReader === "undefined") {
      reject(new Error("FileReader not available."));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Could not read file."));
    reader.readAsDataURL(file);
  });
}

export function validatePhotoFile(file) {
  if (!file) return "Pick an image first.";
  if (!/^image\//.test(file.type || "")) {
    return "Only image files are supported.";
  }
  if (file.size > MAX_PHOTO_BYTES) {
    return "Photo is over 200 KB. Pick a smaller image.";
  }
  return "";
}

export function validatePhotoReview({ name, rating, text }) {
  const errors = {};
  if (!name || name.trim().length < 2) errors.name = "Please enter your name.";
  const r = Number(rating);
  if (!Number.isFinite(r) || r < 1 || r > 5) errors.rating = "Pick 1 to 5 stars.";
  if (!text || text.trim().length < 4) errors.text = "Tell us a bit more (min 4 characters).";
  if (text && text.trim().length > 500) errors.text = "Keep it under 500 characters.";
  if (!text || !text.trim()) errors.caption = "Add a short caption for your photo.";
  return errors;
}

export function addPhotoReview(productId, entry) {
  const KEY = `sd-photo-reviews-${productId}`;
  const dataUrl = entry.dataUrl || "";
  const record = {
    id: `pr-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name: String(entry.name || "").trim(),
    rating: Math.min(5, Math.max(1, Number(entry.rating) || 5)),
    text: String(entry.text || "").trim(),
    caption: String(entry.caption || entry.text || "").trim(),
    dataUrl,
    size: dataUrl.length,
    date: new Date().toISOString(),
  };
  try {
    const raw = localStorage.getItem(KEY);
    const list = raw ? JSON.parse(raw) : [];
    const next = Array.isArray(list) ? [record, ...list].slice(0, 30) : [record];
    localStorage.setItem(KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent("sd:photo-reviews", { detail: { productId, list: next } }));
    return next;
  } catch (e) {
    return [record];
  }
}

export function getPhotoReviews(productId) {
  try {
    const raw = localStorage.getItem(`sd-photo-reviews-${productId}`);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}
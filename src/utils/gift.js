const KEY = "sd-gift";
export const GIFT_WRAP_PRICE = 49;

export function getGift() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { wrap: false, message: "", receipt: false };
    const p = JSON.parse(raw);
    return { wrap: Boolean(p.wrap), message: String(p.message || ""), receipt: Boolean(p.receipt) };
  } catch (e) {
    return { wrap: false, message: "", receipt: false };
  }
}

export function setGift(v) {
  try {
    localStorage.setItem(KEY, JSON.stringify(v));
  } catch (e) {
    // ignore
  }
}

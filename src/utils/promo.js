export const PROMO_CODES = {
  SWEET10: {
    code: "SWEET10",
    type: "percent",
    value: 10,
    label: "10% off your order",
  },
  FREESHIP: {
    code: "FREESHIP",
    type: "freeship",
    value: 0,
    label: "Free delivery",
  },
  BDAY15: {
    code: "BDAY15",
    type: "percent",
    value: 15,
    label: "15% off birthday treat",
  },
};

const KEY = "sd-promo";

export function normalizePromo(input) {
  return String(input || "").trim().toUpperCase();
}

export function validatePromo(input) {
  const code = normalizePromo(input);
  if (!code) {
    return { ok: false, code: "", message: "Enter a promo code (try SWEET10)." };
  }
  const found = PROMO_CODES[code];
  if (!found) {
    return { ok: false, code, message: "That code is not valid. Try SWEET10 or FREESHIP." };
  }
  return { ok: true, code, promo: found, message: `Applied ${code}: ${found.label}.` };
}

export function getStoredPromo() {
  try {
    const raw = localStorage.getItem(KEY);
    const code = normalizePromo(raw);
    if (code && PROMO_CODES[code]) return code;
    return "";
  } catch (e) {
    return "";
  }
}

export function setStoredPromo(code) {
  try {
    const norm = normalizePromo(code);
    if (!norm) {
      localStorage.removeItem(KEY);
      return;
    }
    localStorage.setItem(KEY, norm);
  } catch (e) {
    // ignore
  }
}

export function clearStoredPromo() {
  try {
    localStorage.removeItem(KEY);
  } catch (e) {
    // ignore
  }
}

export function calcPromo(subtotal, fee, code) {
  const norm = normalizePromo(code);
  const promo = PROMO_CODES[norm];
  if (!promo || subtotal <= 0) {
    return { code: "", discount: 0, fee, total: subtotal + fee };
  }
  if (promo.type === "percent") {
    const discount = Math.round(subtotal * (promo.value / 100) * 100) / 100;
    return { code: norm, discount, fee, total: subtotal - discount + fee };
  }
  if (promo.type === "freeship") {
    return { code: norm, discount: 0, fee: 0, total: subtotal };
  }
  return { code: "", discount: 0, fee, total: subtotal + fee };
}

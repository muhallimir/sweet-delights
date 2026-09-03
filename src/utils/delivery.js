export function estimateForPostcode(postcode, subtotal) {
  const code = String(postcode || "").trim();
  if (!/^\d{4}$/.test(code)) {
    return { ok: false, message: "Enter a 4-digit postcode (e.g. 1000)." };
  }
  let zone = "Provincial";
  let fee = 129;
  let eta = "1-2 days";
  if (/^(10|11|12|13|14|15|16|17)\d{2}$/.test(code)) {
    zone = "Metro Manila";
    fee = 49;
    eta = "45-60 min";
  } else if (/^4\d{3}$/.test(code)) {
    zone = "Calabarzon";
    fee = 79;
    eta = "1-2 hours";
  }
  const free = Number(subtotal) >= 500;
  if (free) fee = 0;
  return { ok: true, zone, fee, eta, free, message: `${zone} · ${fee === 0 ? "FREE delivery" : "₱" + fee} · ETA ${eta}${free ? " (free over ₱500)" : ""}` };
}

export function getStoredPostcode() {
  try {
    return localStorage.getItem("sd-postcode") || "";
  } catch (e) {
    return "";
  }
}

export function setStoredPostcode(v) {
  try {
    localStorage.setItem("sd-postcode", String(v || ""));
  } catch (e) {
    // ignore
  }
}

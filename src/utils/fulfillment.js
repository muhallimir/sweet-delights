const KEY = "sd-fulfillment";

export const TIME_SLOTS = ["9-11 AM", "11 AM-1 PM", "2-4 PM", "4-6 PM"];

export function getFulfillment() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { type: "delivery", date: "", slot: "", storeId: "poblacion" };
    const parsed = JSON.parse(raw);
    return {
      type: parsed.type === "pickup" ? "pickup" : "delivery",
      date: parsed.date || "",
      slot: parsed.slot || "",
      storeId: parsed.storeId || "poblacion",
    };
  } catch (e) {
    return { type: "delivery", date: "", slot: "", storeId: "poblacion" };
  }
}

export function setFulfillment(v) {
  try {
    localStorage.setItem(KEY, JSON.stringify(v));
  } catch (e) {
    // ignore
  }
}

export function validateFulfillment(f) {
  const errors = {};
  if (f.type !== "delivery" && f.type !== "pickup") errors.type = "Choose delivery or pickup.";
  if (!f.date) {
    errors.date = "Pick a date.";
  } else {
    const picked = new Date(`${f.date}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const max = new Date(today);
    max.setDate(max.getDate() + 14);
    if (Number.isNaN(picked.getTime())) errors.date = "Invalid date.";
    else if (picked < today) errors.date = "Date must be today or later.";
    else if (picked > max) errors.date = "Pick within 14 days.";
  }
  if (!f.slot || !TIME_SLOTS.includes(f.slot)) errors.slot = "Pick a time slot.";
  return errors;
}

export function fulfillmentLabel(f) {
  if (!f) return "";
  const kind = f.type === "pickup" ? "Pickup" : "Delivery";
  if (!f.date || !f.slot) return kind;
  return `${kind} · ${f.date} · ${f.slot}`;
}

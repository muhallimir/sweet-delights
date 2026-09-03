const SUBS_KEY = "sd-sms-subs";
const STATUS_KEY = "sd-sms-status";

export const SMS_STAGES = ["placed", "baking", "out for delivery", "delivered"];

export const SMS_INTERVAL_MS = 12000;

export function getSmsSubs() {
  try {
    const raw = localStorage.getItem(SUBS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

export function setSmsSubs(list) {
  try {
    localStorage.setItem(SUBS_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent("sd:sms-subs", { detail: list }));
  } catch (e) {
    // ignore
  }
}

export function addSmsSub({ orderId, phone }) {
  const cleanPhone = normalizePhone(phone);
  const list = getSmsSubs();
  const filtered = list.filter((s) => s.orderId !== orderId);
  const next = [
    {
      orderId,
      phone: cleanPhone,
      stage: 0,
      startedAt: new Date().toISOString(),
    },
    ...filtered,
  ].slice(0, 50);
  setSmsSubs(next);
  return next[0];
}

export function removeSmsSub(orderId) {
  const next = getSmsSubs().filter((s) => s.orderId !== orderId);
  setSmsSubs(next);
  return next;
}

export function normalizePhone(phone) {
  return String(phone || "").replace(/[\s-]/g, "");
}

export function validatePhone(phone) {
  const cleaned = normalizePhone(phone);
  if (!cleaned) return "Phone number required.";
  if (!/^(\+?63|0)?\d{9,11}$/.test(cleaned)) {
    return "Enter a valid PH phone number (e.g. 09171234567).";
  }
  return "";
}

export function smsStatusFor(orderId) {
  try {
    const raw = localStorage.getItem(STATUS_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return typeof parsed[orderId] === "number" ? parsed[orderId] : null;
  } catch (e) {
    return null;
  }
}

export function setSmsStatus(orderId, stage) {
  try {
    const raw = localStorage.getItem(STATUS_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    parsed[orderId] = stage;
    localStorage.setItem(STATUS_KEY, JSON.stringify(parsed));
    window.dispatchEvent(new CustomEvent("sd:sms-status", { detail: { orderId, stage } }));
  } catch (e) {
    // ignore
  }
}

export function tickSmsSubs(now = Date.now()) {
  const list = getSmsSubs();
  const updated = [];
  let changed = false;
  list.forEach((sub) => {
    const elapsed = now - new Date(sub.startedAt).getTime();
    let stage = sub.stage || 0;
    if (stage < 1 && elapsed >= 15000) stage = 1;
    if (stage < 2 && elapsed >= 45000) stage = 2;
    if (stage < 3 && elapsed >= 90000) stage = 3;
    if (stage !== sub.stage) changed = true;
    updated.push({ ...sub, stage });
  });
  if (changed) setSmsSubs(updated);
  return updated;
}

export function stageMessage(orderId, stage) {
  const code = orderId.slice(-4);
  switch (stage) {
    case 0:
      return `SD-${code}: We got your order. Prepping now.`;
    case 1:
      return `SD-${code}: Your treats are baking. Fresh from the oven soon.`;
    case 2:
      return `SD-${code}: Out for delivery. Hang tight!`;
    case 3:
      return `SD-${code}: Delivered. Enjoy!`;
    default:
      return "";
  }
}
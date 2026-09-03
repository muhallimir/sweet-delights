export const GIFT_CARD_DENOMINATIONS = [500, 1000, 2000];

const KEY = "sd-gift-cards";

export function getGiftCards() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

export function setGiftCards(list) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent("sd:giftcards", { detail: list }));
  } catch (e) {
    // ignore
  }
}

function makeCode() {
  const part = () => Math.random().toString(36).slice(2, 6).toUpperCase();
  return `GIFT-${part()}-${part()}`;
}

export function purchaseGiftCard({ amount, recipientName, recipientEmail, message }) {
  const validAmount = GIFT_CARD_DENOMINATIONS.includes(Number(amount)) ? Number(amount) : GIFT_CARD_DENOMINATIONS[0];
  const card = {
    id: `gc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    code: makeCode(),
    initialBalance: validAmount,
    balance: validAmount,
    recipientName: String(recipientName || "").trim(),
    recipientEmail: String(recipientEmail || "").trim(),
    message: String(message || "").trim().slice(0, 200),
    purchasedAt: new Date().toISOString(),
  };
  const next = [card, ...getGiftCards()].slice(0, 50);
  setGiftCards(next);
  return card;
}

export function findGiftCard(code) {
  const c = String(code || "").trim().toUpperCase();
  return getGiftCards().find((g) => String(g.code || "").toUpperCase() === c) || null;
}

export function redeemGiftCard(code, amount) {
  const c = findGiftCard(code);
  if (!c) return { ok: false, reason: "not_found" };
  if (c.balance <= 0) return { ok: false, reason: "empty" };
  const applied = Math.max(0, Math.min(c.balance, Math.floor(Number(amount) || 0)));
  if (applied <= 0) return { ok: false, reason: "amount" };
  const list = getGiftCards().map((g) =>
    g.code === c.code ? { ...g, balance: g.balance - applied } : g
  );
  setGiftCards(list);
  return { ok: true, applied, remaining: c.balance - applied };
}

export function validateGiftCardForm(values) {
  const errors = {};
  if (!values.recipientName || values.recipientName.trim().length < 2) {
    errors.recipientName = "Please enter the recipient's name.";
  }
  if (!values.recipientEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.recipientEmail)) {
    errors.recipientEmail = "Enter a valid email for the recipient.";
  }
  if (!GIFT_CARD_DENOMINATIONS.includes(Number(values.amount))) {
    errors.amount = "Pick one of the available denominations.";
  }
  if (values.message && values.message.length > 200) {
    errors.message = "Keep the message under 200 characters.";
  }
  return errors;
}
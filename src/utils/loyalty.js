const BAL_KEY = "sd-loyalty-points";
const REDEEM_KEY = "sd-loyalty-redeem";

export const LOYALTY_COST = 100;
export const LOYALTY_VALUE = 250;

export function getLoyaltyBalance() {
  try {
    const n = parseInt(localStorage.getItem(BAL_KEY) || "0", 10);
    return Number.isFinite(n) && n > 0 ? n : 0;
  } catch (e) {
    return 0;
  }
}

export function setLoyaltyBalance(n) {
  try {
    localStorage.setItem(BAL_KEY, String(Math.max(0, Math.floor(n || 0))));
  } catch (e) {
    // ignore
  }
}

export function addLoyaltyPoints(pts) {
  const cur = getLoyaltyBalance();
  const next = cur + Math.max(0, Math.floor(pts || 0));
  setLoyaltyBalance(next);
  return next;
}

export function spendLoyaltyPoints(pts) {
  const cur = getLoyaltyBalance();
  const next = Math.max(0, cur - pts);
  setLoyaltyBalance(next);
  return next;
}

export function getLoyaltyRedeem() {
  try {
    return localStorage.getItem(REDEEM_KEY) === "1";
  } catch (e) {
    return false;
  }
}

export function setLoyaltyRedeem(on) {
  try {
    if (on) localStorage.setItem(REDEEM_KEY, "1");
    else localStorage.removeItem(REDEEM_KEY);
  } catch (e) {
    // ignore
  }
}

export function calcLoyalty(subtotalAfterPromo, balance, redeem) {
  if (!redeem || balance < LOYALTY_COST || subtotalAfterPromo <= 0) {
    return { discount: 0, applied: false };
  }
  const discount = Math.min(LOYALTY_VALUE, subtotalAfterPromo);
  return { discount, applied: true };
}

export function earnForTotal(total) {
  if (!Number.isFinite(total) || total <= 0) return 0;
  return Math.floor(total);
}

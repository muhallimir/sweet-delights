export const TIERS = ["Bronze", "Silver", "Gold"];

export const TIER_THRESHOLDS = {
  Bronze: 0,
  Silver: 500,
  Gold: 2000,
};

export const TIER_PERKS = {
  Bronze: [],
  Silver: ["Free delivery on all orders", "Birthday 10% off"],
  Gold: ["Free delivery on all orders", "Exclusive Gold-only items", "Birthday 15% off", "Priority support"],
};

export const NEXT_TIER_THRESHOLD = {
  Bronze: 500,
  Silver: 2000,
  Gold: null,
};

export function tierForPoints(points) {
  const pts = Math.max(0, Math.floor(Number(points) || 0));
  if (pts >= TIER_THRESHOLDS.Gold) return "Gold";
  if (pts >= TIER_THRESHOLDS.Silver) return "Silver";
  return "Bronze";
}

export function progressToNextTier(points) {
  const pts = Math.max(0, Math.floor(Number(points) || 0));
  const currentTier = tierForPoints(pts);
  if (currentTier === "Gold") {
    return { tier: "Gold", percent: 100, remaining: 0, next: null };
  }
  const target = currentTier === "Bronze" ? TIER_THRESHOLDS.Silver : TIER_THRESHOLDS.Gold;
  const base = currentTier === "Bronze" ? TIER_THRESHOLDS.Bronze : TIER_THRESHOLDS.Silver;
  const span = Math.max(1, target - base);
  const pct = Math.min(100, Math.max(0, Math.round(((pts - base) / span) * 100)));
  return {
    tier: currentTier,
    percent: pct,
    remaining: Math.max(0, target - pts),
    next: currentTier === "Bronze" ? "Silver" : "Gold",
  };
}

export function hasFreeDelivery(points, subtotal) {
  return tierForPoints(points) !== "Bronze";
}

export function hasExclusiveAccess(points) {
  return tierForPoints(points) === "Gold";
}

export function tierPerksFor(points) {
  return TIER_PERKS[tierForPoints(points)] || [];
}
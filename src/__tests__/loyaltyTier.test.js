import {
  TIERS,
  TIER_THRESHOLDS,
  tierForPoints,
  progressToNextTier,
  hasFreeDelivery,
  hasExclusiveAccess,
  tierPerksFor,
} from "../utils/loyaltyTier";

describe("loyaltyTier utils", () => {
  test("TIERS lists Bronze, Silver, Gold in order", () => {
    expect(TIERS).toEqual(["Bronze", "Silver", "Gold"]);
  });

  test("tier thresholds and tierForPoints mapping", () => {
    expect(TIER_THRESHOLDS.Bronze).toBe(0);
    expect(TIER_THRESHOLDS.Silver).toBe(500);
    expect(TIER_THRESHOLDS.Gold).toBe(2000);

    expect(tierForPoints(0)).toBe("Bronze");
    expect(tierForPoints(499)).toBe("Bronze");
    expect(tierForPoints(500)).toBe("Silver");
    expect(tierForPoints(1999)).toBe("Silver");
    expect(tierForPoints(2000)).toBe("Gold");
    expect(tierForPoints(99999)).toBe("Gold");
  });

  test("tierForPoints handles negative and non-numeric", () => {
    expect(tierForPoints(-100)).toBe("Bronze");
    expect(tierForPoints("abc")).toBe("Bronze");
    expect(tierForPoints(null)).toBe("Bronze");
    expect(tierForPoints(undefined)).toBe("Bronze");
    expect(tierForPoints(NaN)).toBe("Bronze");
  });

  test("tierForPoints floors fractional input", () => {
    expect(tierForPoints(499.9)).toBe("Bronze");
    expect(tierForPoints(500.4)).toBe("Silver");
  });

  test("progressToNextTier at Bronze boundary", () => {
    const p = progressToNextTier(0);
    expect(p.tier).toBe("Bronze");
    expect(p.next).toBe("Silver");
    expect(p.percent).toBe(0);
    expect(p.remaining).toBe(500);
  });

  test("progressToNextTier at midpoint of Bronze -> Silver", () => {
    const p = progressToNextTier(250);
    expect(p.tier).toBe("Bronze");
    expect(p.next).toBe("Silver");
    expect(p.percent).toBe(50);
    expect(p.remaining).toBe(250);
  });

  test("progressToNextTier for Silver tier", () => {
    const p = progressToNextTier(1250);
    expect(p.tier).toBe("Silver");
    expect(p.next).toBe("Gold");
    expect(p.percent).toBe(50);
    expect(p.remaining).toBe(750);
  });

  test("progressToNextTier caps at 100% at Gold tier", () => {
    const p = progressToNextTier(2500);
    expect(p.tier).toBe("Gold");
    expect(p.next).toBe(null);
    expect(p.percent).toBe(100);
    expect(p.remaining).toBe(0);
  });

  test("hasFreeDelivery returns true for Silver and Gold", () => {
    expect(hasFreeDelivery(0, 100)).toBe(false);
    expect(hasFreeDelivery(499, 100)).toBe(false);
    expect(hasFreeDelivery(500, 100)).toBe(true);
    expect(hasFreeDelivery(2000, 0)).toBe(true);
  });

  test("hasExclusiveAccess only Gold", () => {
    expect(hasExclusiveAccess(0)).toBe(false);
    expect(hasExclusiveAccess(499)).toBe(false);
    expect(hasExclusiveAccess(1500)).toBe(false);
    expect(hasExclusiveAccess(2000)).toBe(true);
    expect(hasExclusiveAccess(5000)).toBe(true);
  });

  test("tierPerksFor returns per-tier perks list", () => {
    expect(tierPerksFor(0)).toEqual([]);
    const silver = tierPerksFor(500);
    expect(silver.length).toBeGreaterThan(0);
    expect(silver.join(" ").toLowerCase()).toContain("delivery");
    const gold = tierPerksFor(2000);
    expect(gold.length).toBeGreaterThan(silver.length);
    expect(gold.join(" ").toLowerCase()).toContain("exclusive");
  });
});
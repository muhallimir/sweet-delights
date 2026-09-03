import {
  calcCateringQuote,
  CATERING_TIERS,
  CATERING_ADDONS,
} from "../components/Catering/QuoteCalculator";

describe("calcCateringQuote", () => {
  test("standard 50 guests, no addons -> 50 * 180 = 9000", () => {
    expect(calcCateringQuote({ guests: 50, tierId: "standard", addons: [] })).toBe(9000);
  });

  test("premium 50 guests, dessert bar -> 14000 + 2500 = 16500", () => {
    expect(calcCateringQuote({ guests: 50, tierId: "premium", addons: ["dessert"] })).toBe(16500);
  });

  test("deluxe 100 guests, lechon + drinks + crew -> 38000 + 6000 + 6000 + 1500 = 51500", () => {
    expect(
      calcCateringQuote({ guests: 100, tierId: "deluxe", addons: ["lechon", "drinks", "crew"] })
    ).toBe(51500);
  });

  test("per-head addon scales with guests", () => {
    const small = calcCateringQuote({ guests: 10, tierId: "standard", addons: ["drinks"] });
    const big = calcCateringQuote({ guests: 200, tierId: "standard", addons: ["drinks"] });
    expect(small).toBe(10 * 180 + 10 * 60);
    expect(big).toBe(200 * 180 + 200 * 60);
  });

  test("clamps guests to 10..1000", () => {
    expect(calcCateringQuote({ guests: 0, tierId: "standard", addons: [] })).toBe(10 * 180);
    expect(calcCateringQuote({ guests: 5, tierId: "standard", addons: [] })).toBe(10 * 180);
    expect(calcCateringQuote({ guests: 5000, tierId: "standard", addons: [] })).toBe(1000 * 180);
    expect(calcCateringQuote({ guests: "abc", tierId: "standard", addons: [] })).toBe(10 * 180);
  });

  test("falls back to premium tier when unknown", () => {
    expect(calcCateringQuote({ guests: 50, tierId: "bogus", addons: [] })).toBe(50 * 280);
  });

  test("unknown addons are ignored", () => {
    expect(calcCateringQuote({ guests: 50, tierId: "standard", addons: ["bogus"] })).toBe(50 * 180);
  });

  test("tiers are ordered by price ascending", () => {
    const prices = CATERING_TIERS.map((t) => t.price);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test("addons are well-formed", () => {
    CATERING_ADDONS.forEach((a) => {
      expect(a.id).toBeDefined();
      expect(a.label).toBeDefined();
      expect(typeof a.price).toBe("number");
      expect(typeof a.perHead).toBe("boolean");
    });
  });
});
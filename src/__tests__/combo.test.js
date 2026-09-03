import {
  COMBO_POOL,
  COMBO_DISCOUNT_PCT,
  comboWeekIndex,
  comboOfTheWeek,
  comboPrice,
  comboFinalPrice,
  comboSavings,
  comboLineItem,
} from "../utils/combo";
import { allProducts } from "../components/Products/data";

const CATALOG = allProducts;

describe("combo of the week utils", () => {
  test("COMBO_POOL has at least 3 curated bundles", () => {
    expect(COMBO_POOL.length).toBeGreaterThanOrEqual(3);
    COMBO_POOL.forEach((c) => {
      expect(c.id).toBeTruthy();
      expect(c.title).toBeTruthy();
      expect(Array.isArray(c.items)).toBe(true);
      expect(c.items.length).toBeGreaterThan(0);
    });
  });

  test("comboWeekIndex rotates weekly and is stable for same week", () => {
    const a = new Date("2026-09-03T10:00:00");
    const b = new Date("2026-09-09T22:00:00");
    expect(comboWeekIndex(a)).toBe(comboWeekIndex(b));
  });

  test("comboWeekIndex returns different combo after 7+ days", () => {
    const a = new Date("2026-09-03T10:00:00");
    const b = new Date("2026-09-11T10:00:00");
    expect(comboWeekIndex(a)).not.toBe(comboWeekIndex(b));
  });

  test("comboOfTheWeek returns a valid combo from the pool", () => {
    const c = comboOfTheWeek();
    expect(COMBO_POOL).toContain(c);
  });

  test("comboPrice sums qty * priceValue of items in catalog", () => {
    const combo = COMBO_POOL[0];
    const total = comboPrice(combo, CATALOG);
    const expected = combo.items.reduce((s, line) => {
      const product = CATALOG.find((p) => p.id === line.productId);
      return s + (product.priceValue || 0) * (line.qty || 1);
    }, 0);
    expect(total).toBe(expected);
    expect(total).toBeGreaterThan(0);
  });

  test("comboFinalPrice applies the configured discount", () => {
    const combo = COMBO_POOL[0];
    const original = comboPrice(combo, CATALOG);
    const final = comboFinalPrice(combo, CATALOG);
    expect(final).toBe(Math.round(original * (1 - COMBO_DISCOUNT_PCT / 100)));
    expect(final).toBeLessThan(original);
  });

  test("comboFinalPrice is 0 if combo is missing or empty catalog", () => {
    expect(comboFinalPrice(null, CATALOG)).toBe(0);
    expect(comboFinalPrice(COMBO_POOL[0], [])).toBe(0);
  });

  test("comboSavings equals original - final", () => {
    const combo = COMBO_POOL[1];
    const saved = comboSavings(combo, CATALOG);
    const original = comboPrice(combo, CATALOG);
    const final = comboFinalPrice(combo, CATALOG);
    expect(saved).toBe(original - final);
    expect(saved).toBeGreaterThan(0);
  });

  test("comboLineItem produces cart-ready entry with id and price", () => {
    const combo = COMBO_POOL[0];
    const item = comboLineItem(combo, CATALOG);
    expect(item.id).toMatch(/^combo-/);
    expect(item.name).toContain("(combo)");
    expect(item.qty).toBe(1);
    expect(item.priceValue).toBe(comboFinalPrice(combo, CATALOG));
    expect(item.price).toMatch(/^₱/);
    expect(item.comboId).toBe(combo.id);
  });

  test("comboLineItem handles unknown product gracefully", () => {
    const broken = {
      id: "combo-broken",
      title: "Broken combo",
      description: "n/a",
      items: [{ productId: "does-not-exist", qty: 1 }],
      badge: "",
    };
    const item = comboLineItem(broken, CATALOG);
    expect(item.priceValue).toBe(0);
  });
});
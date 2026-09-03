import {
  DEFAULT_MACRO_CALORIES,
  computeMacroPercents,
  macroConicGradient,
  macroTableRows,
  macroAriaLabel,
} from "../utils/macros";

describe("macro utils", () => {
  test("DEFAULT_MACRO_CALORIES has 4/4/9 per gram", () => {
    expect(DEFAULT_MACRO_CALORIES).toEqual({ carbs: 4, protein: 4, fat: 9 });
  });

  test("computeMacroPercents divides real grams", () => {
    const p = { nutrition: { carbsG: 50, proteinG: 25, fatG: 25 } };
    const r = computeMacroPercents(p);
    expect(r.carbs).toBe(50);
    expect(r.protein).toBe(25);
    expect(r.fat).toBe(25);
    expect(r.estimated).toBe(false);
  });

  test("computeMacroPercents sums to ~100 with rounding", () => {
    const p = { nutrition: { carbsG: 33, proteinG: 33, fatG: 33 } };
    const r = computeMacroPercents(p);
    const sum = r.carbs + r.protein + r.fat;
    expect(Math.abs(sum - 100)).toBeLessThanOrEqual(2);
  });

  test("computeMacroPercents falls back to estimated kcal when grams missing", () => {
    const p = { nutrition: { calories: 200 } };
    const r = computeMacroPercents(p);
    expect(r.estimated).toBe(true);
    const sum = r.carbs + r.protein + r.fat;
    expect(Math.abs(sum - 100)).toBeLessThanOrEqual(2);
    expect(r.carbs).toBeGreaterThan(0);
  });

  test("computeMacroPercents handles null and bad input", () => {
    expect(computeMacroPercents(null).carbs + computeMacroPercents(null).protein + computeMacroPercents(null).fat).toBeGreaterThan(0);
    expect(computeMacroPercents({}).estimated).toBe(true);
  });

  test("computeMacroPercents ignores negative input", () => {
    const p = { nutrition: { carbsG: -5, proteinG: 30, fatG: 20 } };
    const r = computeMacroPercents(p);
    expect(r.carbs).toBe(0);
    expect(r.protein + r.fat).toBeGreaterThan(0);
  });

  test("macroConicGradient builds valid CSS conic-gradient", () => {
    const g = macroConicGradient({ carbs: 50, protein: 25, fat: 25 });
    expect(g).toMatch(/^conic-gradient\(/);
    expect(g).toContain("deg");
  });

  test("macroConicGradient clamps and handles zero", () => {
    expect(macroConicGradient({ carbs: 0, protein: 0, fat: 0 })).toMatch(/conic-gradient/);
    expect(macroConicGradient({ carbs: 200, protein: -10, fat: 50 })).toMatch(/conic-gradient/);
  });

  test("macroTableRows has carbs, protein, fat in order", () => {
    const rows = macroTableRows({ carbs: 40, protein: 30, fat: 30, carbsG: 10, proteinG: 5, fatG: 5 });
    expect(rows.map((r) => r.key)).toEqual(["carbs", "protein", "fat"]);
    rows.forEach((r) => {
      expect(typeof r.label).toBe("string");
      expect(typeof r.color).toBe("string");
      expect(r.percent).toBeGreaterThanOrEqual(0);
    });
  });

  test("macroAriaLabel mentions all three macros and percentages", () => {
    const label = macroAriaLabel({ carbs: 50, protein: 25, fat: 25 });
    expect(label).toMatch(/carbs/i);
    expect(label).toMatch(/protein/i);
    expect(label).toMatch(/fat/i);
    expect(label).toMatch(/50%/);
  });
});
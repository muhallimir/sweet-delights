import {
  PROMO_CODES,
  validatePromo,
  calcPromo,
  normalizePromo,
  setStoredPromo,
  getStoredPromo,
  clearStoredPromo,
} from "../utils/promo";

describe("promo code validation", () => {
  beforeEach(() => {
    try {
      localStorage.removeItem("sd-promo");
    } catch (e) {}
  });

  test("rejects empty input", () => {
    const r = validatePromo("");
    expect(r.ok).toBe(false);
    expect(r.code).toBe("");
  });

  test("rejects unknown code", () => {
    const r = validatePromo("not-real");
    expect(r.ok).toBe(false);
    expect(r.code).toBe("NOT-REAL");
  });

  test("accepts SWEET10 percent", () => {
    const r = validatePromo("sweet10");
    expect(r.ok).toBe(true);
    expect(r.promo.type).toBe("percent");
    expect(r.promo.value).toBe(10);
  });

  test("accepts FREESHIP freeship code", () => {
    const r = validatePromo(" FREESHIP ");
    expect(r.ok).toBe(true);
    expect(r.promo.type).toBe("freeship");
  });

  test("accepts BDAY15 percent", () => {
    const r = validatePromo("bday15");
    expect(r.ok).toBe(true);
    expect(r.promo.value).toBe(15);
  });

  test("PROMO_CODES is non-empty and unique", () => {
    const codes = Object.keys(PROMO_CODES);
    expect(codes.length).toBeGreaterThan(0);
    expect(new Set(codes).size).toBe(codes.length);
  });
});

describe("calcPromo", () => {
  test("no code returns subtotal + fee unchanged", () => {
    const r = calcPromo(1000, 49, "");
    expect(r.discount).toBe(0);
    expect(r.fee).toBe(49);
    expect(r.total).toBe(1049);
  });

  test("percent code rounds discount to 2 decimals", () => {
    const r = calcPromo(1000, 49, "SWEET10");
    expect(r.discount).toBe(100);
    expect(r.total).toBe(949);
  });

  test("FREESHIP zeroes the fee", () => {
    const r = calcPromo(300, 49, "FREESHIP");
    expect(r.discount).toBe(0);
    expect(r.fee).toBe(0);
    expect(r.total).toBe(300);
  });

  test("zero subtotal does not apply promo", () => {
    const r = calcPromo(0, 49, "SWEET10");
    expect(r.discount).toBe(0);
    expect(r.total).toBe(49);
  });
});

describe("promo storage", () => {
  test("setStoredPromo normalizes and round-trips", () => {
    setStoredPromo("  sweet10 ");
    expect(getStoredPromo()).toBe("SWEET10");
  });

  test("clearStoredPromo wipes storage", () => {
    setStoredPromo("SWEET10");
    clearStoredPromo();
    expect(getStoredPromo()).toBe("");
  });

  test("invalid stored value returns empty string", () => {
    try {
      localStorage.setItem("sd-promo", "WHATEVER");
    } catch (e) {}
    expect(getStoredPromo()).toBe("");
  });

  test("normalizePromo uppercases and trims", () => {
    expect(normalizePromo("  abc ")).toBe("ABC");
    expect(normalizePromo(null)).toBe("");
  });
});
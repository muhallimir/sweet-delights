import {
  formatPrice,
  convertPhp,
  getCurrency,
  setCurrency,
  PHP_PER_USD,
} from "../utils/currency";

describe("currency util", () => {
  beforeEach(() => {
    try {
      localStorage.removeItem("sd-currency");
    } catch (e) {}
  });

  test("formatPrice in PHP shows peso prefix and 2 decimals", () => {
    expect(formatPrice(35, "PHP")).toMatch(/^₱35\.00$/);
    expect(formatPrice(1234.5, "PHP")).toBe("₱1,234.50");
  });

  test("formatPrice in USD converts via PHP_PER_USD", () => {
    const out = formatPrice(PHP_PER_USD * 10, "USD");
    expect(out).toMatch(/^\$/);
    expect(out).toBe("$10.00");
  });

  test("formatPrice defaults to PHP", () => {
    expect(formatPrice(99)).toBe("₱99.00");
  });

  test("convertPhp divides by PHP_PER_USD when USD", () => {
    expect(convertPhp(PHP_PER_USD, "USD")).toBe(1);
    expect(convertPhp(0, "USD")).toBe(0);
    expect(convertPhp(100, "PHP")).toBe(100);
  });

  test("getCurrency falls back to PHP", () => {
    expect(getCurrency()).toBe("PHP");
  });

  test("setCurrency toggles stored value and emits event", () => {
    const handler = jest.fn();
    window.addEventListener("sd:currency", handler);
    setCurrency("USD");
    expect(getCurrency()).toBe("USD");
    expect(handler).toHaveBeenCalled();
    window.removeEventListener("sd:currency", handler);
    setCurrency("PHP");
    expect(getCurrency()).toBe("PHP");
  });

  test("setCurrency ignores garbage", () => {
    setCurrency("EUR");
    expect(getCurrency()).toBe("PHP");
  });
});
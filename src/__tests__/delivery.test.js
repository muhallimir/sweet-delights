import { estimateForPostcode, getStoredPostcode, setStoredPostcode } from "../utils/delivery";

describe("estimateForPostcode delivery zones", () => {
  test("rejects non-4-digit", () => {
    expect(estimateForPostcode("").ok).toBe(false);
    expect(estimateForPostcode("123").ok).toBe(false);
    expect(estimateForPostcode("12345").ok).toBe(false);
    expect(estimateForPostcode("abcd").ok).toBe(false);
  });

  test("Metro Manila postcodes 1000-1799 cost 49, ETA 45-60 min", () => {
    ["1000", "1100", "1500", "1700"].forEach((pc) => {
      const r = estimateForPostcode(pc, 100);
      expect(r.ok).toBe(true);
      expect(r.zone).toBe("Metro Manila");
      expect(r.fee).toBe(49);
      expect(r.eta).toBe("45-60 min");
    });
  });

  test("Calabarzon 4xxx cost 79, ETA 1-2 hours", () => {
    const r = estimateForPostcode("4110", 100);
    expect(r.zone).toBe("Calabarzon");
    expect(r.fee).toBe(79);
    expect(r.eta).toBe("1-2 hours");
  });

  test("Provincial (other 4-digit) defaults to 129", () => {
    const r = estimateForPostcode("8000", 100);
    expect(r.zone).toBe("Provincial");
    expect(r.fee).toBe(129);
    expect(r.eta).toBe("1-2 days");
  });

  test("Free delivery over ₱500", () => {
    const r = estimateForPostcode("1000", 800);
    expect(r.fee).toBe(0);
    expect(r.free).toBe(true);
  });

  test("Stores and reads postcode", () => {
    setStoredPostcode("1100");
    expect(getStoredPostcode()).toBe("1100");
    setStoredPostcode("");
    expect(getStoredPostcode()).toBe("");
  });
});
import { makeOrderId, validate } from "../components/Checkout/CheckoutPage";
import { stageForId, STAGES } from "../components/Track/TrackPage";

describe("makeOrderId format", () => {
  test("matches SD-YYYYMMDD-XXXX with 4-char suffix", () => {
    const id = makeOrderId();
    expect(id).toMatch(/^SD-\d{8}-[A-Z0-9]{4}$/);
  });

  test("contains today's date prefix", () => {
    const d = new Date();
    const expectedDate = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
    const id = makeOrderId();
    expect(id).toContain(expectedDate);
  });

  test("two calls produce different ids (high probability)", () => {
    const ids = new Set();
    for (let i = 0; i < 25; i++) ids.add(makeOrderId());
    expect(ids.size).toBeGreaterThan(20);
  });
});

describe("checkout validation", () => {
  test("requires name, phone, address, payment", () => {
    const e = validate({ name: "", phone: "", address: "", payment: "" });
    expect(e.name).toBeDefined();
    expect(e.phone).toBeDefined();
    expect(e.address).toBeDefined();
    expect(e.payment).toBeDefined();
  });

  test("accepts valid PH phone variants", () => {
    expect(validate({ name: "Maria Santos", phone: "09171234567", address: "House 1 Main Street", payment: "Cash on Delivery" })).toEqual({});
    expect(validate({ name: "Maria Santos", phone: "+639171234567", address: "House 1 Main Street", payment: "Cash on Delivery" })).toEqual({});
    expect(validate({ name: "Maria Santos", phone: "9171234567", address: "House 1 Main Street", payment: "Cash on Delivery" })).toEqual({});
  });

  test("rejects short phone", () => {
    const e = validate({ name: "Maria Santos", phone: "123", address: "House 1 Main Street", payment: "Cash on Delivery" });
    expect(e.phone).toBeDefined();
  });

  test("rejects short address", () => {
    const e = validate({ name: "Maria Santos", phone: "09171234567", address: "x", payment: "Cash on Delivery" });
    expect(e.address).toBeDefined();
  });

  test("warns on too-short GCash reference", () => {
    const e = validate({ name: "Maria Santos", phone: "09171234567", address: "House 1 Main Street", payment: "GCash", gcashRef: "12" });
    expect(e.gcashRef).toBeDefined();
  });

  test("accepts valid GCash reference", () => {
    const e = validate({ name: "Maria Santos", phone: "09171234567", address: "House 1 Main Street", payment: "GCash", gcashRef: "1234 567 890" });
    expect(e.gcashRef).toBeUndefined();
  });
});

describe("stageForId tracking timeline", () => {
  test("returns 0 placed within 10 minutes", () => {
    expect(stageForId("SD-20240101-ABCD", new Date().toISOString())).toBe(0);
  });

  test("returns 1 baking within 30 minutes", () => {
    const d = new Date(Date.now() - 20 * 60 * 1000).toISOString();
    expect(stageForId("SD-20240101-ABCD", d)).toBe(1);
  });

  test("returns 2 out for delivery within 90 minutes", () => {
    const d = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    expect(stageForId("SD-20240101-ABCD", d)).toBe(2);
  });

  test("returns 3 delivered after 90 minutes", () => {
    const d = new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString();
    expect(stageForId("SD-20240101-ABCD", d)).toBe(3);
  });

  test("falls back to hash when no orderDate", () => {
    const s = stageForId("SD-20240101-ABCD", null);
    expect(s).toBeGreaterThanOrEqual(0);
    expect(s).toBeLessThan(STAGES.length);
  });

  test("STAGES has exactly 4 entries in expected order", () => {
    expect(STAGES).toEqual(["placed", "baking", "out for delivery", "delivered"]);
  });
});
import {
  NOTE_MAX,
  BAKER_NOTE_MAX,
  validateOrderNotes,
  normalizeNotes,
} from "../utils/orderNotes";

describe("order notes utils", () => {
  test("NOTE_MAX and BAKER_NOTE_MAX are both 200", () => {
    expect(NOTE_MAX).toBe(200);
    expect(BAKER_NOTE_MAX).toBe(200);
  });

  test("validateOrderNotes accepts short notes", () => {
    const errs = validateOrderNotes({ driverNote: "Gate code 1234", bakerNote: "Less sugar" });
    expect(Object.keys(errs)).toHaveLength(0);
  });

  test("validateOrderNotes accepts empty notes", () => {
    const errs = validateOrderNotes({ driverNote: "", bakerNote: "" });
    expect(Object.keys(errs)).toHaveLength(0);
  });

  test("validateOrderNotes accepts null notes", () => {
    const errs = validateOrderNotes({ driverNote: null, bakerNote: null });
    expect(Object.keys(errs)).toHaveLength(0);
  });

  test("validateOrderNotes rejects overlong driver note", () => {
    const long = "a".repeat(NOTE_MAX + 1);
    const errs = validateOrderNotes({ driverNote: long, bakerNote: "" });
    expect(errs.driverNote).toBeTruthy();
    expect(errs.driverNote).toMatch(/200/);
  });

  test("validateOrderNotes rejects overlong baker note", () => {
    const long = "a".repeat(BAKER_NOTE_MAX + 1);
    const errs = validateOrderNotes({ driverNote: "", bakerNote: long });
    expect(errs.bakerNote).toBeTruthy();
  });

  test("validateOrderNotes allows exactly at the limit", () => {
    const exact = "a".repeat(NOTE_MAX);
    const errs = validateOrderNotes({ driverNote: exact, bakerNote: exact });
    expect(Object.keys(errs)).toHaveLength(0);
  });

  test("normalizeNotes trims and caps at max", () => {
    const tooLong = "x".repeat(NOTE_MAX + 50);
    const r = normalizeNotes(`  ${tooLong}  `, `  short  `);
    expect(r.driverNote.length).toBeLessThanOrEqual(NOTE_MAX);
    expect(r.bakerNote).toBe("short");
  });

  test("normalizeNotes handles undefined and null", () => {
    const r = normalizeNotes(undefined, null);
    expect(r.driverNote).toBe("");
    expect(r.bakerNote).toBe("");
  });
});
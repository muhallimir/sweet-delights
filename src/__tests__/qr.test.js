import {
  utf8Bytes,
  pickVersion,
  getCapacity,
  getModules,
  generateQR,
  renderText,
  encodeData,
  EC_BITS,
} from "../utils/qr";

describe("qr utils", () => {
  test("utf8Bytes encodes ASCII", () => {
    expect(utf8Bytes("hi")).toEqual([104, 105]);
  });

  test("utf8Bytes encodes 2-byte chars", () => {
    const out = utf8Bytes("é");
    expect(out.length).toBe(2);
    expect(out[0]).toBe(0xc3);
    expect(out[1]).toBe(0xa9);
  });

  test("utf8Bytes encodes 3-byte chars", () => {
    const out = utf8Bytes("中");
    expect(out.length).toBe(3);
  });

  test("utf8Bytes encodes surrogate pairs (emoji)", () => {
    const out = utf8Bytes("🎉");
    expect(out.length).toBe(4);
  });

  test("pickVersion picks smallest that fits", () => {
    expect(pickVersion(5, "M")).toBe(1);
    expect(pickVersion(20, "L")).toBe(2);
  });

  test("pickVersion throws when data too long for 1-10", () => {
    expect(pickVersion(500, "L")).toBe(-1);
  });

  test("getCapacity returns 0 for invalid version", () => {
    expect(getCapacity(0, "L")).toBe(0);
    expect(getCapacity(11, "L")).toBe(0);
  });

  test("getModules returns expected sizes", () => {
    expect(getModules(1)).toBe(21);
    expect(getModules(2)).toBe(25);
    expect(getModules(10)).toBe(57);
  });

  test("EC_BITS has L=1, M=0, Q=3, H=2", () => {
    expect(EC_BITS).toEqual({ L: 1, M: 0, Q: 3, H: 2 });
  });

  test("encodeData produces a Uint8Array of correct length", () => {
    const data = encodeData("Hello", 1, "L");
    expect(data.length).toBe(19);
  });

  test("encodeData pads terminator + padding", () => {
    const data = encodeData("", 1, "L");
    expect(data.length).toBe(19);
    // First nibble holds MODE_BYTE = 0b0100 in high 4 bits -> 0x40
    expect(data[0]).toBe(0x40);
  });

  test("encodeData throws on too-long data", () => {
    expect(() => encodeData("x".repeat(300), 1, "L")).toThrow();
  });

  test("generateQR returns correct size matrix", () => {
    const qr = generateQR("Sweet Delights", { ec: "M" });
    expect(qr.modules.length).toBe(qr.size);
    qr.modules.forEach((row) => {
      expect(row.length).toBe(qr.size);
    });
    expect(qr.version).toBeGreaterThanOrEqual(1);
    expect(qr.mask).toBeGreaterThanOrEqual(0);
    expect(qr.mask).toBeLessThanOrEqual(7);
  });

  test("generateQR places finder patterns at three corners", () => {
    const qr = generateQR("hi", { ec: "L" });
    // Top-left finder: top-left 7x7 should have specific 1 pattern
    const tl = qr.modules[0][0];
    expect(typeof tl).toBe("number");
    // Sample some positions: center of finder is at (3,3)
    expect(qr.modules[3][3]).toBe(1);
    // Outer ring
    expect(qr.modules[0][0]).toBe(1);
    expect(qr.modules[0][6]).toBe(1);
    expect(qr.modules[6][0]).toBe(1);
    expect(qr.modules[6][6]).toBe(1);
    // Center should NOT be 1 in the middle of outer area
    // top-right finder at (0, size-7)
    expect(qr.modules[3][qr.size - 4]).toBe(1);
    // bottom-left at (size-7, 0)
    expect(qr.modules[qr.size - 4][3]).toBe(1);
  });

  test("generateQR with empty string still produces a valid QR", () => {
    const qr = generateQR("", { ec: "M" });
    expect(qr.size).toBeGreaterThan(0);
  });

  test("generateQR is deterministic for same input", () => {
    const a = generateQR("SD-20240101-ABCD", { ec: "M" });
    const b = generateQR("SD-20240101-ABCD", { ec: "M" });
    expect(JSON.stringify(a.modules)).toBe(JSON.stringify(b.modules));
  });

  test("generateQR is snapshot-friendly (shape stable)", () => {
    const qr = generateQR("SD-20240101-ABCD", { ec: "M" });
    const flat = qr.modules.map((r) => r.join("")).join("\n");
    expect(flat.split("\n").length).toBe(qr.size);
    expect(flat).toMatch(/^[01\n]+$/);
  });

  test("renderText produces non-empty output", () => {
    const qr = generateQR("x", { ec: "L" });
    const text = renderText(qr);
    expect(text).toContain("██");
    expect(text.split("\n").length).toBe(qr.size);
  });

  test("generateQR handles moderate-length text", () => {
    const text = "Order SD-20240101-ABCD total ₱500.00";
    const qr = generateQR(text, { ec: "M" });
    expect(qr.size).toBeGreaterThan(0);
  });

  test("generateQR picks a higher version for longer text", () => {
    const short = generateQR("hi", { ec: "L" });
    const long = generateQR("x".repeat(80), { ec: "L" });
    expect(long.version).toBeGreaterThan(short.version);
  });
});
import {
  PREORDER_TIMES,
  nextDayISO,
  buildScheduledAt,
  countdownParts,
  formatScheduledFor,
} from "../utils/preorder";

describe("preorder utils", () => {
  test("PREORDER_TIMES covers morning and afternoon", () => {
    expect(PREORDER_TIMES.length).toBeGreaterThan(0);
    expect(PREORDER_TIMES).toContain("09:00");
    expect(PREORDER_TIMES[PREORDER_TIMES.length - 1]).toMatch(/1[6-9]|2[0-1]/);
  });

  test("nextDayISO returns tomorrow's date as YYYY-MM-DD", () => {
    const now = new Date("2026-09-03T10:00:00");
    const out = nextDayISO(now);
    expect(out).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    const parts = out.split("-").map(Number);
    const local = new Date(parts[0], parts[1] - 1, parts[2]);
    const todayLocal = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const diff = Math.round((local - todayLocal) / 86400000);
    expect(diff).toBe(1);
  });

  test("buildScheduledAt builds a future ISO from date+time", () => {
    const now = new Date("2026-09-03T08:00:00");
    const iso = buildScheduledAt("2026-09-04", "10:00", now);
    expect(typeof iso).toBe("string");
    expect(iso).toMatch(/2026-09-04T/);
    expect(new Date(iso).getTime()).toBeGreaterThan(now.getTime());
  });

  test("buildScheduledAt returns null for past or invalid", () => {
    const now = new Date("2026-09-03T12:00:00");
    expect(buildScheduledAt("2026-09-03", "10:00", now)).toBe(null);
    expect(buildScheduledAt(null, "10:00", now)).toBe(null);
    expect(buildScheduledAt("2026-09-04", null, now)).toBe(null);
    expect(buildScheduledAt("2026-09-04", "bad", now)).toBe(null);
  });

  test("countdownParts reports done when target passed", () => {
    const past = new Date(Date.now() - 10000).toISOString();
    const cd = countdownParts(past);
    expect(cd.done).toBe(true);
    expect(cd.label).toBe("Ready now");
  });

  test("countdownParts for ~2 hours away", () => {
    const future = new Date(Date.now() + 2 * 3600 * 1000 + 30 * 60 * 1000).toISOString();
    const cd = countdownParts(future);
    expect(cd.done).toBe(false);
    expect(cd.hours).toBeGreaterThanOrEqual(2);
    expect(cd.hours).toBeLessThanOrEqual(3);
    expect(cd.label).toMatch(/h/);
  });

  test("countdownParts for ~3 days away", () => {
    const future = new Date(Date.now() + 3 * 86400 * 1000 + 4 * 3600 * 1000).toISOString();
    const cd = countdownParts(future);
    expect(cd.done).toBe(false);
    expect(cd.days).toBe(3);
    expect(cd.label).toMatch(/^3d/);
  });

  test("countdownParts for ~45 seconds away shows m+s", () => {
    const future = new Date(Date.now() + 45 * 1000).toISOString();
    const cd = countdownParts(future);
    expect(cd.done).toBe(false);
    expect(cd.label).toMatch(/0m/);
    expect(cd.label).toMatch(/\d+s/);
  });

  test("formatScheduledFor handles valid and invalid dates", () => {
    const out = formatScheduledFor("2026-09-04T10:00:00");
    expect(typeof out).toBe("string");
    expect(out.length).toBeGreaterThan(5);
    expect(formatScheduledFor(null)).toBe("");
    expect(formatScheduledFor("not a date")).toBe("");
  });
});
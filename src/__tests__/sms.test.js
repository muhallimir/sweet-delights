import {
  SMS_STAGES,
  normalizePhone,
  validatePhone,
  getSmsSubs,
  addSmsSub,
  removeSmsSub,
  smsStatusFor,
  setSmsStatus,
  tickSmsSubs,
  stageMessage,
} from "../utils/sms";

describe("sms utils", () => {
  beforeEach(() => {
    try {
      localStorage.removeItem("sd-sms-subs");
      localStorage.removeItem("sd-sms-status");
    } catch (e) {}
  });

  test("SMS_STAGES has 4 ordered entries", () => {
    expect(SMS_STAGES).toEqual(["placed", "baking", "out for delivery", "delivered"]);
  });

  test("normalizePhone strips spaces and dashes", () => {
    expect(normalizePhone("0917 123 4567")).toBe("09171234567");
    expect(normalizePhone("0917-123-4567")).toBe("09171234567");
    expect(normalizePhone("  09171234567  ")).toBe("09171234567");
  });

  test("validatePhone accepts common PH formats", () => {
    expect(validatePhone("09171234567")).toBe("");
    expect(validatePhone("+639171234567")).toBe("");
    expect(validatePhone("9171234567")).toBe("");
  });

  test("validatePhone rejects empty and bad", () => {
    expect(validatePhone("")).toMatch(/required/i);
    expect(validatePhone("123")).toMatch(/valid/i);
    expect(validatePhone("abcdefg")).toMatch(/valid/i);
  });

  test("addSmsSub stores normalized phone", () => {
    const sub = addSmsSub({ orderId: "SD-1", phone: "0917 123 4567" });
    expect(sub.phone).toBe("09171234567");
    expect(sub.stage).toBe(0);
    expect(getSmsSubs()).toHaveLength(1);
  });

  test("addSmsSub replaces existing sub for same order", () => {
    addSmsSub({ orderId: "SD-1", phone: "09171234567" });
    addSmsSub({ orderId: "SD-1", phone: "09181112222" });
    expect(getSmsSubs()).toHaveLength(1);
    expect(getSmsSubs()[0].phone).toBe("09181112222");
  });

  test("removeSmsSub removes by orderId", () => {
    addSmsSub({ orderId: "SD-1", phone: "09171234567" });
    removeSmsSub("SD-1");
    expect(getSmsSubs()).toHaveLength(0);
  });

  test("smsStatusFor round-trips via setSmsStatus", () => {
    expect(smsStatusFor("SD-1")).toBe(null);
    setSmsStatus("SD-1", 2);
    expect(smsStatusFor("SD-1")).toBe(2);
  });

  test("tickSmsSubs advances stage over time", () => {
    addSmsSub({ orderId: "SD-1", phone: "09171234567" });
    const now = Date.now();
    const past = now - 1000 * 60 * 30;
    const subs = getSmsSubs();
    subs[0].startedAt = new Date(past).toISOString();
    localStorage.setItem("sd-sms-subs", JSON.stringify(subs));
    const updated = tickSmsSubs(now);
    expect(updated[0].stage).toBeGreaterThanOrEqual(1);
  });

  test("tickSmsSubs returns at stage 3 after 90 minutes", () => {
    addSmsSub({ orderId: "SD-1", phone: "09171234567" });
    const subs = getSmsSubs();
    subs[0].startedAt = new Date(Date.now() - 1000 * 60 * 95).toISOString();
    localStorage.setItem("sd-sms-subs", JSON.stringify(subs));
    const updated = tickSmsSubs(Date.now());
    expect(updated[0].stage).toBe(3);
  });

  test("stageMessage returns correct copy for each stage", () => {
    expect(stageMessage("SD-1234ABCD", 0)).toMatch(/order/i);
    expect(stageMessage("SD-1234ABCD", 1)).toMatch(/baking/i);
    expect(stageMessage("SD-1234ABCD", 2)).toMatch(/delivery/i);
    expect(stageMessage("SD-1234ABCD", 3)).toMatch(/delivered/i);
    expect(stageMessage("SD-1234ABCD", 99)).toBe("");
  });
});
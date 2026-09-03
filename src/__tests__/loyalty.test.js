import {
  LOYALTY_COST,
  LOYALTY_VALUE,
  getLoyaltyBalance,
  setLoyaltyBalance,
  addLoyaltyPoints,
  spendLoyaltyPoints,
  calcLoyalty,
  earnForTotal,
} from "../utils/loyalty";

describe("loyalty utils", () => {
  beforeEach(() => {
    try {
      localStorage.removeItem("sd-loyalty-points");
      localStorage.removeItem("sd-loyalty-redeem");
    } catch (e) {}
  });

  test("defaults to 0", () => {
    expect(getLoyaltyBalance()).toBe(0);
  });

  test("setLoyaltyBalance stores non-negative integer", () => {
    setLoyaltyBalance(250);
    expect(getLoyaltyBalance()).toBe(250);
    setLoyaltyBalance(-10);
    expect(getLoyaltyBalance()).toBe(0);
    setLoyaltyBalance(3.7);
    expect(getLoyaltyBalance()).toBe(3);
  });

  test("addLoyaltyPoints accumulates and floors", () => {
    addLoyaltyPoints(120);
    addLoyaltyPoints(50.9);
    expect(getLoyaltyBalance()).toBe(170);
  });

  test("spendLoyaltyPoints clamps at 0", () => {
    setLoyaltyBalance(50);
    expect(spendLoyaltyPoints(200)).toBe(0);
    expect(getLoyaltyBalance()).toBe(0);
  });

  test("calcLoyalty requires redeem + enough balance + positive subtotal", () => {
    expect(calcLoyalty(500, LOYALTY_COST, false)).toEqual({ discount: 0, applied: false });
    expect(calcLoyalty(500, LOYALTY_COST - 1, true).applied).toBe(false);
    expect(calcLoyalty(0, LOYALTY_COST, true).applied).toBe(false);
    const r = calcLoyalty(500, LOYALTY_COST, true);
    expect(r.applied).toBe(true);
    expect(r.discount).toBe(LOYALTY_VALUE);
  });

  test("calcLoyalty caps discount at remaining subtotal", () => {
    const r = calcLoyalty(100, LOYALTY_COST, true);
    expect(r.discount).toBe(100);
  });

  test("earnForTotal floors positive totals", () => {
    expect(earnForTotal(0)).toBe(0);
    expect(earnForTotal(45.9)).toBe(45);
    expect(earnForTotal(120)).toBe(120);
    expect(earnForTotal(-10)).toBe(0);
    expect(earnForTotal(NaN)).toBe(0);
  });

  test("100 pts = ₱250 off", () => {
    expect(LOYALTY_COST).toBe(100);
    expect(LOYALTY_VALUE).toBe(250);
  });
});
import {
  GIFT_CARD_DENOMINATIONS,
  getGiftCards,
  purchaseGiftCard,
  findGiftCard,
  redeemGiftCard,
  validateGiftCardForm,
} from "../utils/giftCards";

describe("gift cards utils", () => {
  beforeEach(() => {
    try {
      localStorage.removeItem("sd-gift-cards");
    } catch (e) {}
  });

  test("denominations include 500, 1000, 2000", () => {
    expect(GIFT_CARD_DENOMINATIONS).toContain(500);
    expect(GIFT_CARD_DENOMINATIONS).toContain(1000);
    expect(GIFT_CARD_DENOMINATIONS).toContain(2000);
  });

  test("getGiftCards returns [] when empty", () => {
    expect(getGiftCards()).toEqual([]);
  });

  test("purchaseGiftCard stores a card with code + balance", () => {
    const card = purchaseGiftCard({
      amount: 1000,
      recipientName: "Maria",
      recipientEmail: "maria@test.com",
      message: "Enjoy!",
    });
    expect(card.code).toMatch(/^GIFT-/);
    expect(card.balance).toBe(1000);
    expect(card.initialBalance).toBe(1000);
    expect(getGiftCards()).toHaveLength(1);
  });

  test("purchaseGiftCard falls back to first denomination for invalid amount", () => {
    const card = purchaseGiftCard({
      amount: 999,
      recipientName: "X",
      recipientEmail: "x@y.com",
    });
    expect(card.initialBalance).toBe(GIFT_CARD_DENOMINATIONS[0]);
  });

  test("purchaseGiftCard trims message to 200 chars", () => {
    const long = "a".repeat(250);
    const card = purchaseGiftCard({
      amount: 500,
      recipientName: "X",
      recipientEmail: "x@y.com",
      message: long,
    });
    expect(card.message.length).toBe(200);
  });

  test("findGiftCard matches by code case-insensitive", () => {
    const card = purchaseGiftCard({
      amount: 500,
      recipientName: "X",
      recipientEmail: "x@y.com",
    });
    expect(findGiftCard(card.code.toLowerCase())).not.toBeNull();
    expect(findGiftCard("nope")).toBeNull();
  });

  test("redeemGiftCard deducts from balance", () => {
    const card = purchaseGiftCard({
      amount: 1000,
      recipientName: "X",
      recipientEmail: "x@y.com",
    });
    const r = redeemGiftCard(card.code, 250);
    expect(r.ok).toBe(true);
    expect(r.applied).toBe(250);
    expect(r.remaining).toBe(750);
    const fresh = findGiftCard(card.code);
    expect(fresh.balance).toBe(750);
  });

  test("redeemGiftCard caps at remaining balance", () => {
    const card = purchaseGiftCard({
      amount: 500,
      recipientName: "X",
      recipientEmail: "x@y.com",
    });
    const r = redeemGiftCard(card.code, 9999);
    expect(r.applied).toBe(500);
    expect(r.remaining).toBe(0);
  });

  test("redeemGiftCard rejects unknown / empty / zero", () => {
    expect(redeemGiftCard("nope", 100).ok).toBe(false);
    const card = purchaseGiftCard({
      amount: 100,
      recipientName: "X",
      recipientEmail: "x@y.com",
    });
    expect(redeemGiftCard(card.code, 0).ok).toBe(false);
    expect(redeemGiftCard(card.code, -10).ok).toBe(false);
  });

  test("validateGiftCardForm requires name and email", () => {
    const errs = validateGiftCardForm({
      amount: 1000,
      recipientName: "",
      recipientEmail: "bad",
      message: "",
    });
    expect(errs.recipientName).toBeTruthy();
    expect(errs.recipientEmail).toBeTruthy();
  });

  test("validateGiftCardForm accepts valid input", () => {
    const errs = validateGiftCardForm({
      amount: 1000,
      recipientName: "Maria",
      recipientEmail: "maria@test.com",
      message: "Hi",
    });
    expect(Object.keys(errs)).toHaveLength(0);
  });

  test("validateGiftCardForm rejects bad amount", () => {
    const errs = validateGiftCardForm({
      amount: 99,
      recipientName: "Maria",
      recipientEmail: "maria@test.com",
    });
    expect(errs.amount).toBeTruthy();
  });
});
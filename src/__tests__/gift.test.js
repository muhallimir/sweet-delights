import { getGift, setGift, GIFT_WRAP_PRICE } from "../utils/gift";

describe("gift options", () => {
  beforeEach(() => {
    try {
      localStorage.removeItem("sd-gift");
    } catch (e) {}
  });

  test("GIFT_WRAP_PRICE is 49", () => {
    expect(GIFT_WRAP_PRICE).toBe(49);
  });

  test("default gift has wrap=false, empty message, receipt=false", () => {
    expect(getGift()).toEqual({ wrap: false, message: "", receipt: false });
  });

  test("setGift round-trips full payload", () => {
    setGift({ wrap: true, message: "Happy birthday!", receipt: true });
    const g = getGift();
    expect(g.wrap).toBe(true);
    expect(g.message).toBe("Happy birthday!");
    expect(g.receipt).toBe(true);
  });

  test("garbage in storage yields safe defaults", () => {
    try {
      localStorage.setItem("sd-gift", "{not json");
    } catch (e) {}
    expect(getGift()).toEqual({ wrap: false, message: "", receipt: false });
  });
});
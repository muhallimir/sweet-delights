import { cartReducer, toCartItem } from "../context/CartContext";
import { cartCount, cartSubtotal, parsePriceToNumber, formatPeso, deliveryFee } from "../utils/format";

const PRODUCTS = {
  flan: {
    id: "leche-flan",
    name: "Creamy Leche Flan 1tub",
    price: "₱35.00",
    priceValue: 35,
    img: "/x.jpg",
    desc: "...",
  },
  spag: {
    id: "spaghetti",
    name: "Homemade Sweet Spaghetti",
    price: "₱95.00",
    priceValue: 95,
    img: "/x.jpg",
    desc: "...",
  },
};

describe("cartReducer + cart math", () => {
  test("ADD appends new line items", () => {
    const s0 = [];
    const s1 = cartReducer(s0, { type: "ADD", product: PRODUCTS.flan, qty: 2 });
    expect(s1).toHaveLength(1);
    expect(s1[0].qty).toBe(2);
    expect(s1[0].priceValue).toBe(35);
  });

  test("ADD merges qty for existing item and caps at 99", () => {
    let s = cartReducer([], { type: "ADD", product: PRODUCTS.flan, qty: 1 });
    s = cartReducer(s, { type: "ADD", product: PRODUCTS.flan, qty: 50 });
    expect(s[0].qty).toBe(51);
    s = cartReducer(s, { type: "ADD", product: PRODUCTS.flan, qty: 99 });
    expect(s[0].qty).toBe(99);
  });

  test("ADD clamps to qty between 1 and 99", () => {
    const s = cartReducer([], { type: "ADD", product: PRODUCTS.flan, qty: 0 });
    expect(s[0].qty).toBe(1);
    const s2 = cartReducer([], { type: "ADD", product: PRODUCTS.flan, qty: 500 });
    expect(s2[0].qty).toBe(99);
  });

  test("ADD ignores product with no id", () => {
    const s = cartReducer([], { type: "ADD", product: { name: "x" }, qty: 1 });
    expect(s).toEqual([]);
  });

  test("REMOVE drops line item", () => {
    const s0 = cartReducer([], { type: "ADD", product: PRODUCTS.flan });
    const s1 = cartReducer(s0, { type: "REMOVE", id: "leche-flan" });
    expect(s1).toEqual([]);
  });

  test("SET_QTY updates and removes on <=0", () => {
    const s0 = cartReducer([], { type: "ADD", product: PRODUCTS.flan });
    const s1 = cartReducer(s0, { type: "SET_QTY", id: "leche-flan", qty: 5 });
    expect(s1[0].qty).toBe(5);
    const s2 = cartReducer(s1, { type: "SET_QTY", id: "leche-flan", qty: 0 });
    expect(s2).toEqual([]);
    const s3 = cartReducer(s1, { type: "SET_QTY", id: "leche-flan", qty: "abc" });
    expect(s3).toEqual([]);
  });

  test("INCREMENT and DECREMENT work", () => {
    let s = cartReducer([], { type: "ADD", product: PRODUCTS.flan });
    s = cartReducer(s, { type: "INCREMENT", id: "leche-flan" });
    s = cartReducer(s, { type: "INCREMENT", id: "leche-flan" });
    expect(s[0].qty).toBe(3);
    s = cartReducer(s, { type: "DECREMENT", id: "leche-flan" });
    expect(s[0].qty).toBe(2);
  });

  test("DECREMENT at qty 1 removes the item", () => {
    let s = cartReducer([], { type: "ADD", product: PRODUCTS.flan });
    s = cartReducer(s, { type: "DECREMENT", id: "leche-flan" });
    expect(s).toEqual([]);
  });

  test("CLEAR empties cart", () => {
    let s = cartReducer([], { type: "ADD", product: PRODUCTS.flan });
    s = cartReducer(s, { type: "ADD", product: PRODUCTS.spag });
    expect(s).toHaveLength(2);
    s = cartReducer(s, { type: "CLEAR" });
    expect(s).toEqual([]);
  });

  test("HYDRATE replaces with valid array", () => {
    const next = [{ id: "x", qty: 1 }];
    expect(cartReducer([], { type: "HYDRATE", items: next })).toEqual(next);
    expect(cartReducer([{ id: "y" }], { type: "HYDRATE", items: "nope" })).toEqual([
      { id: "y" },
    ]);
  });

  test("unknown action returns state unchanged", () => {
    expect(cartReducer([], { type: "WHATEVER" })).toEqual([]);
  });

  test("cartCount sums qty", () => {
    const items = [
      { qty: 2 },
      { qty: 3 },
      { qty: 0 },
      {},
    ];
    expect(cartCount(items)).toBe(5);
  });

  test("cartSubtotal sums qty * priceValue", () => {
    const items = [
      { qty: 2, priceValue: 35 },
      { qty: 1, priceValue: 95 },
      { qty: 3, priceValue: 10 },
      { qty: 2, price: "₱12.00" },
    ];
    expect(cartSubtotal(items)).toBe(70 + 95 + 30 + 24);
  });

  test("toCartItem normalizes missing priceValue from price string", () => {
    const item = toCartItem({ id: "x", name: "X", price: "₱50.00", img: "y" }, 3);
    expect(item.qty).toBe(3);
    expect(item.priceValue).toBe(50);
  });
});

describe("format util", () => {
  test("parsePriceToNumber strips currency symbols", () => {
    expect(parsePriceToNumber("₱35.00")).toBe(35);
    expect(parsePriceToNumber("$1,234.56")).toBe(1234.56);
    expect(parsePriceToNumber(null)).toBe(0);
    expect(parsePriceToNumber(undefined)).toBe(0);
    expect(parsePriceToNumber("")).toBe(0);
    expect(parsePriceToNumber(99)).toBe(99);
    expect(parsePriceToNumber(NaN)).toBe(0);
  });

  test("formatPeso produces a peso string with 2 decimals", () => {
    expect(formatPeso(35)).toMatch(/^₱/);
    expect(formatPeso(35)).toBe("₱35.00");
    expect(formatPeso("1234.5")).toBe("₱1,234.50");
  });

  test("deliveryFee: 49 below 500, 0 over", () => {
    expect(deliveryFee(0)).toBe(0);
    expect(deliveryFee(499)).toBe(49);
    expect(deliveryFee(500)).toBe(0);
    expect(deliveryFee(1500)).toBe(0);
  });
});
export function parsePriceToNumber(price) {
  if (typeof price === "number") return Number.isFinite(price) ? price : 0;
  if (price == null) return 0;
  const cleaned = String(price).replace(/[^0-9.]/g, "");
  const n = parseFloat(cleaned);
  return Number.isNaN(n) ? 0 : n;
}

export function formatPeso(value) {
  const n = typeof value === "number" ? value : parsePriceToNumber(value);
  try {
    return (
      "₱" +
      n.toLocaleString("en-PH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
  } catch (e) {
    return "₱" + n.toFixed(2);
  }
}

export function cartCount(items) {
  return items.reduce((sum, i) => sum + (i.qty || 0), 0);
}

export function cartSubtotal(items) {
  return items.reduce((sum, i) => {
    const unit =
      typeof i.priceValue === "number"
        ? i.priceValue
        : parsePriceToNumber(i.price);
    return sum + unit * (i.qty || 0);
  }, 0);
}

export function deliveryFee(subtotal) {
  if (subtotal <= 0) return 0;
  return subtotal >= 500 ? 0 : 49;
}

export const COMBO_WEEK_REFERENCE = new Date("2026-09-03T00:00:00");

export const COMBO_POOL = [
  {
    id: "combo-pastry-mojito",
    title: "Tropical Pastry + Mojito",
    description: "2 macaroons + 1 mojito drink. Chewy, golden, and refreshing.",
    items: [
      { productId: "coconut-macaroons", qty: 2 },
      { productId: "mojitos-drink", qty: 1 },
    ],
    badge: "Most loved",
  },
  {
    id: "combo-flan-spag",
    title: "Fiesta Combo",
    description: "1 tub leche flan + 1 plate sweet spaghetti. Sulit for celebrations.",
    items: [
      { productId: "leche-flan", qty: 1 },
      { productId: "spaghetti", qty: 1 },
    ],
    badge: "Fiesta favorite",
  },
  {
    id: "combo-classic",
    title: "Classic Trio",
    description: "6 macaroons + 1 leche flan + 1 mojito. The house favorite.",
    items: [
      { productId: "combo-delights", qty: 1 },
      { productId: "mojitos-drink", qty: 1 },
    ],
    badge: "Best value",
  },
  {
    id: "combo-palabok-mojito",
    title: "Salted Brunch Combo",
    description: "1 plate pancit palabok + 1 mojito. Hearty + cool.",
    items: [
      { productId: "pancit-palabok", qty: 1 },
      { productId: "mojitos-drink", qty: 1 },
    ],
    badge: "New",
  },
];

export function comboWeekIndex(now = new Date(), ref = COMBO_WEEK_REFERENCE) {
  const ms = now.getTime() - ref.getTime();
  const week = Math.floor(ms / (7 * 86400 * 1000));
  return ((week % COMBO_POOL.length) + COMBO_POOL.length) % COMBO_POOL.length;
}

export function comboOfTheWeek(now = new Date(), ref = COMBO_WEEK_REFERENCE) {
  const idx = comboWeekIndex(now, ref);
  return COMBO_POOL[idx];
}

export function comboPrice(combo, catalog) {
  if (!combo || !Array.isArray(catalog)) return 0;
  let total = 0;
  combo.items.forEach((line) => {
    const product = catalog.find((p) => p.id === line.productId);
    if (!product) return;
    total += (product.priceValue || 0) * (line.qty || 1);
  });
  return total;
}

export const COMBO_DISCOUNT_PCT = 15;

export function comboFinalPrice(combo, catalog) {
  const subtotal = comboPrice(combo, catalog);
  return Math.max(0, Math.round(subtotal * (1 - COMBO_DISCOUNT_PCT / 100)));
}

export function comboSavings(combo, catalog) {
  return Math.max(0, comboPrice(combo, catalog) - comboFinalPrice(combo, catalog));
}

export function comboLineItem(combo, catalog, now = new Date()) {
  const final = comboFinalPrice(combo, catalog);
  return {
    id: `combo-${combo.id}-${now.getTime()}`,
    name: `${combo.title} (combo)`,
    desc: combo.description,
    price: `₱${final}.00`,
    priceValue: final,
    img: (catalog.find((p) => p.id === combo.items[0].productId) || {}).img || "",
    qty: 1,
    comboId: combo.id,
    comboBadge: combo.badge,
  };
}
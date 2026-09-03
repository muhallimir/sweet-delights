export const ALLERGEN_SUBSTITUTIONS = {
  nuts: { label: "Seed mix (sunflower + sesame)", priceDelta: 20, removesAllergen: "nuts" },
  egg: { label: "Banana or applesauce binder", priceDelta: 15, removesAllergen: "egg" },
  milk: { label: "Coconut milk swap", priceDelta: 25, removesAllergen: "milk" },
  gluten: { label: "Rice flour base", priceDelta: 30, removesAllergen: "gluten" },
  wheat: { label: "Rice flour base", priceDelta: 30, removesAllergen: "wheat" },
  coconut: { label: "Vanilla yogurt alternative", priceDelta: 10, removesAllergen: "coconut" },
  fish: { label: "Mushroom umami swap", priceDelta: 35, removesAllergen: "fish" },
  shrimp: { label: "Mushroom umami swap", priceDelta: 35, removesAllergen: "shrimp" },
};

export function substitutionsFor(product) {
  if (!product || !Array.isArray(product.allergens)) return [];
  return product.allergens
    .map((a) => ALLERGEN_SUBSTITUTIONS[String(a).toLowerCase()])
    .filter(Boolean);
}

export function applySubstitution(product, substitutionKey) {
  const sub = ALLERGEN_SUBSTITUTIONS[substitutionKey];
  if (!sub) return null;
  return {
    id: `sub-${product.id}-${substitutionKey}`,
    productId: product.id,
    productName: product.name,
    substitutionKey,
    label: sub.label,
    priceDelta: sub.priceDelta,
    removesAllergen: sub.removesAllergen,
    createdAt: new Date().toISOString(),
  };
}

export function substitutedAllergens(product, applied) {
  if (!product) return null;
  const removed = (applied || [])
    .filter((s) => s.productId === product.id)
    .map((s) => s.removesAllergen);
  const list = (product.allergens || []).filter(
    (a) => !removed.includes(String(a).toLowerCase())
  );
  return list;
}

export function substitutionTotal(applied) {
  return (applied || []).reduce((s, a) => s + (Number(a.priceDelta) || 0), 0);
}

export function validateSubstitutionChoice(product, key) {
  if (!product) return "Product missing.";
  if (!ALLERGEN_SUBSTITUTIONS[key]) return "Unknown substitution.";
  const allowed = (product.allergens || []).map((a) => String(a).toLowerCase());
  if (!allowed.includes(String(key).toLowerCase())) {
    return "This product does not offer that substitution.";
  }
  return "";
}
import {
  ALLERGEN_SUBSTITUTIONS,
  substitutionsFor,
  applySubstitution,
  substitutedAllergens,
  substitutionTotal,
  validateSubstitutionChoice,
} from "../utils/allergenSubs";

const PRODUCT_WITH_NUTS = {
  id: "nutty-cake",
  name: "Nutty Cake",
  allergens: ["nuts", "egg"],
};

const PRODUCT_NO_ALLERGENS = {
  id: "plain",
  name: "Plain Bread",
  allergens: [],
};

describe("allergen substitution utils", () => {
  test("ALLERGEN_SUBSTITUTIONS has entries for common allergens", () => {
    expect(ALLERGEN_SUBSTITUTIONS.nuts).toBeTruthy();
    expect(ALLERGEN_SUBSTITUTIONS.milk).toBeTruthy();
    expect(ALLERGEN_SUBSTITUTIONS.gluten).toBeTruthy();
    expect(ALLERGEN_SUBSTITUTIONS.wheat).toBeTruthy();
  });

  test("substitutionsFor returns list of available swaps", () => {
    const list = substitutionsFor(PRODUCT_WITH_NUTS);
    expect(list.length).toBe(2);
    expect(list.map((s) => s.removesAllergen).sort()).toEqual(["egg", "nuts"]);
  });

  test("substitutionsFor returns [] for product with no allergens", () => {
    expect(substitutionsFor(PRODUCT_NO_ALLERGENS)).toEqual([]);
  });

  test("substitutionsFor returns [] for null product", () => {
    expect(substitutionsFor(null)).toEqual([]);
  });

  test("applySubstitution returns entry with priceDelta", () => {
    const entry = applySubstitution(PRODUCT_WITH_NUTS, "nuts");
    expect(entry).toBeTruthy();
    expect(entry.removesAllergen).toBe("nuts");
    expect(entry.priceDelta).toBe(ALLERGEN_SUBSTITUTIONS.nuts.priceDelta);
    expect(entry.label).toBe(ALLERGEN_SUBSTITUTIONS.nuts.label);
    expect(entry.id).toContain("nuts");
  });

  test("applySubstitution returns null for unknown key", () => {
    expect(applySubstitution(PRODUCT_WITH_NUTS, "unknown")).toBe(null);
  });

  test("substitutedAllergens removes the allergen for the product", () => {
    const applied = [applySubstitution(PRODUCT_WITH_NUTS, "nuts")];
    const remaining = substitutedAllergens(PRODUCT_WITH_NUTS, applied);
    expect(remaining).toEqual(["egg"]);
  });

  test("substitutedAllergens ignores subs for other products", () => {
    const applied = [
      {
        productId: "other",
        removesAllergen: "nuts",
        priceDelta: 0,
        label: "",
      },
    ];
    expect(substitutedAllergens(PRODUCT_WITH_NUTS, applied)).toEqual(["nuts", "egg"]);
  });

  test("substitutedAllergens returns full list when no applied", () => {
    expect(substitutedAllergens(PRODUCT_WITH_NUTS, [])).toEqual(["nuts", "egg"]);
  });

  test("substitutionTotal sums price deltas", () => {
    const list = [
      applySubstitution(PRODUCT_WITH_NUTS, "nuts"),
      applySubstitution(PRODUCT_WITH_NUTS, "egg"),
    ];
    const total = substitutionTotal(list);
    expect(total).toBe(ALLERGEN_SUBSTITUTIONS.nuts.priceDelta + ALLERGEN_SUBSTITUTIONS.egg.priceDelta);
  });

  test("substitutionTotal handles empty list", () => {
    expect(substitutionTotal([])).toBe(0);
    expect(substitutionTotal(null)).toBe(0);
  });

  test("validateSubstitutionChoice accepts offered swap", () => {
    expect(validateSubstitutionChoice(PRODUCT_WITH_NUTS, "nuts")).toBe("");
  });

  test("validateSubstitutionChoice rejects unsupported allergen", () => {
    expect(validateSubstitutionChoice(PRODUCT_WITH_NUTS, "shrimp")).toMatch(/not offer/i);
  });

  test("validateSubstitutionChoice rejects unknown key", () => {
    expect(validateSubstitutionChoice(PRODUCT_WITH_NUTS, "made-up")).toMatch(/unknown/i);
  });

  test("validateSubstitutionChoice rejects missing product", () => {
    expect(validateSubstitutionChoice(null, "nuts")).toMatch(/product/i);
  });
});
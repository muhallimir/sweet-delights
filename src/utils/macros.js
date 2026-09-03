export const DEFAULT_MACRO_CALORIES = {
  carbs: 4,
  protein: 4,
  fat: 9,
};

export function computeMacroPercents(product, calorieTable = DEFAULT_MACRO_CALORIES) {
  const nut = (product && product.nutrition) || {};
  const carbs = Math.max(0, Number(nut.carbsG) || 0);
  const protein = Math.max(0, Number(nut.proteinG) || 0);
  const fat = Math.max(0, Number(nut.fatG) || 0);
  const totalG = carbs + protein + fat;
  if (totalG <= 0) {
    const defaultTable = calorieTable || DEFAULT_MACRO_CALORIES;
    const carbsKcal = defaultTable.carbs;
    const proteinKcal = defaultTable.protein;
    const fatKcal = defaultTable.fat;
    const denom = carbsKcal + proteinKcal + fatKcal;
    return {
      carbs: Math.round((carbsKcal / denom) * 100),
      protein: Math.round((proteinKcal / denom) * 100),
      fat: Math.round((fatKcal / denom) * 100),
      carbsG: 0,
      proteinG: 0,
      fatG: 0,
      estimated: true,
    };
  }
  return {
    carbs: Math.round((carbs / totalG) * 100),
    protein: Math.round((protein / totalG) * 100),
    fat: Math.round((fat / totalG) * 100),
    carbsG: carbs,
    proteinG: protein,
    fatG: fat,
    estimated: false,
  };
}

export function macroConicGradient(percents) {
  const c = Math.max(0, Math.min(100, Number(percents.carbs) || 0));
  const p = Math.max(0, Math.min(100, Number(percents.protein) || 0));
  const f = Math.max(0, Math.min(100, Number(percents.fat) || 0));
  const sum = c + p + f;
  if (sum <= 0) return "conic-gradient(#333 0deg 360deg)";
  const normalize = (n) => (n * 360) / sum;
  const cEnd = normalize(c);
  const pEnd = cEnd + normalize(p);
  const fEnd = pEnd + normalize(f);
  return `conic-gradient(#f0c674 0deg ${cEnd}deg, #7fdba3 ${cEnd}deg ${pEnd}deg, #ff9a9a ${pEnd}deg ${fEnd}deg, #333 ${fEnd}deg 360deg)`;
}

export function macroTableRows(percents) {
  return [
    { key: "carbs", label: "Carbs", percent: percents.carbs, grams: percents.carbsG, color: "#f0c674" },
    { key: "protein", label: "Protein", percent: percents.protein, grams: percents.proteinG, color: "#7fdba3" },
    { key: "fat", label: "Fat", percent: percents.fat, grams: percents.fatG, color: "#ff9a9a" },
  ];
}

export function macroAriaLabel(percents) {
  return `Macros: ${percents.carbs}% carbs, ${percents.protein}% protein, ${percents.fat}% fat`;
}
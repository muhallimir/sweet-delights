import React, { useEffect } from "react";
import styled from "styled-components";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  z-index: 1100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const Dialog = styled.div`
  background: #141414;
  color: #fff;
  border-radius: 1rem;
  max-width: 520px;
  width: 100%;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.12);
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 0.8rem;
    font-size: 0.92rem;
  }
  th, td {
    text-align: left;
    padding: 0.55rem 0.6rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }
  th {
    color: #e3c987;
    width: 130px;
  }
`;

const NutritionModal = ({ product, onClose }) => {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!product) return null;
  const nut = product.nutrition || {};
  const allergens = product.allergens || [];

  return (
    <Overlay onClick={onClose} role="presentation">
      <Dialog role="dialog" aria-modal="true" aria-label={`Nutrition for ${product.name}`} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center" }}>
          <h3 style={{ margin: 0, color: "#e3c987" }}>Nutrition · {product.name}</h3>
          <button type="button" onClick={onClose} aria-label="Close nutrition" style={{ borderRadius: 999, border: "1px solid rgba(255,255,255,.3)", background: "transparent", color: "#fff", width: 34, height: 34, cursor: "pointer" }}>
            ✕
          </button>
        </div>
        <table>
          <tbody>
            <tr><th>Serving</th><td>{nut.serving || "1 serving"}</td></tr>
            <tr><th>Calories</th><td>{nut.calories != null ? `${nut.calories} kcal` : "—"}</td></tr>
            <tr><th>Ingredients</th><td>{nut.ingredients || product.desc || "—"}</td></tr>
            <tr><th>Allergens</th><td>{allergens.length > 0 ? allergens.join(", ") : "None declared"}</td></tr>
            <tr><th>Diet</th><td>{[
              product.diet && product.diet.vegan ? "vegan" : null,
              product.diet && product.diet.glutenFree ? "gluten-free" : null,
              product.diet && product.diet.nutFree ? "nut-free" : null,
              product.diet && product.diet.dairyFree ? "dairy-free" : null,
            ].filter(Boolean).join(" · ") || "—"}</td></tr>
          </tbody>
        </table>
        <p style={{ fontSize: ".82rem", opacity: 0.7 }}>Home-kitchen estimates. Ask us for allergen details before ordering.</p>
      </Dialog>
    </Overlay>
  );
};

export default NutritionModal;

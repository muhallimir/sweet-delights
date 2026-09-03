import React, { useState } from "react";
import { useCart } from "../../context/CartContext";
import { useCurrency } from "../../utils/currency";
import {
  substitutionsFor,
  applySubstitution,
  substitutedAllergens,
} from "../../utils/allergenSubs";

const KEY = "sd-substitutions";

function getApplied() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

function setApplied(list) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent("sd:substitutions", { detail: list }));
  } catch (e) {
    // ignore
  }
}

const AllergenSubstitution = ({ product }) => {
  const { format } = useCurrency();
  const { addQuiet } = useCart();
  const [picked, setPicked] = useState("");
  const [err, setErr] = useState("");

  const subs = substitutionsFor(product);
  if (subs.length === 0) return null;

  const remaining = substitutedAllergens(product, getApplied()) || [];
  const pickedSub = subs.find((s) => s.removesAllergen === picked) || null;

  const apply = () => {
    if (!pickedSub) {
      setErr("Pick a substitution to apply.");
      return;
    }
    const list = getApplied();
    const exists = list.find(
      (i) => i.productId === product.id && i.substitutionKey === pickedSub.removesAllergen
    );
    if (exists) {
      setErr("Already applied for this product.");
      return;
    }
    const next = [applySubstitution(product, pickedSub.removesAllergen), ...list].slice(0, 30);
    setApplied(next);
    const item = {
      id: next[0].id,
      name: `${product.name} · swap ${pickedSub.label}`,
      desc: `Removes ${pickedSub.removesAllergen}`,
      price: `₱${pickedSub.priceDelta}.00`,
      priceValue: pickedSub.priceDelta,
      img: product.img,
      qty: 1,
      isSubstitution: true,
    };
    addQuiet(item, 1);
    setErr("");
    window.dispatchEvent(new CustomEvent("sd:toast", { detail: { message: `Substitution added: ${pickedSub.label}`, tone: "success" } }));
  };

  return (
    <div style={{ marginTop: ".6rem", padding: ".7rem .9rem", background: "#101010", border: "1px solid rgba(255,255,255,.12)", borderRadius: ".7rem" }} aria-label="Allergen substitutions">
      <div style={{ fontWeight: 700, marginBottom: ".3rem" }}>Allergen substitutions</div>
      <p style={{ margin: "0 0 .4rem", fontSize: ".82rem", opacity: 0.8 }}>
        Swap any of the listed allergens for an alternative. We add a small fee per swap.
      </p>
      <label htmlFor={`sub-pick-${product.id}`} style={{ position: "absolute", left: "-9999px" }}>Choose substitution</label>
      <select
        id={`sub-pick-${product.id}`}
        value={picked}
        onChange={(e) => setPicked(e.target.value)}
        style={{ width: "100%", borderRadius: 8, border: "1px solid #555", background: "#0f0f0f", color: "#fff", padding: ".5rem .6rem" }}
      >
        <option value="">Choose a swap...</option>
        {subs.map((s) => (
          <option key={s.removesAllergen} value={s.removesAllergen}>
            {s.label} (+{format(s.priceDelta)})
          </option>
        ))}
      </select>
      {err ? <div role="alert" style={{ color: "#ff9a9a", fontSize: ".85rem", marginTop: ".3rem" }}>{err}</div> : null}
      <button
        type="button"
        onClick={apply}
        disabled={!pickedSub}
        aria-disabled={!pickedSub}
        style={{
          marginTop: ".5rem",
          background: pickedSub ? "#e3c987" : "#555",
          color: pickedSub ? "#111" : "#aaa",
          border: "none",
          borderRadius: 999,
          padding: ".5rem 1rem",
          fontWeight: 700,
          cursor: pickedSub ? "pointer" : "not-allowed",
        }}
      >
        {pickedSub ? `Add swap · +${format(pickedSub.priceDelta)}` : "Add swap"}
      </button>
      <div style={{ marginTop: ".5rem", fontSize: ".82rem" }}>
        Allergens after swap: {remaining.length > 0 ? remaining.join(", ") : "None declared"}
      </div>
    </div>
  );
};

export default AllergenSubstitution;
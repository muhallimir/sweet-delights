import React from "react";
import { useCart } from "../../context/CartContext";
import { useCurrency } from "../../utils/currency";
import {
  comboOfTheWeek,
  comboPrice,
  comboFinalPrice,
  comboSavings,
  comboLineItem,
  COMBO_DISCOUNT_PCT,
} from "../../utils/combo";
import { allProducts } from "../Products/data";

const ComboOfTheWeek = () => {
  const { addQuiet } = useCart();
  const { format } = useCurrency();
  const combo = comboOfTheWeek();
  const catalog = allProducts;
  const original = comboPrice(combo, catalog);
  const final = comboFinalPrice(combo, catalog);
  const saved = comboSavings(combo, catalog);

  return (
    <section
      aria-label="Combo of the week"
      style={{
        margin: "1.5rem auto",
        maxWidth: 1080,
        padding: "1.2rem 1.4rem",
        background: "linear-gradient(135deg, #1b1b10 0%, #2a1f0f 100%)",
        border: "1px solid rgba(227,201,135,.45)",
        borderRadius: "1rem",
        color: "#fff",
        display: "grid",
        gap: ".6rem",
      }}
    >
      <div style={{ display: "flex", gap: ".6rem", alignItems: "center", flexWrap: "wrap" }}>
        <span style={{ background: "#e3c987", color: "#111", padding: ".25rem .7rem", borderRadius: 999, fontWeight: 800, fontSize: ".78rem", letterSpacing: ".04em" }}>
          COMBO OF THE WEEK
        </span>
        {combo.badge ? (
          <span style={{ background: "rgba(255,255,255,.1)", color: "#e3c987", padding: ".2rem .6rem", borderRadius: 999, fontSize: ".75rem", border: "1px solid rgba(227,201,135,.3)" }}>
            {combo.badge}
          </span>
        ) : null}
      </div>
      <h3 style={{ margin: ".1rem 0", color: "#e3c987" }}>{combo.title}</h3>
      <p style={{ margin: 0, opacity: 0.85, lineHeight: 1.5 }}>{combo.description}</p>
      <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap", fontSize: ".85rem", opacity: 0.85 }}>
        {combo.items.map((line) => {
          const product = catalog.find((p) => p.id === line.productId);
          if (!product) return null;
          return (
            <span
              key={line.productId}
              style={{
                background: "rgba(0,0,0,.35)",
                border: "1px solid rgba(255,255,255,.1)",
                borderRadius: 999,
                padding: ".2rem .7rem",
              }}
            >
              {line.qty}× {product.name}
            </span>
          );
        })}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
        <div>
          <div style={{ textDecoration: "line-through", opacity: 0.6, fontSize: ".95rem" }}>
            {format(original)}
          </div>
          <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#e3c987" }}>
            {format(final)}
          </div>
        </div>
        <div
          style={{
            background: "rgba(50,180,100,.18)",
            color: "#7fdba3",
            border: "1px solid rgba(127,219,163,.4)",
            borderRadius: ".6rem",
            padding: ".4rem .8rem",
            fontSize: ".85rem",
            fontWeight: 700,
          }}
        >
          You save {format(saved)} · {COMBO_DISCOUNT_PCT}% off
        </div>
        <button
          type="button"
          onClick={() => {
            const item = comboLineItem(combo, catalog);
            addQuiet(item, 1);
            window.dispatchEvent(new CustomEvent("sd:toast", { detail: { message: `${combo.title} added to cart`, tone: "success" } }));
            if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          aria-label={`Add combo ${combo.title} to cart`}
          style={{
            marginLeft: "auto",
            background: "#e3c987",
            color: "#111",
            border: "none",
            borderRadius: 999,
            padding: ".7rem 1.4rem",
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          Add combo · {format(final)}
        </button>
      </div>
    </section>
  );
};

export default ComboOfTheWeek;
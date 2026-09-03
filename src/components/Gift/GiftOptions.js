import React from "react";
import { GIFT_WRAP_PRICE } from "../../utils/gift";
import { useCurrency } from "../../utils/currency";

const GiftOptions = ({ value, onChange }) => {
  const { format } = useCurrency();
  const set = (k, v) => onChange({ ...value, [k]: v });

  return (
    <div style={{ background: "#101010", border: "1px solid rgba(255,255,255,.1)", borderRadius: ".8rem", padding: ".9rem", marginBottom: "1rem" }} aria-label="Gift options">
      <h3 style={{ margin: "0 0 .6rem" }}>Gift options</h3>
      <label style={{ display: "flex", gap: ".6rem", alignItems: "center", cursor: "pointer" }}>
        <input type="checkbox" checked={Boolean(value.wrap)} onChange={(e) => set("wrap", e.target.checked)} />
        Gift wrap · +{format(GIFT_WRAP_PRICE)}
      </label>
      <label htmlFor="gift-msg" style={{ display: "block", fontSize: ".85rem", margin: ".7rem 0 .3rem" }}>Gift message (optional)</label>
      <textarea
        id="gift-msg"
        rows="2"
        placeholder="Happy birthday! Love, Maria..."
        value={value.message || ""}
        onChange={(e) => set("message", e.target.value.slice(0, 200))}
        style={{ width: "100%", borderRadius: 8, border: "1px solid #555", background: "#0f0f0f", color: "#fff", padding: ".6rem .7rem" }}
      />
      <label style={{ display: "flex", gap: ".6rem", alignItems: "center", marginTop: ".6rem", cursor: "pointer" }}>
        <input type="checkbox" checked={Boolean(value.receipt)} onChange={(e) => set("receipt", e.target.checked)} />
        Gift receipt (hide prices on confirmation)
      </label>
    </div>
  );
};

export default GiftOptions;

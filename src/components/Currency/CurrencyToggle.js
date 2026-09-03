import React from "react";
import { useCurrency } from "../../utils/currency";

const CurrencyToggle = () => {
  const { currency, setCurrency } = useCurrency();
  return (
    <div role="group" aria-label="Currency toggle" style={{ display: "inline-flex", border: "1px solid rgba(255,255,255,.3)", borderRadius: 999, overflow: "hidden", flexShrink: 0 }}>
      {["PHP", "USD"].map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => setCurrency(c)}
          aria-pressed={currency === c}
          aria-label={`Show prices in ${c === "PHP" ? "Philippine pesos" : "US dollars"}`}
          style={{
            border: "none",
            background: currency === c ? "#e3c987" : "transparent",
            color: currency === c ? "#111" : "#fff",
            fontWeight: currency === c ? 800 : 400,
            padding: ".35rem .55rem",
            cursor: "pointer",
            fontSize: ".78rem",
            whiteSpace: "nowrap",
          }}
        >
          <span aria-hidden="true">{c === "PHP" ? "₱" : "$"}</span>
          <span style={{ marginLeft: ".25rem" }}>{c}</span>
        </button>
      ))}
    </div>
  );
};

export default CurrencyToggle;

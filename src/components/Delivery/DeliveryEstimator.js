import React, { useState } from "react";
import { estimateForPostcode, getStoredPostcode, setStoredPostcode } from "../../utils/delivery";

const DeliveryEstimator = ({ subtotal, compact }) => {
  const [postcode, setPostcode] = useState(() => getStoredPostcode());
  const [result, setResult] = useState(() => {
    const stored = getStoredPostcode();
    if (stored) return estimateForPostcode(stored, subtotal);
    return null;
  });

  const check = (e) => {
    if (e) e.preventDefault();
    setStoredPostcode(postcode);
    setResult(estimateForPostcode(postcode, subtotal));
  };

  return (
    <div style={{ background: "#101010", border: "1px solid rgba(255,255,255,.1)", borderRadius: ".7rem", padding: ".7rem .9rem", marginBottom: ".8rem" }} aria-label="Delivery estimator">
      <form onSubmit={check}>
        <label htmlFor="delivery-postcode" style={{ display: "block", fontSize: ".85rem", marginBottom: ".3rem" }}>
          Delivery estimator · postcode to zone/fee/ETA
        </label>
        <div style={{ display: "flex", gap: ".5rem" }}>
          <input
            id="delivery-postcode"
            type="text"
            inputMode="numeric"
            placeholder="e.g. 1000"
            value={postcode}
            onChange={(e) => setPostcode(e.target.value.replace(/[^0-9]/g, "").slice(0, 4))}
            style={{ flex: 1, borderRadius: 8, border: "1px solid #555", background: "#222", color: "#fff", padding: ".5rem .7rem" }}
          />
          <button type="submit" style={{ borderRadius: 999, border: "none", background: "#e3c987", color: "#111", fontWeight: 700, padding: ".5rem 1rem", cursor: "pointer" }}>
            Check
          </button>
        </div>
      </form>
      {result ? (
        <div role={result.ok ? "status" : "alert"} style={{ fontSize: ".85rem", marginTop: ".4rem", color: result.ok ? "#c8f0d2" : "#ff9a9a" }}>
          {result.message}
          {!compact && result.ok ? <span style={{ opacity: 0.7 }}> · Free over ₱500 kept.</span> : null}
        </div>
      ) : null}
    </div>
  );
};

export default DeliveryEstimator;

import React from "react";
import { LOYALTY_COST, LOYALTY_VALUE } from "../../utils/loyalty";
import { useCurrency } from "../../utils/currency";

const LoyaltyBox = ({ balance, redeem, onToggle, earnPreview }) => {
  const { format } = useCurrency();
  const canRedeem = balance >= LOYALTY_COST;
  return (
    <div
      style={{
        background: "#1b1b10",
        border: "1px solid rgba(227,201,135,.35)",
        borderRadius: ".7rem",
        padding: ".7rem .9rem",
        marginBottom: ".8rem",
        fontSize: ".9rem",
      }}
      aria-label="Loyalty points"
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: ".6rem" }}>
        <span>
          Loyalty: <strong>{balance} pts</strong>
        </span>
        <span style={{ opacity: 0.75, fontSize: ".8rem" }}>1pt per ₱1 · 100pts = {format(LOYALTY_VALUE)} off</span>
      </div>
      {earnPreview > 0 ? (
        <div style={{ fontSize: ".82rem", opacity: 0.8, marginTop: ".2rem" }}>
          This order earns ~{earnPreview} pts
        </div>
      ) : null}
      <label style={{ display: "flex", alignItems: "center", gap: ".5rem", marginTop: ".5rem", cursor: canRedeem ? "pointer" : "default", opacity: canRedeem ? 1 : 0.6 }}>
        <input
          type="checkbox"
          checked={Boolean(redeem) && canRedeem}
          disabled={!canRedeem}
          onChange={(e) => onToggle(e.target.checked)}
        />
        Use 100 pts for {format(LOYALTY_VALUE)} off
      </label>
      {!canRedeem ? (
        <div style={{ fontSize: ".8rem", opacity: 0.7, marginTop: ".25rem" }}>
          Earn {LOYALTY_COST - balance} more pts to unlock a reward.
        </div>
      ) : null}
    </div>
  );
};

export default LoyaltyBox;

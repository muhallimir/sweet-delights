import React, { useEffect, useState } from "react";
import { getScheduledItems, removeScheduledItem } from "../../utils/scheduled";
import { countdownParts, formatScheduledFor } from "../../utils/preorder";
import { useCurrency } from "../../utils/currency";

const ScheduledCartSection = () => {
  const { format } = useCurrency();
  const [items, setItems] = useState(() => getScheduledItems());

  useEffect(() => {
    const onUpd = (e) => {
      if (e && e.detail) setItems(e.detail);
      else setItems(getScheduledItems());
    };
    window.addEventListener("sd:scheduled", onUpd);
    const t = setInterval(() => {
      setItems((prev) => prev.slice());
    }, 1000);
    return () => {
      window.removeEventListener("sd:scheduled", onUpd);
      clearInterval(t);
    };
  }, []);

  if (!items || items.length === 0) return null;

  return (
    <div
      aria-label="Scheduled pre-order items"
      style={{
        background: "#10233b",
        border: "1px solid #2f5a8a",
        borderRadius: ".7rem",
        padding: ".7rem .9rem",
        marginBottom: ".7rem",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: ".4rem" }}>
        <strong style={{ color: "#a9c8e8" }}>Scheduled ({items.length})</strong>
        <span style={{ fontSize: ".75rem", opacity: 0.7 }}>pickup/delivery later</span>
      </div>
      <div style={{ display: "grid", gap: ".5rem" }}>
        {items.map((item) => {
          const cd = countdownParts(item.scheduledAt);
          return (
            <div
              key={item.id}
              style={{
                background: "#0a1929",
                border: "1px solid rgba(168,200,232,.25)",
                borderRadius: ".55rem",
                padding: ".5rem .65rem",
                fontSize: ".85rem",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: ".5rem" }}>
                <span>
                  <strong>{item.qty}× {item.name}</strong>
                  <br />
                  <span style={{ opacity: 0.75, fontSize: ".78rem" }}>{formatScheduledFor(item.scheduledAt)}</span>
                </span>
                <span style={{ fontWeight: 700 }}>{format((item.priceValue || 0) * (item.qty || 1))}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: ".35rem" }}>
                <span
                  aria-live="polite"
                  style={{
                    background: cd.done ? "#14351f" : "#1b1b10",
                    border: cd.done ? "1px solid #2f7a44" : "1px solid rgba(227,201,135,.35)",
                    borderRadius: 999,
                    padding: ".15rem .6rem",
                    fontSize: ".78rem",
                    color: cd.done ? "#c8f0d2" : "#e3c987",
                  }}
                >
                  {cd.done ? "ready" : `in ${cd.label}`}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const next = removeScheduledItem(item.id);
                    setItems(next);
                  }}
                  aria-label={`Remove scheduled ${item.name}`}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#ff9a9a",
                    cursor: "pointer",
                    textDecoration: "underline",
                    fontSize: ".78rem",
                  }}
                >
                  remove
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ScheduledCartSection;
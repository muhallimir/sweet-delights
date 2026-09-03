import React, { useState } from "react";
import styled from "styled-components";
import { useCart } from "../../context/CartContext";
import { useCurrency } from "../../utils/currency";

const SubSection = styled.section`
  background: #0d0d0d;
  color: #fff;
  padding: 3rem 1.25rem;
  border-top: 1px solid rgba(255,255,255,.08);
`;

const SubInner = styled.div`
  max-width: 860px;
  margin: 0 auto;
  background: #161616;
  border: 1px solid rgba(227,201,135,.3);
  border-radius: 1rem;
  padding: 1.5rem;
  h2 { color: #e3c987; margin: 0 0 .3rem; }
`;

const OptRow = styled.div`
  display: flex;
  gap: .6rem;
  flex-wrap: wrap;
  margin: .8rem 0;
`;

const OptBtn = styled.button`
  border-radius: 999px;
  border: 1px solid ${(p) => (p.active ? "#e3c987" : "rgba(255,255,255,.25)")};
  background: ${(p) => (p.active ? "#e3c987" : "transparent")};
  color: ${(p) => (p.active ? "#111" : "#fff")};
  font-weight: ${(p) => (p.active ? 800 : 400)};
  padding: .55rem 1.1rem;
  cursor: pointer;
`;

const SIZES = [
  { id: "small", label: "Small · 4pcs", price: 199 },
  { id: "family", label: "Family · 8pcs", price: 349 },
  { id: "party", label: "Party · 12pcs", price: 499 },
];

const FREQS = [
  { id: "weekly", label: "Weekly" },
  { id: "biweekly", label: "Every 2 weeks" },
  { id: "monthly", label: "Monthly" },
];

const SubscribeBox = () => {
  const { addToCart } = useCart();
  const { format } = useCurrency();
  const [size, setSize] = useState("family");
  const [freq, setFreq] = useState("weekly");
  const [msg, setMsg] = useState("");

  const sizeObj = SIZES.find((s) => s.id === size) || SIZES[1];
  const freqObj = FREQS.find((f) => f.id === freq) || FREQS[0];

  const subscribe = () => {
    addToCart(
      {
        id: `sub-${size}-${freq}-${Date.now()}`,
        name: `Bread Box ${sizeObj.label} · ${freqObj.label} (Recurring)`,
        priceValue: sizeObj.price,
        price: format(sizeObj.price),
        desc: `Recurring ${freqObj.label} delivery`,
        alt: "Subscription bread box",
      },
      1
    );
    setMsg(`Subscribed! ${sizeObj.label} · ${freqObj.label} added as recurring item. Manage qty in cart.`);
  };

  return (
    <SubSection aria-label="Bread subscriptions">
      <SubInner>
        <h2>Weekly Bread Box Plan</h2>
        <p style={{ opacity: 0.8, margin: 0 }}>Fresh bread on repeat. Pause anytime by removing from cart. Mock subscription, no real billing.</p>
        <div style={{ marginTop: ".8rem", fontSize: ".9rem", fontWeight: 700 }}>1. Pick size</div>
        <OptRow role="group" aria-label="Box size">
          {SIZES.map((s) => (
            <OptBtn key={s.id} active={size === s.id} onClick={() => setSize(s.id)} aria-pressed={size === s.id}>
              {s.label} · {format(s.price)}
            </OptBtn>
          ))}
        </OptRow>
        <div style={{ fontSize: ".9rem", fontWeight: 700 }}>2. Pick frequency</div>
        <OptRow role="group" aria-label="Frequency">
          {FREQS.map((f) => (
            <OptBtn key={f.id} active={freq === f.id} onClick={() => setFreq(f.id)} aria-pressed={freq === f.id}>
              {f.label}
            </OptBtn>
          ))}
        </OptRow>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap", marginTop: ".6rem" }}>
          <strong style={{ color: "#e3c987", fontSize: "1.2rem" }}>{format(sizeObj.price)} / {freqObj.label.toLowerCase()}</strong>
          <button type="button" onClick={subscribe} style={{ borderRadius: 999, border: "none", background: "#e3c987", color: "#111", fontWeight: 800, padding: ".7rem 1.4rem", cursor: "pointer" }}>
            Subscribe · add recurring item
          </button>
        </div>
        {msg ? <p role="status" style={{ color: "#c8f0d2", marginTop: ".6rem" }}>{msg}</p> : null}
      </SubInner>
    </SubSection>
  );
};

export default SubscribeBox;

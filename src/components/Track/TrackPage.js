import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CheckoutWrap, Card, Title, Sub, Field, ErrorText, PlaceOrderBtn, BackLink } from "../Checkout/CheckoutElements";

const STAGES = ["placed", "baking", "out for delivery", "delivered"];

function stageForId(id, orderDate) {
  if (orderDate) {
    const mins = (Date.now() - new Date(orderDate).getTime()) / 60000;
    if (mins < 10) return 0;
    if (mins < 30) return 1;
    if (mins < 90) return 2;
    return 3;
  }
  let h = 0;
  String(id || "").split("").forEach((c) => {
    h += c.charCodeAt(0);
  });
  return h % 4;
}

const TrackPage = () => {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const track = (e) => {
    if (e) e.preventDefault();
    const id = String(input || "").trim().toUpperCase();
    if (!/^SD-[A-Z0-9-]{4,}$/.test(id)) {
      setError("Enter an order ID like SD-20240101-ABCD.");
      setResult(null);
      return;
    }
    setError("");
    let found = null;
    try {
      const raw = localStorage.getItem("sweet-delights-orders");
      const orders = raw ? JSON.parse(raw) : [];
      if (Array.isArray(orders)) found = orders.find((o) => String(o.id || "").toUpperCase() === id) || null;
    } catch (err) {
      found = null;
    }
    const stage = stageForId(id, found ? found.date : null);
    setResult({ id, found, stage });
  };

  return (
    <CheckoutWrap>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <BackLink as={Link} to="/">← Back to home</BackLink>
        <Title>Track your order</Title>
        <Sub>Enter your order ID (like SD-XXXX). Mock timeline, no backend.</Sub>
        <Card as="form" onSubmit={track} noValidate aria-label="Order tracking form">
          <Field>
            <label htmlFor="track-id">Order ID *</label>
            <input id="track-id" type="text" placeholder="SD-..." value={input} onChange={(e) => setInput(e.target.value)} style={{ textTransform: "uppercase" }} />
            {error ? <ErrorText role="alert">{error}</ErrorText> : null}
          </Field>
          <PlaceOrderBtn type="submit">Track order</PlaceOrderBtn>
        </Card>
        {result ? (
          <Card style={{ marginTop: "1rem" }} aria-label="Tracking result">
            <h3 style={{ marginTop: 0 }}>Order {result.id}</h3>
            {result.found ? (
              <p style={{ opacity: 0.85 }}>{result.found.items.reduce((s, i) => s + (i.qty || 0), 0)} items · placed {new Date(result.found.date).toLocaleString()}</p>
            ) : (
              <p style={{ opacity: 0.75 }}>Not found locally, showing mock progress for demo.</p>
            )}
            <ol style={{ listStyle: "none", padding: 0, margin: "1rem 0 0", display: "grid", gap: ".6rem" }}>
              {STAGES.map((s, idx) => {
                const done = idx <= result.stage;
                const current = idx === result.stage;
                return (
                  <li key={s} style={{ display: "flex", gap: ".7rem", alignItems: "center", opacity: done ? 1 : 0.45 }}>
                    <span style={{ width: 30, height: 30, borderRadius: 999, display: "inline-flex", alignItems: "center", justifyContent: "center", background: done ? "#e3c987" : "#333", color: done ? "#111" : "#fff", fontWeight: 800 }}>
                      {done ? "✓" : idx + 1}
                    </span>
                    <span style={{ textTransform: "capitalize", fontWeight: current ? 800 : 400 }}>
                      {s}{current ? " · current" : ""}
                    </span>
                  </li>
                );
              })}
            </ol>
          </Card>
        ) : null}
      </div>
    </CheckoutWrap>
  );
};

export default TrackPage;

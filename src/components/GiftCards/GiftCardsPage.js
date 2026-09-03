import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CheckoutWrap, Card, Title, Sub, Field, ErrorText, PlaceOrderBtn, BackLink } from "../Checkout/CheckoutElements";
import { useCurrency } from "../../utils/currency";
import {
  GIFT_CARD_DENOMINATIONS,
  getGiftCards,
  purchaseGiftCard,
  validateGiftCardForm,
  findGiftCard,
  redeemGiftCard,
} from "../../utils/giftCards";

const GiftCardsPage = () => {
  const { format } = useCurrency();
  const [cards, setCards] = useState(() => getGiftCards());
  const [form, setForm] = useState({
    amount: GIFT_CARD_DENOMINATIONS[1],
    recipientName: "",
    recipientEmail: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [purchased, setPurchased] = useState(null);
  const [redeemCode, setRedeemCode] = useState("");
  const [redeemResult, setRedeemResult] = useState(null);

  useEffect(() => {
    const onUpd = (e) => {
      if (e && e.detail) setCards(e.detail);
      else setCards(getGiftCards());
    };
    window.addEventListener("sd:giftcards", onUpd);
    return () => window.removeEventListener("sd:giftcards", onUpd);
  }, []);

  const submit = (e) => {
    e.preventDefault();
    const errs = validateGiftCardForm(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    const card = purchaseGiftCard(form);
    setPurchased(card);
    setCards(getGiftCards());
    setForm({ amount: GIFT_CARD_DENOMINATIONS[1], recipientName: "", recipientEmail: "", message: "" });
  };

  const applyRedeem = (e) => {
    e.preventDefault();
    const card = findGiftCard(redeemCode);
    if (!card) {
      setRedeemResult({ ok: false, message: "No gift card with that code in this browser." });
      return;
    }
    if (card.balance <= 0) {
      setRedeemResult({ ok: false, message: "This card has no remaining balance." });
      return;
    }
    const applied = card.balance;
    const r = redeemGiftCard(redeemCode, applied);
    setCards(getGiftCards());
    if (r.ok) {
      setRedeemResult({ ok: true, message: `Applied ${format(r.applied)} at checkout.` });
      setRedeemCode("");
    } else {
      setRedeemResult({ ok: false, message: "Could not apply. Try again." });
    }
  };

  return (
    <CheckoutWrap>
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <BackLink as={Link} to="/">← Back to home</BackLink>
        <Title>Gift cards</Title>
        <Sub>Send Sweet Delights to anyone. Pick a denomination, write a message, and we mock the purchase so you can demo the flow end to end.</Sub>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.2rem", marginTop: "1rem" }}>
          <Card aria-label="Pick a denomination">
            <h3 style={{ marginTop: 0 }}>1. Pick a denomination</h3>
            <div style={{ display: "flex", gap: ".6rem", flexWrap: "wrap" }}>
              {GIFT_CARD_DENOMINATIONS.map((d) => {
                const active = Number(form.amount) === d;
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, amount: d }))}
                    aria-pressed={active}
                    style={{
                      flex: "1 1 120px",
                      background: active ? "#e3c987" : "transparent",
                      color: active ? "#111" : "#fff",
                      border: active ? "1px solid #e3c987" : "1px solid rgba(255,255,255,.3)",
                      borderRadius: ".7rem",
                      padding: "1rem .8rem",
                      cursor: "pointer",
                      fontWeight: active ? 800 : 400,
                      fontSize: "1.1rem",
                    }}
                  >
                    {format(d)}
                  </button>
                );
              })}
            </div>
          </Card>

          <Card as="form" onSubmit={submit} aria-label="Recipient details" noValidate>
            <h3 style={{ marginTop: 0 }}>2. Recipient &amp; send</h3>
            <Field>
              <label htmlFor="gc-name">Recipient name *</label>
              <input
                id="gc-name"
                type="text"
                value={form.recipientName}
                onChange={(e) => setForm((p) => ({ ...p, recipientName: e.target.value }))}
                style={{ borderRadius: 8, border: "1px solid #555", background: "#0f0f0f", color: "#fff", padding: ".6rem .8rem" }}
              />
              {errors.recipientName ? <ErrorText role="alert">{errors.recipientName}</ErrorText> : null}
            </Field>
            <Field>
              <label htmlFor="gc-email">Recipient email *</label>
              <input
                id="gc-email"
                type="email"
                value={form.recipientEmail}
                onChange={(e) => setForm((p) => ({ ...p, recipientEmail: e.target.value }))}
                style={{ borderRadius: 8, border: "1px solid #555", background: "#0f0f0f", color: "#fff", padding: ".6rem .8rem" }}
              />
              {errors.recipientEmail ? <ErrorText role="alert">{errors.recipientEmail}</ErrorText> : null}
            </Field>
            <Field>
              <label htmlFor="gc-msg">Message (optional)</label>
              <textarea
                id="gc-msg"
                rows="3"
                maxLength="200"
                value={form.message}
                onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                style={{ borderRadius: 8, border: "1px solid #555", background: "#0f0f0f", color: "#fff", padding: ".6rem .8rem" }}
              />
              {errors.message ? <ErrorText role="alert">{errors.message}</ErrorText> : null}
              <div style={{ fontSize: ".75rem", opacity: 0.7, marginTop: ".25rem" }}>{form.message.length}/200</div>
            </Field>
            {errors.amount ? <ErrorText role="alert">{errors.amount}</ErrorText> : null}
            <PlaceOrderBtn type="submit">
              Purchase gift card · {format(Number(form.amount))}
            </PlaceOrderBtn>
            {purchased ? (
              <div
                role="status"
                style={{
                  marginTop: ".9rem",
                  background: "#14351f",
                  border: "1px solid #2f7a44",
                  borderRadius: ".6rem",
                  padding: ".7rem .9rem",
                  color: "#c8f0d2",
                }}
              >
                Purchased! Code <strong>{purchased.code}</strong> · {format(purchased.balance)} balance.
                <br />
                Sent to {purchased.recipientEmail} (mock).
              </div>
            ) : null}
          </Card>
        </div>

        <Card style={{ marginTop: "1.2rem" }} aria-label="My gift cards">
          <h3 style={{ marginTop: 0 }}>My gift cards ({cards.length})</h3>
          {cards.length === 0 ? (
            <p style={{ opacity: 0.8 }}>No gift cards yet. Purchase one above and it appears here for use at checkout.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: ".9rem" }}>
                <thead>
                  <tr style={{ textAlign: "left", color: "#e3c987" }}>
                    <th style={{ padding: ".5rem" }}>Code</th>
                    <th style={{ padding: ".5rem" }}>Recipient</th>
                    <th style={{ padding: ".5rem" }}>Initial</th>
                    <th style={{ padding: ".5rem" }}>Balance</th>
                    <th style={{ padding: ".5rem" }}>Purchased</th>
                  </tr>
                </thead>
                <tbody>
                  {cards.map((c) => (
                    <tr key={c.id} style={{ borderTop: "1px solid rgba(255,255,255,.08)" }}>
                      <td style={{ padding: ".5rem", fontFamily: "monospace" }}>{c.code}</td>
                      <td style={{ padding: ".5rem" }}>{c.recipientName}<br /><span style={{ opacity: 0.7, fontSize: ".78rem" }}>{c.recipientEmail}</span></td>
                      <td style={{ padding: ".5rem" }}>{format(c.initialBalance)}</td>
                      <td style={{ padding: ".5rem", fontWeight: 700, color: c.balance > 0 ? "#e3c987" : "#ff9a9a" }}>{format(c.balance)}</td>
                      <td style={{ padding: ".5rem" }}>{new Date(c.purchasedAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <form onSubmit={applyRedeem} style={{ marginTop: "1rem", display: "flex", gap: ".5rem", flexWrap: "wrap" }} aria-label="Redeem at checkout">
            <label htmlFor="redeem-code" style={{ position: "absolute", left: "-9999px" }}>Redeem code</label>
            <input
              id="redeem-code"
              type="text"
              placeholder="GIFT-XXXX-XXXX"
              value={redeemCode}
              onChange={(e) => setRedeemCode(e.target.value.toUpperCase())}
              style={{ flex: "1 1 200px", borderRadius: 8, border: "1px solid #555", background: "#0f0f0f", color: "#fff", padding: ".6rem .8rem", fontFamily: "monospace" }}
            />
            <button
              type="submit"
              style={{ borderRadius: 999, border: "none", background: "#e3c987", color: "#111", fontWeight: 800, padding: ".6rem 1.2rem", cursor: "pointer" }}
            >
              Apply at checkout (mock)
            </button>
          </form>
          {redeemResult ? (
            <div
              role="status"
              style={{
                marginTop: ".6rem",
                background: redeemResult.ok ? "#14351f" : "#3a0e0e",
                border: `1px solid ${redeemResult.ok ? "#2f7a44" : "#ff9a9a"}`,
                borderRadius: ".5rem",
                padding: ".5rem .8rem",
                color: redeemResult.ok ? "#c8f0d2" : "#ff9a9a",
                fontSize: ".88rem",
              }}
            >
              {redeemResult.message}
            </div>
          ) : null}
        </Card>
      </div>
    </CheckoutWrap>
  );
};

export default GiftCardsPage;
import React, { useEffect, useMemo, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { deliveryFee } from "../../utils/format";
import { useCurrency } from "../../utils/currency";
import { getStoredPromo, setStoredPromo, clearStoredPromo, calcPromo } from "../../utils/promo";
import { getLoyaltyBalance, getLoyaltyRedeem, setLoyaltyRedeem, calcLoyalty, earnForTotal, addLoyaltyPoints, spendLoyaltyPoints, setLoyaltyBalance, LOYALTY_COST } from "../../utils/loyalty";
import { hasFreeDelivery } from "../../utils/loyaltyTier";
import TierCard from "../Loyalty/TierCard";
import { getScheduledItems, clearScheduledItems } from "../../utils/scheduled";
import { formatScheduledFor } from "../../utils/preorder";
import PromoForm from "../Promo/PromoForm";
import LoyaltyBox from "../Loyalty/LoyaltyBox";
import FulfillmentPicker from "../Fulfillment/FulfillmentPicker";
import { getFulfillment, setFulfillment, validateFulfillment, fulfillmentLabel } from "../../utils/fulfillment";
import GiftOptions from "../Gift/GiftOptions";
import { getGift, setGift, GIFT_WRAP_PRICE } from "../../utils/gift";
import {
  CheckoutWrap,
  CheckoutInner,
  Card,
  Title,
  Sub,
  Field,
  ErrorText,
  RadioGroup,
  SummaryRow,
  TotalRow,
  PlaceOrderBtn,
  BackLink,
  SuccessBadge,
  OrderId,
} from "./CheckoutElements";

function makeOrderId() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `SD-${y}${m}${day}-${rand}`;
}

export { makeOrderId, validate };

function validate(values) {
  const errors = {};
  if (!values.name || values.name.trim().length < 2) {
    errors.name = "Please enter your full name.";
  }
  const phone = (values.phone || "").replace(/[\s-]/g, "");
  if (!/^(\+?63|0)?\d{9,11}$/.test(phone)) {
    errors.phone = "Enter a valid PH phone number (e.g. 09171234567).";
  }
  if (!values.address || values.address.trim().length < 8) {
    errors.address = "Please enter your complete delivery address.";
  }
  if (!values.payment) {
    errors.payment = "Please choose a payment method.";
  }
  if (
    values.payment === "GCash" &&
    values.gcashRef &&
    values.gcashRef.trim().length > 0 &&
    values.gcashRef.trim().length < 4
  ) {
    errors.gcashRef = "GCash reference looks too short.";
  }
  return errors;
}

const CheckoutPage = () => {
  const { items, subtotal, clearCart } = useCart();
  const { format } = useCurrency();
  const history = useHistory();
  const [scheduledItems, setScheduledItemsState] = useState(() => getScheduledItems());
  const [values, setValues] = useState({
    name: "",
    phone: "",
    address: "",
    notes: "",
    payment: "Cash on Delivery",
    gcashRef: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [placedOrder, setPlacedOrder] = useState(null);
  const [promoCode, setPromoCode] = useState(() => getStoredPromo());
  const [loyaltyBalance, setLoyaltyBalanceState] = useState(() => getLoyaltyBalance());
  const [loyaltyRedeem, setLoyaltyRedeemState] = useState(() => getLoyaltyRedeem());
  const [fulfillment, setFulfillmentState] = useState(() => getFulfillment());
  const [fulErrors, setFulErrors] = useState({});
  const [gift, setGiftState] = useState(() => getGift());
  const [receiptEmail, setReceiptEmail] = useState("");
  const [receiptMsg, setReceiptMsg] = useState("");
  const [receiptErr, setReceiptErr] = useState("");

  useEffect(() => {
    setPromoCode(getStoredPromo());
    setLoyaltyBalanceState(getLoyaltyBalance());
    setLoyaltyRedeemState(getLoyaltyRedeem());
    setFulfillmentState(getFulfillment());
    setGiftState(getGift());
    setScheduledItemsState(getScheduledItems());
  }, []);

  const baseFee = useMemo(() => deliveryFee(subtotal), [subtotal]);
  const promoCalc = useMemo(() => calcPromo(subtotal, baseFee, promoCode), [subtotal, baseFee, promoCode]);
  const afterPromo = promoCalc.total - promoCalc.fee;
  const loyaltyCalc = useMemo(() => calcLoyalty(afterPromo, loyaltyBalance, loyaltyRedeem), [afterPromo, loyaltyBalance, loyaltyRedeem]);
  const tierFreeDelivery = hasFreeDelivery(loyaltyBalance, subtotal);
  const deliveryFeeFinal = fulfillment.type === "pickup" || tierFreeDelivery ? 0 : promoCalc.fee;
  const promoDiscount = promoCalc.discount;
  const loyaltyDiscount = loyaltyCalc.discount;
  const giftFee = gift.wrap ? GIFT_WRAP_PRICE : 0;
  const fee = deliveryFeeFinal;
  const preGiftTotal = Math.max(0, subtotal - promoDiscount - loyaltyDiscount + deliveryFeeFinal);
  const total = preGiftTotal + giftFee;
  const earnPreview = earnForTotal(preGiftTotal);

  const set = (k) => (e) => {
    const v = e.target.value;
    setValues((prev) => ({ ...prev, [k]: v }));
    if (touched[k]) {
      setErrors(validate({ ...values, [k]: v }));
    }
  };

  const blur = (k) => () => {
    setTouched((p) => ({ ...p, [k]: true }));
    setErrors(validate(values));
  };

  const submit = (e) => {
    e.preventDefault();
    const errs = validate(values);
    const fErrs = validateFulfillment(fulfillment);
    setErrors(errs);
    setFulErrors(fErrs);
    setTouched({ name: true, phone: true, address: true, payment: true });
    if (Object.keys(errs).length > 0) return;
    if (Object.keys(fErrs).length > 0) return;
    if (items.length === 0) return;
    setFulfillment(fulfillment);
    setGift(gift);
    const usedReward = loyaltyCalc.applied;
    const earned = earnForTotal(preGiftTotal);
    const finalFee = fulfillment.type === "pickup" || tierFreeDelivery ? 0 : promoCalc.fee;
    const finalPreGift = Math.max(0, subtotal - promoDiscount - loyaltyDiscount + finalFee);
    const finalTotal = finalPreGift + giftFee;
    const order = {
      id: makeOrderId(),
      date: new Date().toISOString(),
      customer: { ...values },
      fulfillment: { ...fulfillment },
      fulfillmentLabel: fulfillmentLabel(fulfillment),
      gift: { ...gift },
      giftFee,
      items: items.map((i) => ({ ...i })),
      scheduledItems: scheduledItems.map((i) => ({ ...i })),
      subtotal,
      promoCode: promoCode || "",
      promoDiscount,
      loyaltyDiscount,
      loyaltyUsed: usedReward,
      loyaltyEarned: earned,
      fee: finalFee,
      total: finalTotal,
    };
    try {
      const raw = localStorage.getItem("sweet-delights-orders");
      const prev = raw ? JSON.parse(raw) : [];
      const next = Array.isArray(prev) ? [...prev, order] : [order];
      localStorage.setItem("sweet-delights-orders", JSON.stringify(next));
    } catch (err) {
      // ignore storage errors
    }
    clearCart();
    clearStoredPromo();
    setPromoCode("");
    clearScheduledItems();
    setScheduledItemsState([]);
    if (usedReward) spendLoyaltyPoints(LOYALTY_COST);
    const newBal = addLoyaltyPoints(earned);
    setLoyaltyBalanceState(newBal);
    setLoyaltyRedeem(false);
    setLoyaltyRedeemState(false);
    setLoyaltyBalance(newBal);
    setPlacedOrder({ ...order, loyaltyBalance: newBal });
    window.scrollTo(0, 0);
  };

  const sendReceipt = (e) => {
    if (e) e.preventDefault();
    const email = String(receiptEmail || "").trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      setReceiptErr("Enter a valid email to send the receipt.");
      setReceiptMsg("");
      return;
    }
    setReceiptErr("");
    try {
      const raw = localStorage.getItem("sd-receipts");
      const prev = raw ? JSON.parse(raw) : [];
      const next = Array.isArray(prev) ? [...prev, { orderId: placedOrder.id, email, at: new Date().toISOString() }] : [{ orderId: placedOrder.id, email, at: new Date().toISOString() }];
      localStorage.setItem("sd-receipts", JSON.stringify(next));
    } catch (err) {
      // ignore
    }
    setReceiptMsg(`Receipt sent to ${email} (mock). Check your inbox.`);
  };

  if (placedOrder) {
    return (
      <CheckoutWrap>
        <div style={{ maxWidth: 720, margin: "0 auto" }} className="receipt-print">
          <BackLink as={Link} to="/">
            ← Back to home
          </BackLink>
          <Card>
            <SuccessBadge role="status">
              Order placed! We will text you for confirmation.
            </SuccessBadge>
            <Title>Thank you, {placedOrder.customer.name.split(" ")[0]}!</Title>
            <Sub>
              Your order is in. Show this order ID when we contact you.
            </Sub>
            <OrderId>Order ID: {placedOrder.id}</OrderId>
            <p style={{ opacity: 0.85 }}>
              {placedOrder.items.reduce((s, i) => s + (i.qty || 0), 0)} items ·{" "}
              {format(placedOrder.total)} · {placedOrder.customer.payment}
            </p>
            <div style={{ marginTop: ".8rem" }}>
              <TierCard compact />
            </div>
            {placedOrder.fulfillmentLabel ? (
              <p style={{ background: "#10233b", border: "1px solid #2f5a8a", borderRadius: ".7rem", padding: ".6rem .9rem" }}>
                {placedOrder.fulfillmentLabel}
              </p>
            ) : null}
            <div style={{ marginTop: "1rem" }}>
              {placedOrder.gift && placedOrder.gift.receipt ? (
                <p style={{ background: "#14351f", border: "1px solid #2f7a44", borderRadius: ".7rem", padding: ".6rem .9rem" }}>
                  Gift receipt · prices hidden{placedOrder.gift.message ? ` · “${placedOrder.gift.message}”` : ""}
                </p>
              ) : null}
              {placedOrder.items.map((i) => (
                <SummaryRow key={i.id}>
                  <span>
                    {i.qty}× {i.name}
                  </span>
                  <span>{placedOrder.gift && placedOrder.gift.receipt ? "···" : format((i.priceValue || 0) * (i.qty || 0))}</span>
                </SummaryRow>
              ))}
              {placedOrder.scheduledItems && placedOrder.scheduledItems.length > 0 ? (
                <div style={{ marginTop: ".7rem", background: "#10233b", border: "1px solid #2f5a8a", borderRadius: ".7rem", padding: ".6rem .8rem" }}>
                  <strong style={{ color: "#a9c8e8" }}>Scheduled ({placedOrder.scheduledItems.length})</strong>
                  {placedOrder.scheduledItems.map((si) => (
                    <div key={si.id} style={{ display: "flex", justifyContent: "space-between", fontSize: ".88rem", marginTop: ".35rem" }}>
                      <span>
                        {si.qty}× {si.name}
                        <br />
                        <span style={{ opacity: 0.7, fontSize: ".78rem" }}>{formatScheduledFor(si.scheduledAt)}</span>
                      </span>
                      <span>{placedOrder.gift && placedOrder.gift.receipt ? "···" : format((si.priceValue || 0) * (si.qty || 1))}</span>
                    </div>
                  ))}
                </div>
              ) : null}
              {placedOrder.gift && placedOrder.gift.wrap ? (
                <SummaryRow>
                  <span>Gift wrap</span>
                  <span>{placedOrder.gift.receipt ? "···" : format(placedOrder.giftFee || 0)}</span>
                </SummaryRow>
              ) : null}
              {placedOrder.gift && placedOrder.gift.message && !(placedOrder.gift.receipt) ? (
                <SummaryRow>
                  <span>Gift message</span>
                  <span style={{ textAlign: "right", maxWidth: "60%" }}>“{placedOrder.gift.message}”</span>
                </SummaryRow>
              ) : null}
              <SummaryRow>
                <span>Deliver to</span>
                <span style={{ textAlign: "right", maxWidth: "60%" }}>
                  {placedOrder.customer.address}
                </span>
              </SummaryRow>
              {placedOrder.promoDiscount > 0 && (
                <SummaryRow>
                  <span>Promo ({placedOrder.promoCode})</span>
                  <span>−{format(placedOrder.promoDiscount)}</span>
                </SummaryRow>
              )}
              {placedOrder.loyaltyDiscount > 0 && (
                <SummaryRow>
                  <span>Loyalty reward</span>
                  <span>{placedOrder.gift && placedOrder.gift.receipt ? "···" : `−${format(placedOrder.loyaltyDiscount)}`}</span>
                </SummaryRow>
              )}
              <TotalRow>
                <span>Total</span>
                <span>{placedOrder.gift && placedOrder.gift.receipt ? "Gift · prices hidden" : format(placedOrder.total)}</span>
              </TotalRow>
              <p style={{ fontSize: ".9rem", opacity: 0.85 }}>
                You earned {placedOrder.loyaltyEarned} pts. New balance: {placedOrder.loyaltyBalance} pts.
              </p>
            </div>
            <div style={{ display: "flex", gap: ".6rem", flexWrap: "wrap", marginTop: "1rem" }}>
              <button type="button" onClick={() => window.print()} style={{ borderRadius: 999, border: "1px solid #e3c987", background: "transparent", color: "#e3c987", padding: ".6rem 1.2rem", cursor: "pointer" }}>
                Print receipt
              </button>
              <Link to="/track" style={{ borderRadius: 999, border: "1px solid rgba(255,255,255,.3)", color: "#fff", padding: ".6rem 1.2rem", textDecoration: "none" }}>
                Track order
              </Link>
            </div>
            <form onSubmit={sendReceipt} style={{ marginTop: "1rem", background: "#101010", border: "1px solid rgba(255,255,255,.1)", borderRadius: ".8rem", padding: ".9rem" }} aria-label="Email receipt">
              <label htmlFor="receipt-email" style={{ display: "block", fontSize: ".9rem", marginBottom: ".35rem" }}>Email receipt (mock)</label>
              <div style={{ display: "flex", gap: ".5rem" }}>
                <input id="receipt-email" type="email" placeholder="you@mail.com" value={receiptEmail} onChange={(e) => setReceiptEmail(e.target.value)} style={{ flex: 1, borderRadius: 8, border: "1px solid #555", background: "#0f0f0f", color: "#fff", padding: ".6rem .8rem" }} />
                <button type="submit" style={{ borderRadius: 999, border: "none", background: "#e3c987", color: "#111", fontWeight: 800, padding: ".6rem 1.1rem", cursor: "pointer" }}>Send</button>
              </div>
              {receiptErr ? <div role="alert" style={{ color: "#ff9a9a", fontSize: ".85rem", marginTop: ".35rem" }}>{receiptErr}</div> : null}
              {receiptMsg ? <div role="status" style={{ color: "#c8f0d2", fontSize: ".85rem", marginTop: ".35rem" }}>{receiptMsg}</div> : null}
            </form>
            <PlaceOrderBtn as={Link} to="/" style={{ textDecoration: "none", textAlign: "center", display: "block" }}>
              Back to menu
            </PlaceOrderBtn>
          </Card>
        </div>
      </CheckoutWrap>
    );
  }

  return (
    <CheckoutWrap>
      <div style={{ maxWidth: 1080, margin: "0 auto 1.5rem" }}>
        <BackLink as={Link} to="/">
          ← Back to menu
        </BackLink>
        <Title>Checkout</Title>
        <Sub>Cash on Delivery, GCash, or card on pickup. No prepayment needed.</Sub>
      </div>
      <CheckoutInner>
        <Card as="form" onSubmit={submit} noValidate aria-label="Checkout form">
          <FulfillmentPicker value={fulfillment} errors={fulErrors} onChange={(v) => { setFulfillmentState(v); setFulErrors({}); }} />
          <Field>
            <label htmlFor="co-name">Full name *</label>
            <input
              id="co-name"
              type="text"
              autoComplete="name"
              placeholder="Maria Santos"
              value={values.name}
              onChange={set("name")}
              onBlur={blur("name")}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "co-name-err" : undefined}
            />
            {errors.name && (
              <ErrorText id="co-name-err" role="alert">
                {errors.name}
              </ErrorText>
            )}
          </Field>
          <Field>
            <label htmlFor="co-phone">Phone *</label>
            <input
              id="co-phone"
              type="tel"
              autoComplete="tel"
              placeholder="09171234567"
              value={values.phone}
              onChange={set("phone")}
              onBlur={blur("phone")}
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? "co-phone-err" : undefined}
            />
            {errors.phone && (
              <ErrorText id="co-phone-err" role="alert">
                {errors.phone}
              </ErrorText>
            )}
          </Field>
          <Field>
            <label htmlFor="co-address">Delivery address *</label>
            <textarea
              id="co-address"
              autoComplete="street-address"
              placeholder="House no, street, barangay, city"
              value={values.address}
              onChange={set("address")}
              onBlur={blur("address")}
              aria-invalid={Boolean(errors.address)}
              aria-describedby={errors.address ? "co-address-err" : undefined}
            />
            {errors.address && (
              <ErrorText id="co-address-err" role="alert">
                {errors.address}
              </ErrorText>
            )}
          </Field>
          <Field>
            <label id="pay-label">Payment method *</label>
            <RadioGroup role="radiogroup" aria-labelledby="pay-label">
              {["Cash on Delivery", "GCash", "Card on pickup"].map((opt) => (
                <label key={opt}>
                  <input
                    type="radio"
                    name="payment"
                    value={opt}
                    checked={values.payment === opt}
                    onChange={set("payment")}
                  />
                  {opt}
                </label>
              ))}
            </RadioGroup>
            {errors.payment && (
              <ErrorText role="alert">{errors.payment}</ErrorText>
            )}
          </Field>
          {values.payment === "GCash" && (
            <Field>
              <label htmlFor="co-gcash">GCash ref (optional)</label>
              <input
                id="co-gcash"
                type="text"
                placeholder="e.g. 1234 567 890"
                value={values.gcashRef}
                onChange={set("gcashRef")}
              />
              {errors.gcashRef && (
                <ErrorText role="alert">{errors.gcashRef}</ErrorText>
              )}
            </Field>
          )}
          <Field>
            <label htmlFor="co-notes">Notes (optional)</label>
            <textarea
              id="co-notes"
              placeholder="Landmark, preferred time, dedication message..."
              value={values.notes}
              onChange={set("notes")}
            />
          </Field>
          <GiftOptions value={gift} onChange={(v) => { setGiftState(v); setGift(v); }} />
          <PlaceOrderBtn
            type="submit"
            disabled={items.length === 0}
            aria-disabled={items.length === 0}
          >
            {items.length === 0
              ? "Cart is empty"
              : `Place order · ${format(total)}`}
          </PlaceOrderBtn>
        </Card>
        <Card aria-label="Order summary">
          <h2 style={{ marginTop: 0 }}>Order summary</h2>
          <TierCard />
          <PromoForm
            appliedCode={promoCode}
            onApply={(code) => {
              setStoredPromo(code);
              setPromoCode(code);
            }}
            onRemove={() => {
              clearStoredPromo();
              setPromoCode("");
            }}
          />
          <LoyaltyBox
            balance={loyaltyBalance}
            redeem={loyaltyRedeem}
            earnPreview={earnPreview}
            onToggle={(on) => {
              setLoyaltyRedeem(on);
              setLoyaltyRedeemState(on);
            }}
          />
          {items.length === 0 ? (
            <p style={{ opacity: 0.8 }}>
              No items yet.{" "}
              <Link to="/" style={{ color: "#e3c987" }}>
                Browse the menu
              </Link>
              .
            </p>
          ) : (
            <>
              {items.map((i) => (
                <SummaryRow key={i.id}>
                  <span>
                    {i.qty}× {i.name}
                  </span>
                  <span>{format((i.priceValue || 0) * (i.qty || 0))}</span>
                </SummaryRow>
              ))}
              <SummaryRow>
                <span>Subtotal</span>
                <span>{format(subtotal)}</span>
              </SummaryRow>
              {promoDiscount > 0 && (
                <SummaryRow>
                  <span>Promo ({promoCode})</span>
                  <span>−{format(promoDiscount)}</span>
                </SummaryRow>
              )}
              {loyaltyDiscount > 0 && (
                <SummaryRow>
                  <span>Loyalty (100pts)</span>
                  <span>−{format(loyaltyDiscount)}</span>
                </SummaryRow>
              )}
              <SummaryRow>
                <span>Delivery{fulfillment.type === "pickup" ? " (pickup FREE)" : ""}</span>
                <span>{fee === 0 ? "FREE" : format(fee)}</span>
              </SummaryRow>
              {giftFee > 0 && (
                <SummaryRow>
                  <span>Gift wrap</span>
                  <span>{format(giftFee)}</span>
                </SummaryRow>
              )}
              <TotalRow>
                <span>Total</span>
                <span>{format(total)}</span>
              </TotalRow>
              <p style={{ fontSize: "0.85rem", opacity: 0.7 }}>
                Free delivery on orders ₱500 and up. Mock checkout, no real
                payment is processed.
              </p>
              <button
                type="button"
                onClick={() => history.push("/")}
                style={{
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,.25)",
                  color: "#fff",
                  borderRadius: 999,
                  padding: ".6rem 1rem",
                  cursor: "pointer",
                  width: "100%",
                }}
              >
                Add more items
              </button>
            </>
          )}
        </Card>
      </CheckoutInner>
    </CheckoutWrap>
  );
};

export default CheckoutPage;

import React, { useEffect, useMemo, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { formatPeso, deliveryFee } from "../../utils/format";
import { getStoredPromo, setStoredPromo, clearStoredPromo, calcPromo } from "../../utils/promo";
import { getLoyaltyBalance, getLoyaltyRedeem, setLoyaltyRedeem, calcLoyalty, earnForTotal, addLoyaltyPoints, spendLoyaltyPoints, setLoyaltyBalance, LOYALTY_COST } from "../../utils/loyalty";
import PromoForm from "../Promo/PromoForm";
import LoyaltyBox from "../Loyalty/LoyaltyBox";
import FulfillmentPicker from "../Fulfillment/FulfillmentPicker";
import { getFulfillment, setFulfillment, validateFulfillment, fulfillmentLabel } from "../../utils/fulfillment";
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
  const history = useHistory();
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

  useEffect(() => {
    setPromoCode(getStoredPromo());
    setLoyaltyBalanceState(getLoyaltyBalance());
    setLoyaltyRedeemState(getLoyaltyRedeem());
    setFulfillmentState(getFulfillment());
  }, []);

  const baseFee = useMemo(() => deliveryFee(subtotal), [subtotal]);
  const promoCalc = useMemo(() => calcPromo(subtotal, baseFee, promoCode), [subtotal, baseFee, promoCode]);
  const afterPromo = promoCalc.total - promoCalc.fee;
  const loyaltyCalc = useMemo(() => calcLoyalty(afterPromo, loyaltyBalance, loyaltyRedeem), [afterPromo, loyaltyBalance, loyaltyRedeem]);
  const fee = promoCalc.fee;
  const promoDiscount = promoCalc.discount;
  const loyaltyDiscount = loyaltyCalc.discount;
  const total = Math.max(0, promoCalc.total - loyaltyDiscount);
  const earnPreview = earnForTotal(total);

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
    const usedReward = loyaltyCalc.applied;
    const earned = earnForTotal(total);
    const order = {
      id: makeOrderId(),
      date: new Date().toISOString(),
      customer: { ...values },
      fulfillment: { ...fulfillment },
      fulfillmentLabel: fulfillmentLabel(fulfillment),
      items: items.map((i) => ({ ...i })),
      subtotal,
      promoCode: promoCode || "",
      promoDiscount,
      loyaltyDiscount,
      loyaltyUsed: usedReward,
      loyaltyEarned: earned,
      fee: fulfillment.type === "pickup" ? 0 : fee,
      total: fulfillment.type === "pickup" ? Math.max(0, promoCalc.total - promoCalc.fee - loyaltyDiscount) : total,
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
    if (usedReward) spendLoyaltyPoints(LOYALTY_COST);
    const newBal = addLoyaltyPoints(earned);
    setLoyaltyBalanceState(newBal);
    setLoyaltyRedeem(false);
    setLoyaltyRedeemState(false);
    setLoyaltyBalance(newBal);
    setPlacedOrder({ ...order, loyaltyBalance: newBal });
    window.scrollTo(0, 0);
  };

  if (placedOrder) {
    return (
      <CheckoutWrap>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
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
              {formatPeso(placedOrder.total)} · {placedOrder.customer.payment}
            </p>
            {placedOrder.fulfillmentLabel ? (
              <p style={{ background: "#10233b", border: "1px solid #2f5a8a", borderRadius: ".7rem", padding: ".6rem .9rem" }}>
                {placedOrder.fulfillmentLabel}
              </p>
            ) : null}
            <div style={{ marginTop: "1rem" }}>
              {placedOrder.items.map((i) => (
                <SummaryRow key={i.id}>
                  <span>
                    {i.qty}× {i.name}
                  </span>
                  <span>{formatPeso((i.priceValue || 0) * (i.qty || 0))}</span>
                </SummaryRow>
              ))}
              <SummaryRow>
                <span>Deliver to</span>
                <span style={{ textAlign: "right", maxWidth: "60%" }}>
                  {placedOrder.customer.address}
                </span>
              </SummaryRow>
              {placedOrder.promoDiscount > 0 && (
                <SummaryRow>
                  <span>Promo ({placedOrder.promoCode})</span>
                  <span>−{formatPeso(placedOrder.promoDiscount)}</span>
                </SummaryRow>
              )}
              {placedOrder.loyaltyDiscount > 0 && (
                <SummaryRow>
                  <span>Loyalty reward</span>
                  <span>−{formatPeso(placedOrder.loyaltyDiscount)}</span>
                </SummaryRow>
              )}
              <TotalRow>
                <span>Total</span>
                <span>{formatPeso(placedOrder.total)}</span>
              </TotalRow>
              <p style={{ fontSize: ".9rem", opacity: 0.85 }}>
                You earned {placedOrder.loyaltyEarned} pts. New balance: {placedOrder.loyaltyBalance} pts.
              </p>
            </div>
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
          <PlaceOrderBtn
            type="submit"
            disabled={items.length === 0}
            aria-disabled={items.length === 0}
          >
            {items.length === 0
              ? "Cart is empty"
              : `Place order · ${formatPeso(total)}`}
          </PlaceOrderBtn>
        </Card>
        <Card aria-label="Order summary">
          <h2 style={{ marginTop: 0 }}>Order summary</h2>
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
                  <span>{formatPeso((i.priceValue || 0) * (i.qty || 0))}</span>
                </SummaryRow>
              ))}
              <SummaryRow>
                <span>Subtotal</span>
                <span>{formatPeso(subtotal)}</span>
              </SummaryRow>
              {promoDiscount > 0 && (
                <SummaryRow>
                  <span>Promo ({promoCode})</span>
                  <span>−{formatPeso(promoDiscount)}</span>
                </SummaryRow>
              )}
              {loyaltyDiscount > 0 && (
                <SummaryRow>
                  <span>Loyalty (100pts)</span>
                  <span>−{formatPeso(loyaltyDiscount)}</span>
                </SummaryRow>
              )}
              <SummaryRow>
                <span>Delivery</span>
                <span>{fee === 0 ? "FREE" : formatPeso(fee)}</span>
              </SummaryRow>
              <TotalRow>
                <span>Total</span>
                <span>{formatPeso(total)}</span>
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

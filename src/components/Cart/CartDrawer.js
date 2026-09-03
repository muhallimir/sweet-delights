import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { deliveryFee } from "../../utils/format";
import { useCurrency } from "../../utils/currency";
import { getStoredPromo, setStoredPromo, clearStoredPromo, calcPromo } from "../../utils/promo";
import { getLoyaltyBalance, getLoyaltyRedeem, setLoyaltyRedeem, calcLoyalty, earnForTotal, LOYALTY_VALUE } from "../../utils/loyalty";
import PromoForm from "../Promo/PromoForm";
import LoyaltyBox from "../Loyalty/LoyaltyBox";
import WishlistSection from "../Favorites/WishlistSection";
import DeliveryEstimator from "../Delivery/DeliveryEstimator";
import {
  CartOverlay,
  CartAside,
  CartHeader,
  CloseBtn,
  CartBody,
  EmptyMsg,
  CartItem,
  ItemImg,
  ItemInfo,
  QtyRow,
  QtyBtn,
  RemoveBtn,
  CartFooter,
  CheckoutBtn,
  ContinueBtn,
  ClearBtn,
} from "./CartElements";

const CartDrawer = () => {
  const {
    items,
    count,
    subtotal,
    isCartOpen,
    closeCart,
    increment,
    decrement,
    setQty,
    removeFromCart,
    clearCart,
  } = useCart();
  const { format } = useCurrency();

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") closeCart();
    };
    if (isCartOpen) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isCartOpen, closeCart]);

  const [promoCode, setPromoCode] = useState(() => getStoredPromo());
  const [loyaltyBalance, setLoyaltyBalance] = useState(() => getLoyaltyBalance());
  const [loyaltyRedeem, setLoyaltyRedeemState] = useState(() => getLoyaltyRedeem());

  useEffect(() => {
    if (isCartOpen) {
      setPromoCode(getStoredPromo());
      setLoyaltyBalance(getLoyaltyBalance());
      setLoyaltyRedeemState(getLoyaltyRedeem());
    }
  }, [isCartOpen]);

  const baseFee = deliveryFee(subtotal);
  const promoCalc = calcPromo(subtotal, baseFee, promoCode);
  const afterPromo = promoCalc.total - promoCalc.fee;
  const loyaltyCalc = calcLoyalty(afterPromo, loyaltyBalance, loyaltyRedeem);
  const fee = promoCalc.fee;
  const promoDiscount = promoCalc.discount;
  const loyaltyDiscount = loyaltyCalc.discount;
  const total = Math.max(0, promoCalc.total - loyaltyDiscount);
  const earnPreview = earnForTotal(total);

  const applyPromo = (code) => {
    setStoredPromo(code);
    setPromoCode(code);
  };

  const removePromo = () => {
    clearStoredPromo();
    setPromoCode("");
  };

  return (
    <>
      <CartOverlay
        open={isCartOpen}
        onClick={closeCart}
        aria-hidden={!isCartOpen}
      />
      <CartAside
        open={isCartOpen}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        aria-hidden={!isCartOpen}
      >
        <CartHeader>
          <h2>Your Cart ({count})</h2>
          <CloseBtn onClick={closeCart} aria-label="Close cart">
            ✕
          </CloseBtn>
        </CartHeader>
        <CartBody>
          {items.length === 0 ? (
            <EmptyMsg>
              Your cart is empty.
              <br />
              Add some sweets to get started.
            </EmptyMsg>
          ) : (
            <>
              <ClearBtn onClick={clearCart}>Clear cart</ClearBtn>
              {items.map((item) => (
                <CartItem key={item.id}>
                  {item.img ? (
                    <ItemImg src={item.img} alt={item.alt || item.name} />
                  ) : (
                    <div style={{ width: 64, height: 64 }} />
                  )}
                  <ItemInfo>
                    <h3 title={item.name}>{item.name}</h3>
                    {item.id && String(item.id).startsWith("sub-") ? (
                      <span style={{ fontSize: ".72rem", background: "#14351f", border: "1px solid #2f7a44", borderRadius: 999, padding: ".1rem .55rem", color: "#c8f0d2" }}>Recurring · manage here</span>
                    ) : null}
                    {item.id && String(item.id).startsWith("box-") ? (
                      <span style={{ fontSize: ".72rem", background: "#1b1b10", border: "1px solid rgba(227,201,135,.4)", borderRadius: 999, padding: ".1rem .55rem", color: "#e3c987" }}>Custom box · 10% off</span>
                    ) : null}
                    <p>{format(item.priceValue)} each</p>
                    <QtyRow>
                      <QtyBtn
                        onClick={() => decrement(item.id)}
                        aria-label={`Decrease quantity of ${item.name}`}
                      >
                        −
                      </QtyBtn>
                      <label
                        htmlFor={`qty-${item.id}`}
                        style={{ position: "absolute", left: "-9999px" }}
                      >
                        Quantity of {item.name}
                      </label>
                      <input
                        id={`qty-${item.id}`}
                        type="number"
                        min="1"
                        max="99"
                        value={item.qty}
                        onChange={(e) => setQty(item.id, e.target.value)}
                        style={{
                          width: 48,
                          textAlign: "center",
                          borderRadius: 8,
                          border: "1px solid #555",
                          background: "#222",
                          color: "#fff",
                          padding: "2px 4px",
                        }}
                      />
                      <QtyBtn
                        onClick={() => increment(item.id)}
                        aria-label={`Increase quantity of ${item.name}`}
                      >
                        +
                      </QtyBtn>
                    </QtyRow>
                    <RemoveBtn onClick={() => removeFromCart(item.id)}>
                      Remove
                    </RemoveBtn>
                  </ItemInfo>
                  <div style={{ fontWeight: 700 }}>
                    {format((item.priceValue || 0) * (item.qty || 0))}
                  </div>
                </CartItem>
              ))}
            </>
          )}
          <WishlistSection />
        </CartBody>
        {items.length > 0 && (
          <CartFooter>
            <DeliveryEstimator subtotal={subtotal} compact />
            <PromoForm appliedCode={promoCode} onApply={applyPromo} onRemove={removePromo} />
            <LoyaltyBox
              balance={loyaltyBalance}
              redeem={loyaltyRedeem}
              earnPreview={earnPreview}
              onToggle={(on) => {
                setLoyaltyRedeem(on);
                setLoyaltyRedeemState(on);
              }}
            />
            <div className="row">
              <span>Subtotal</span>
              <span>{format(subtotal)}</span>
            </div>
            {promoDiscount > 0 && (
              <div className="row">
                <span>Promo ({promoCode})</span>
                <span>−{format(promoDiscount)}</span>
              </div>
            )}
            {loyaltyDiscount > 0 && (
              <div className="row">
                <span>Loyalty (100pts)</span>
                <span>−{format(loyaltyDiscount)}</span>
              </div>
            )}
            <div className="row">
              <span>Delivery</span>
              <span>{fee === 0 ? "FREE" : format(fee)}</span>
            </div>
            <div className="row total">
              <span>Total</span>
              <span>{format(total)}</span>
            </div>
            <p className="hint">Free delivery on orders ₱500 and up. Earn 1pt per ₱1. 100pts = {format(LOYALTY_VALUE)} off.</p>
            <CheckoutBtn as={Link} to="/checkout" onClick={closeCart}>
              Go to Checkout
            </CheckoutBtn>
            <ContinueBtn onClick={closeCart}>Continue shopping</ContinueBtn>
          </CartFooter>
        )}
      </CartAside>
    </>
  );
};

export default CartDrawer;

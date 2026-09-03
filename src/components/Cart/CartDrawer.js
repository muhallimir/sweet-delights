import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { formatPeso, deliveryFee } from "../../utils/format";
import { getStoredPromo, setStoredPromo, clearStoredPromo, calcPromo } from "../../utils/promo";
import PromoForm from "../Promo/PromoForm";
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
    subtotal,
    isCartOpen,
    closeCart,
    increment,
    decrement,
    setQty,
    removeFromCart,
    clearCart,
  } = useCart();

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

  useEffect(() => {
    if (isCartOpen) setPromoCode(getStoredPromo());
  }, [isCartOpen]);

  const baseFee = deliveryFee(subtotal);
  const promoCalc = calcPromo(subtotal, baseFee, promoCode);
  const fee = promoCalc.fee;
  const promoDiscount = promoCalc.discount;
  const total = promoCalc.total;

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
          <h2>Your Cart ({items.reduce((s, i) => s + (i.qty || 0), 0)})</h2>
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
                    <p>{formatPeso(item.priceValue)} each</p>
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
                    {formatPeso((item.priceValue || 0) * (item.qty || 0))}
                  </div>
                </CartItem>
              ))}
            </>
          )}
        </CartBody>
        {items.length > 0 && (
          <CartFooter>
            <PromoForm appliedCode={promoCode} onApply={applyPromo} onRemove={removePromo} />
            <div className="row">
              <span>Subtotal</span>
              <span>{formatPeso(subtotal)}</span>
            </div>
            {promoDiscount > 0 && (
              <div className="row">
                <span>Promo ({promoCode})</span>
                <span>−{formatPeso(promoDiscount)}</span>
              </div>
            )}
            <div className="row">
              <span>Delivery</span>
              <span>{fee === 0 ? "FREE" : formatPeso(fee)}</span>
            </div>
            <div className="row total">
              <span>Total</span>
              <span>{formatPeso(total)}</span>
            </div>
            <p className="hint">Free delivery on orders ₱500 and up.</p>
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

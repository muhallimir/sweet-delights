import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useCart } from "../../context/CartContext";
import { formatPeso } from "../../utils/format";
import Reviews from "../Reviews/Reviews";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const Dialog = styled.div`
  background: #141414;
  color: #fff;
  border-radius: 1.2rem;
  max-width: 760px;
  width: 100%;
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr 1fr;
  border: 1px solid rgba(255, 255, 255, 0.1);
  @media screen and (max-width: 680px) {
    grid-template-columns: 1fr;
    max-height: 92vh;
    overflow-y: auto;
  }
`;

const Img = styled.img`
  width: 100%;
  height: 100%;
  min-height: 280px;
  object-fit: cover;
`;

const Body = styled.div`
  padding: 1.5rem;
  h2 {
    margin: 0 0 0.4rem;
    color: #e3c987;
  }
  .price {
    font-size: 1.4rem;
    font-weight: 800;
    margin: 0.5rem 0 1rem;
  }
  p.desc {
    opacity: 0.85;
    line-height: 1.6;
  }
`;

const CloseBtn = styled.button`
  position: absolute;
  margin: 0.75rem;
  right: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.55);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 999px;
  width: 36px;
  height: 36px;
  cursor: pointer;
  &:hover,
  &:focus-visible {
    background: #e3c987;
    color: #111;
    outline: 2px solid #fff;
  }
`;

const QtyRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.7rem;
  margin: 1rem 0;
  button {
    width: 34px;
    height: 34px;
    border-radius: 999px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    background: transparent;
    color: #fff;
    font-size: 1.2rem;
    cursor: pointer;
    &:hover {
      background: #e3c987;
      color: #111;
    }
  }
  input {
    width: 60px;
    text-align: center;
    border-radius: 8px;
    border: 1px solid #555;
    background: #222;
    color: #fff;
    padding: 6px;
  }
`;

const AddBtn = styled.button`
  width: 100%;
  background: #d5af4c;
  border: none;
  border-radius: 999px;
  padding: 0.85rem 1rem;
  font-weight: 800;
  font-size: 1rem;
  cursor: pointer;
  color: #111;
  &:hover,
  &:focus-visible {
    background: #ffc500;
    outline: 2px solid #fff;
    outline-offset: 2px;
  }
`;

const ProductModal = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const productId = product ? product.id : null;

  useEffect(() => {
    setQty(1);
  }, [productId]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!product) return null;

  const unit =
    typeof product.priceValue === "number"
      ? product.priceValue
      : parseFloat(String(product.price).replace(/[^0-9.]/g, "")) || 0;

  return (
    <Overlay onClick={onClose} role="presentation">
      <div style={{ position: "relative", width: "100%", maxWidth: 760 }}>
        <CloseBtn onClick={onClose} aria-label="Close product details">
          ✕
        </CloseBtn>
        <Dialog
          role="dialog"
          aria-modal="true"
          aria-label={`${product.name} details`}
          onClick={(e) => e.stopPropagation()}
        >
          <Img src={product.img} alt={product.alt || product.name} />
          <Body>
            <h2>{product.name}</h2>
            <p className="desc">{product.desc}</p>
            <p className="price">{formatPeso(unit)}</p>
            <p style={{ fontSize: ".85rem", opacity: 0.7 }}>
              Category: {product.category || "sweets"} · Best served fresh daily
            </p>
            <QtyRow>
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <label
                htmlFor="modal-qty"
                style={{ position: "absolute", left: "-9999px" }}
              >
                Quantity
              </label>
              <input
                id="modal-qty"
                type="number"
                min="1"
                max="99"
                value={qty}
                onChange={(e) => {
                  const n = Math.floor(Number(e.target.value) || 1);
                  setQty(Math.min(99, Math.max(1, n)));
                }}
              />
              <button
                type="button"
                onClick={() => setQty((q) => Math.min(99, q + 1))}
                aria-label="Increase quantity"
              >
                +
              </button>
              <span style={{ fontWeight: 700 }}>{formatPeso(unit * qty)}</span>
            </QtyRow>
            <AddBtn onClick={() => addToCart(product, qty)}>
              Add {qty} to cart · {formatPeso(unit * qty)}
            </AddBtn>
            <Reviews product={product} />
          </Body>
        </Dialog>
      </div>
    </Overlay>
  );
};

export default ProductModal;

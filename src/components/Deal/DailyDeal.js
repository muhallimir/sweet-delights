import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { allProducts } from "../Products/data";
import { useCart } from "../../context/CartContext";
import { formatPeso } from "../../utils/format";

const DealSection = styled.section`
  background: linear-gradient(135deg, #1b1206, #0d0d0d);
  border-top: 1px solid rgba(227, 201, 135, 0.25);
  border-bottom: 1px solid rgba(227, 201, 135, 0.25);
  color: #fff;
  padding: 2.5rem 1.25rem;
`;

const DealInner = styled.div`
  max-width: 1080px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 1.5rem;
  align-items: center;
  @media screen and (max-width: 640px) {
    grid-template-columns: 1fr;
  }
  img {
    width: 100%;
    height: 220px;
    object-fit: cover;
    border-radius: 1rem;
    border: 1px solid rgba(227, 201, 135, 0.4);
  }
`;

const Badge = styled.span`
  display: inline-block;
  background: #c0392b;
  color: #fff;
  font-weight: 800;
  font-size: 0.85rem;
  border-radius: 999px;
  padding: 0.25rem 0.8rem;
`;

const Timer = styled.div`
  font-variant-numeric: tabular-nums;
  font-weight: 800;
  font-size: 1.3rem;
  color: #e3c987;
  margin: 0.5rem 0;
`;

function dealForToday() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const day = Math.floor((now - start) / 86400000);
  const list = allProducts || [];
  if (list.length === 0) return null;
  const product = list[day % list.length];
  const pct = 20;
  const dealPrice = Math.round(product.priceValue * (1 - pct / 100) * 100) / 100;
  const key = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  return { product, pct, dealPrice, key };
}

function msToMidnight() {
  const now = new Date();
  const mid = new Date(now);
  mid.setHours(24, 0, 0, 0);
  return Math.max(0, mid - now);
}

function fmt(ms) {
  const s = Math.floor(ms / 1000);
  const h = String(Math.floor(s / 3600)).padStart(2, "0");
  const m = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const sec = String(s % 60).padStart(2, "0");
  return `${h}:${m}:${sec}`;
}

const DailyDeal = () => {
  const { addToCart } = useCart();
  const deal = useMemo(() => dealForToday(), []);
  const [left, setLeft] = useState(() => msToMidnight());

  useEffect(() => {
    const t = setInterval(() => setLeft(msToMidnight()), 1000);
    return () => clearInterval(t);
  }, []);

  if (!deal) return null;
  const { product, pct, dealPrice, key } = deal;

  const addDeal = () => {
    addToCart(
      {
        ...product,
        id: `deal-${key}-${product.id}`,
        name: `${product.name} (Deal -${pct}%)`,
        priceValue: dealPrice,
        price: formatPeso(dealPrice),
      },
      1
    );
  };

  return (
    <DealSection aria-label="Deal of the day">
      <DealInner>
        <img src={product.img} alt={product.alt || product.name} loading="lazy" />
        <div>
          <Badge>DEAL OF THE DAY · −{pct}%</Badge>
          <h2 style={{ margin: ".6rem 0 .2rem", color: "#e3c987" }}>{product.name}</h2>
          <p style={{ opacity: 0.85, margin: 0 }}>{product.desc}</p>
          <p style={{ margin: ".6rem 0" }}>
            <span style={{ textDecoration: "line-through", opacity: 0.6, marginRight: ".6rem" }}>{formatPeso(product.priceValue)}</span>
            <strong style={{ fontSize: "1.4rem", color: "#e3c987" }}>{formatPeso(dealPrice)}</strong>
          </p>
          <Timer role="timer" aria-label="Time left for daily deal">Ends in {fmt(left)}</Timer>
          <p style={{ fontSize: ".85rem", opacity: 0.7, margin: "0 0 .8rem" }}>Auto-rotates daily at midnight. One deal per day.</p>
          <button
            type="button"
            onClick={addDeal}
            style={{ borderRadius: 999, border: "none", background: "#e3c987", color: "#111", fontWeight: 800, padding: ".7rem 1.4rem", cursor: "pointer" }}
            aria-label={`Add daily deal ${product.name} to cart`}
          >
            Claim deal · {formatPeso(dealPrice)}
          </button>
        </div>
      </DealInner>
    </DealSection>
  );
};

export default DailyDeal;

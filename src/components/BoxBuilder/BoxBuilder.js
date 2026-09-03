import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { allProducts } from "../Products/data";
import { useCart } from "../../context/CartContext";
import { formatPeso } from "../../utils/format";

const BoxSection = styled.section`
  background: #111;
  color: #fff;
  padding: 3rem 1.25rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
`;

const BoxInner = styled.div`
  max-width: 1080px;
  margin: 0 auto;
  h2 {
    color: #e3c987;
    margin: 0 0 0.3rem;
  }
`;

const SizeRow = styled.div`
  display: flex;
  gap: 0.6rem;
  margin: 1rem 0;
`;

const SizeBtn = styled.button`
  border-radius: 999px;
  border: 1px solid ${(p) => (p.active ? "#e3c987" : "rgba(255,255,255,.25)")};
  background: ${(p) => (p.active ? "#e3c987" : "transparent")};
  color: ${(p) => (p.active ? "#111" : "#fff")};
  font-weight: 800;
  padding: 0.6rem 1.2rem;
  cursor: pointer;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 0.8rem;
  margin-top: 1rem;
`;

const PickCard = styled.div`
  background: #161616;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 0.9rem;
  padding: 0.7rem;
  text-align: center;
  img {
    width: 100%;
    height: 110px;
    object-fit: cover;
    border-radius: 0.6rem;
  }
`;

const Progress = styled.div`
  background: #222;
  border-radius: 999px;
  height: 12px;
  overflow: hidden;
  margin: 0.6rem 0;
  div {
    height: 100%;
    background: #e3c987;
    transition: width 0.25s ease;
  }
`;

const BoxBuilder = () => {
  const { addToCart } = useCart();
  const [size, setSize] = useState(6);
  const [picks, setPicks] = useState({});
  const [msg, setMsg] = useState("");

  const count = useMemo(() => Object.values(picks).reduce((s, n) => s + n, 0), [picks]);
  const boxPrice = useMemo(() => {
    let sum = 0;
    Object.entries(picks).forEach(([id, qty]) => {
      const p = (allProducts || []).find((x) => x.id === id);
      if (p) sum += (p.priceValue || 0) * qty;
    });
    return Math.round(sum * 0.9 * 100) / 100;
  }, [picks]);
  const rawSum = useMemo(() => {
    let sum = 0;
    Object.entries(picks).forEach(([id, qty]) => {
      const p = (allProducts || []).find((x) => x.id === id);
      if (p) sum += (p.priceValue || 0) * qty;
    });
    return sum;
  }, [picks]);

  const addPick = (id) => {
    if (count >= size) {
      setMsg(`Box is full (${size}pcs). Remove one or change to 12-box.`);
      return;
    }
    setMsg("");
    setPicks((p) => ({ ...p, [id]: (p[id] || 0) + 1 }));
  };

  const removePick = (id) => {
    setMsg("");
    setPicks((p) => {
      const next = { ...p };
      if (!next[id]) return p;
      if (next[id] <= 1) delete next[id];
      else next[id] -= 1;
      return next;
    });
  };

  const changeSize = (s) => {
    setSize(s);
    setMsg("");
    if (count > s) setMsg(`Overfilled for ${s}-box. Remove ${count - s} item(s).`);
  };

  const addBox = () => {
    if (count !== size) {
      setMsg(`Pick ${size - count} more to complete your ${size}-box.`);
      return;
    }
    const parts = Object.entries(picks).map(([id, qty]) => {
      const p = (allProducts || []).find((x) => x.id === id);
      return `${p ? p.name : id} x${qty}`;
    });
    const firstId = Object.keys(picks)[0];
    const first = (allProducts || []).find((x) => x.id === firstId);
    addToCart(
      {
        id: `box-${size}-${Date.now()}`,
        name: `Custom Box ${size}pc (10% off): ${parts.join(", ").slice(0, 80)}`,
        priceValue: boxPrice,
        price: formatPeso(boxPrice),
        img: first ? first.img : "",
        alt: "Custom box",
        desc: parts.join(", "),
      },
      1
    );
    setPicks({});
    setMsg(`Box added! You saved ${formatPeso(rawSum - boxPrice)}.`);
  };

  return (
    <BoxSection aria-label="Build a box">
      <BoxInner>
        <h2>Build-a-Box Combo</h2>
        <p style={{ opacity: 0.8, margin: 0 }}>Mix any treats into a 6 or 12-box. Save 10% on boxes.</p>
        <SizeRow role="group" aria-label="Box size">
          {[6, 12].map((s) => (
            <SizeBtn key={s} active={size === s} onClick={() => changeSize(s)} aria-pressed={size === s}>
              {s}-box · 10% off
            </SizeBtn>
          ))}
          <span style={{ alignSelf: "center", opacity: 0.8, fontSize: ".9rem" }}>{count}/{size} filled</span>
        </SizeRow>
        <Progress aria-hidden="true"><div style={{ width: `${Math.min(100, (count / size) * 100)}%` }} /></Progress>
        {Object.keys(picks).length > 0 ? (
          <div style={{ fontSize: ".9rem", opacity: 0.9 }}>
            Box: {Object.entries(picks).map(([id, qty]) => {
              const p = (allProducts || []).find((x) => x.id === id);
              return <span key={id} style={{ marginRight: ".6rem" }}>{p ? p.name : id} x{qty} <button type="button" onClick={() => removePick(id)} style={{ background: "transparent", border: "none", color: "#ff9a9a", cursor: "pointer", textDecoration: "underline" }} aria-label={`Remove one ${p ? p.name : id}`}>−</button></span>;
            })}
          </div>
        ) : null}
        <Grid>
          {(allProducts || []).map((p) => (
            <PickCard key={p.id}>
              <img src={p.img} alt={p.alt || p.name} loading="lazy" />
              <div style={{ fontSize: ".88rem", fontWeight: 700, margin: ".4rem 0 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={p.name}>{p.name}</div>
              <div style={{ fontSize: ".82rem", opacity: 0.8 }}>{formatPeso(p.priceValue)}{picks[p.id] ? ` · in box: ${picks[p.id]}` : ""}</div>
              <button
                type="button"
                onClick={() => addPick(p.id)}
                style={{ marginTop: ".4rem", borderRadius: 999, border: "1px solid #e3c987", background: "transparent", color: "#e3c987", padding: ".35rem .9rem", cursor: "pointer" }}
                aria-label={`Add ${p.name} to box`}
              >
                + Box
              </button>
            </PickCard>
          ))}
        </Grid>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginTop: "1rem", flexWrap: "wrap" }}>
          <div>
            {rawSum > 0 ? <span style={{ textDecoration: "line-through", opacity: 0.6, marginRight: ".6rem" }}>{formatPeso(rawSum)}</span> : null}
            <strong style={{ color: "#e3c987", fontSize: "1.2rem" }}>{formatPeso(boxPrice)}</strong>
            <span style={{ opacity: 0.7, fontSize: ".85rem" }}> · 10% box discount applied</span>
          </div>
          <button
            type="button"
            onClick={addBox}
            disabled={count !== size}
            style={{ borderRadius: 999, border: "none", background: count === size ? "#e3c987" : "#555", color: count === size ? "#111" : "#ccc", fontWeight: 800, padding: ".7rem 1.4rem", cursor: count === size ? "pointer" : "not-allowed" }}
          >
            Add {size}-box to cart
          </button>
        </div>
        {msg ? <p role="status" style={{ marginTop: ".6rem", color: "#e3c987" }}>{msg}</p> : null}
      </BoxInner>
    </BoxSection>
  );
};

export default BoxBuilder;

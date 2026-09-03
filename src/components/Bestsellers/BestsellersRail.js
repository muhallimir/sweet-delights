import React from "react";
import styled from "styled-components";
import { allProducts } from "../Products/data";
import { useCart } from "../../context/CartContext";
import { starText } from "../../utils/reviews";
import { useCurrency } from "../../utils/currency";

const RailSection = styled.section`
  background: #0d0d0d;
  color: #fff;
  padding: 3rem 1.25rem;
  max-width: 1300px;
  margin: 0 auto;
  h2 {
    color: #e3c987;
    margin: 0 0 0.3rem;
    font-size: clamp(1.5rem, 3vw, 2rem);
  }
  .sub {
    opacity: 0.75;
    margin-bottom: 1.2rem;
  }
`;

const Rail = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(240px, 280px);
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 0.8rem;
  scroll-snap-type: x mandatory;
`;

const Card = styled.div`
  position: relative;
  background: #161616;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1rem;
  overflow: hidden;
  scroll-snap-align: start;
  img {
    width: 100%;
    height: 170px;
    object-fit: cover;
    display: block;
  }
  .body {
    padding: 0.9rem 1rem 1.1rem;
  }
  .name {
    font-weight: 700;
    margin: 0 0 0.2rem;
    font-size: 1rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const Ribbon = styled.div`
  position: absolute;
  top: 12px;
  left: -8px;
  background: #e3c987;
  color: #111;
  font-weight: 800;
  font-size: 0.78rem;
  padding: 0.25rem 0.8rem 0.25rem 1rem;
  border-radius: 0 999px 999px 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
`;

const AddBtn = styled.button`
  margin-top: 0.6rem;
  width: 100%;
  border-radius: 999px;
  border: none;
  background: #d5af4c;
  color: #111;
  font-weight: 800;
  padding: 0.6rem 1rem;
  cursor: pointer;
  &:hover {
    background: #ffc500;
  }
`;

const BestsellersRail = () => {
  const { addToCart } = useCart();
  const { format } = useCurrency();
  const top = [...(allProducts || [])]
    .sort((a, b) => (b.rating || 0) - (a.rating || 0) || (b.reviewsCount || 0) - (a.reviewsCount || 0))
    .slice(0, 5);

  return (
    <RailSection aria-label="Bestsellers">
      <h2>★ Bestsellers</h2>
      <p className="sub">Top-rated treats loved by regulars. Sorted by rating.</p>
      <Rail>
        {top.map((p, idx) => (
          <Card key={p.id}>
            {idx === 0 ? <Ribbon>BESTSELLER</Ribbon> : <Ribbon style={{ background: "#fff" }}>TOP {idx + 1}</Ribbon>}
            <img src={p.img} alt={p.alt || p.name} loading="lazy" />
            <div className="body">
              <p className="name" title={p.name}>{p.name}</p>
              <div style={{ color: "#e3c987", fontSize: ".88rem" }} aria-label={`Rated ${p.rating} out of 5`}>
                {starText(p.rating)} <span style={{ color: "#fff", opacity: 0.7 }}>({p.reviewsCount})</span>
              </div>
              <div style={{ fontWeight: 800, marginTop: ".25rem" }}>{format(p.priceValue)}</div>
              <AddBtn onClick={() => addToCart(p, 1)} aria-label={`Add ${p.name} to cart`}>
                Add to cart
              </AddBtn>
            </div>
          </Card>
        ))}
      </Rail>
    </RailSection>
  );
};

export default BestsellersRail;

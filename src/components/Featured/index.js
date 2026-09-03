import React from "react";
import { FeaturedButton, FeatureContainer } from "./FeaturedElements";
import { useCart } from "../../context/CartContext";
import { allProducts } from "../Products/data";
import Reveal from "../Reveal/Reveal";

const Featured = () => {
  const { addToCart } = useCart();
  const combo = allProducts.find((p) => p.id === "combo-delights");

  return (
    <Reveal>
      <FeatureContainer>
        <h1>Best Seller</h1>
        <p>6 pcs Macaroons + 1 Tub Creamy Leche Flan</p>
        <FeaturedButton
          onClick={() => combo && addToCart(combo, 1)}
          aria-label="Order best seller combo now"
        >
          Order Now
        </FeaturedButton>
      </FeatureContainer>
    </Reveal>
  );
};

export default Featured;

import React from "react";
import {
  ProductContainer,
  ProductHeading,
  ProductWrapper,
  ProductCard,
  ProductImg,
  ProductInfo,
  ProductTitle,
  ProductDesc,
  ProductPrice,
  ProductButton,
} from "./ProductElements";
import { useCart } from "../../context/CartContext";

const Products = ({ heading, data, id }) => {
  const { addToCart } = useCart();
  return (
    <ProductContainer id={id}>
      <ProductHeading>{heading}</ProductHeading>
      <ProductWrapper>
        {/* mapping through the data */}
        {data.map((product) => {
          return (
            <ProductCard key={product.id || product.name}>
              <ProductImg
                src={product.img}
                alt={product.alt || product.name}
                loading="lazy"
              />
              <ProductInfo>
                <ProductTitle>{product.name}</ProductTitle>
                <ProductDesc>{product.desc}</ProductDesc>
                <ProductPrice>{product.price}</ProductPrice>
                <ProductButton
                  onClick={() => addToCart(product, 1)}
                  aria-label={`Add ${product.name} to cart`}
                >
                  {product.button || "Add to cart"}
                </ProductButton>
              </ProductInfo>
            </ProductCard>
          );
        })}
      </ProductWrapper>
    </ProductContainer>
  );
};

export default Products;

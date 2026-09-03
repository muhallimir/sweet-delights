import React, { useMemo, useState } from "react";
import {
  ProductCard,
  ProductImg,
  ProductInfo,
  ProductTitle,
  ProductDesc,
  ProductPrice,
  ProductButton,
} from "../Products/ProductElements";
import { useCart } from "../../context/CartContext";
import { CATEGORIES } from "../Products/data";
import ProductModal from "./ProductModal";
import {
  MenuSection,
  MenuHeading,
  MenuSub,
  Controls,
  Tabs,
  TabButton,
  SearchInput,
  SortSelect,
  ResultCount,
  Grid,
  EmptyState,
} from "./MenuElements";

function sortProducts(list, sort) {
  const arr = [...list];
  if (sort === "price-asc") arr.sort((a, b) => a.priceValue - b.priceValue);
  else if (sort === "price-desc") arr.sort((a, b) => b.priceValue - a.priceValue);
  else if (sort === "name") arr.sort((a, b) => a.name.localeCompare(b.name));
  return arr;
}

const MenuExperience = ({ heading, products, id }) => {
  const { addToCart, addQuiet } = useCart();
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = (products || []).filter((p) => {
      const matchCat = category === "all" || p.category === category;
      const matchQ =
        !q ||
        (p.name || "").toLowerCase().includes(q) ||
        (p.desc || "").toLowerCase().includes(q);
      return matchCat && matchQ;
    });
    return sortProducts(list, sort);
  }, [products, category, query, sort]);

  return (
    <MenuSection id={id || "menu"} aria-label="Bakery menu">
      <MenuHeading>{heading || "Our Menu"}</MenuHeading>
      <MenuSub>
        Filter by craving, search live, sort by price. Tap any treat for
        details.
      </MenuSub>
      <Controls>
        <Tabs role="tablist" aria-label="Filter by category">
          {CATEGORIES.map((c) => (
            <TabButton
              key={c.id}
              role="tab"
              aria-selected={category === c.id}
              active={category === c.id}
              onClick={() => setCategory(c.id)}
            >
              {c.label}
            </TabButton>
          ))}
        </Tabs>
      </Controls>
      <Controls>
        <label htmlFor="menu-search" style={{ position: "absolute", left: "-9999px" }}>
          Search menu
        </label>
        <SearchInput
          id="menu-search"
          type="search"
          placeholder="Search leche flan, spaghetti..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <label htmlFor="menu-sort" style={{ position: "absolute", left: "-9999px" }}>
          Sort menu
        </label>
        <SortSelect
          id="menu-sort"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          aria-label="Sort menu"
        >
          <option value="featured">Sort: Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name">Name: A to Z</option>
        </SortSelect>
      </Controls>
      <ResultCount role="status">
        {filtered.length} {filtered.length === 1 ? "treat" : "treats"}
        {query ? ` for “${query}”` : ""}
        {category !== "all" ? ` in ${category}` : ""}
      </ResultCount>
      <Grid>
        {filtered.map((product) => (
          <ProductCard key={product.id}>
            <button
              type="button"
              onClick={() => setSelected(product)}
              aria-label={`View ${product.name} details`}
              style={{
                background: "transparent",
                border: "none",
                padding: 0,
                cursor: "pointer",
              }}
            >
              <ProductImg
                src={product.img}
                alt={product.alt || product.name}
                loading="lazy"
              />
            </button>
            <ProductInfo>
              <ProductTitle>{product.name}</ProductTitle>
              <ProductDesc>{product.desc}</ProductDesc>
              <ProductPrice>{product.price}</ProductPrice>
              <div style={{ display: "flex", gap: ".5rem" }}>
                <ProductButton
                  onClick={() => setSelected(product)}
                  aria-label={`View ${product.name}`}
                  style={{
                    background: "transparent",
                    border: "1px solid #e3c987",
                    color: "#e3c987",
                    padding: "1rem 1.2rem",
                  }}
                >
                  Details
                </ProductButton>
                <ProductButton
                  onClick={() => addToCart(product, 1)}
                  aria-label={`Add ${product.name} to cart`}
                >
                  {product.button || "Add to cart"}
                </ProductButton>
              </div>
              <button
                type="button"
                onClick={() => addQuiet(product, 1)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "rgba(255,255,255,.6)",
                  fontSize: ".8rem",
                  marginTop: ".4rem",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
                aria-label={`Quick add ${product.name} without opening cart`}
              >
                Quick add
              </button>
            </ProductInfo>
          </ProductCard>
        ))}
      </Grid>
      {filtered.length === 0 && (
        <EmptyState>
          <p>No treats found. Try another search or category.</p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setCategory("all");
            }}
            style={{
              marginTop: ".6rem",
              borderRadius: 999,
              border: "1px solid #e3c987",
              background: "transparent",
              color: "#e3c987",
              padding: ".6rem 1.2rem",
              cursor: "pointer",
            }}
          >
            Reset filters
          </button>
        </EmptyState>
      )}
      {selected && (
        <ProductModal product={selected} onClose={() => setSelected(null)} />
      )}
    </MenuSection>
  );
};

export default MenuExperience;

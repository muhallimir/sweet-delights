import React, { useEffect, useMemo, useState } from "react";
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
import { CATEGORIES, DIET_FILTERS } from "../Products/data";
import { getFavorites, toggleFavorite } from "../../utils/favorites";
import { starText } from "../../utils/reviews";
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
  const [favorites, setFavorites] = useState(() => getFavorites());
  const [savedOnly, setSavedOnly] = useState(false);
  const [diets, setDiets] = useState([]);

  useEffect(() => {
    const onFav = (e) => {
      if (e && e.detail) setFavorites(e.detail);
      else setFavorites(getFavorites());
    };
    window.addEventListener("sd:favorites", onFav);
    return () => window.removeEventListener("sd:favorites", onFav);
  }, []);

  const toggleDiet = (id) => {
    setDiets((prev) => (prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]));
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = (products || []).filter((p) => {
      const matchCat = category === "all" || p.category === category;
      const matchQ =
        !q ||
        (p.name || "").toLowerCase().includes(q) ||
        (p.desc || "").toLowerCase().includes(q);
      const matchFav = !savedOnly || favorites.includes(p.id);
      const matchDiet = diets.length === 0 || diets.every((d) => p.diet && p.diet[d]);
      return matchCat && matchQ && matchFav && matchDiet;
    });
    return sortProducts(list, sort);
  }, [products, category, query, sort, savedOnly, favorites, diets]);

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
          <TabButton
            role="tab"
            aria-selected={savedOnly}
            active={savedOnly}
            onClick={() => setSavedOnly((s) => !s)}
            aria-label={`Show saved only, ${favorites.length} items`}
          >
            ♥ Saved ({favorites.length})
          </TabButton>
        </Tabs>
      </Controls>
      <Controls>
        <div role="group" aria-label="Diet and allergen filters" style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
          {DIET_FILTERS.map((d) => {
            const active = diets.includes(d.id);
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => toggleDiet(d.id)}
                aria-pressed={active}
                style={{
                  borderRadius: 999,
                  border: active ? "1px solid #e3c987" : "1px solid rgba(255,255,255,.25)",
                  background: active ? "#e3c987" : "transparent",
                  color: active ? "#111" : "#fff",
                  padding: ".4rem .9rem",
                  cursor: "pointer",
                  fontSize: ".85rem",
                  fontWeight: active ? 800 : 400,
                }}
              >
                <span aria-hidden="true">{d.icon} </span>{d.label}
              </button>
            );
          })}
          {diets.length > 0 ? (
            <button type="button" onClick={() => setDiets([])} style={{ background: "transparent", border: "none", color: "#ff9a9a", cursor: "pointer", textDecoration: "underline", fontSize: ".85rem" }}>
              Clear diet filters
            </button>
          ) : null}
        </div>
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
        {filtered.map((product) => {
          const fav = favorites.includes(product.id);
          return (
          <ProductCard key={product.id} style={{ position: "relative" }}>
            <button
              type="button"
              onClick={() => {
                const next = toggleFavorite(product.id);
                setFavorites(next);
              }}
              aria-label={fav ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
              aria-pressed={fav}
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                zIndex: 2,
                width: 38,
                height: 38,
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,.3)",
                background: fav ? "#e3c987" : "rgba(0,0,0,.55)",
                color: fav ? "#111" : "#fff",
                fontSize: "1.1rem",
                cursor: "pointer",
              }}
            >
              {fav ? "♥" : "♡"}
            </button>
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
              <div style={{ color: "#e3c987", fontSize: ".9rem" }} aria-label={`Rated ${product.rating || 5} out of 5`}>
                {starText(product.rating || 5)} <span style={{ color: "#fff", opacity: 0.7, fontSize: ".8rem" }}>({product.reviewsCount || 0})</span>
              </div>
              <div style={{ display: "flex", gap: ".35rem", flexWrap: "wrap", justifyContent: "center", margin: ".35rem 0" }} aria-label="Diet info">
                {product.diet && product.diet.vegan ? <span title="Vegan" style={{ fontSize: ".8rem", background: "#14351f", borderRadius: 999, padding: ".1rem .55rem" }}>🌱 vegan</span> : null}
                {product.diet && product.diet.glutenFree ? <span title="Gluten-free" style={{ fontSize: ".8rem", background: "#222", borderRadius: 999, padding: ".1rem .55rem", border: "1px solid rgba(255,255,255,.15)" }}>GF</span> : null}
                {product.diet && product.diet.nutFree ? <span title="Nut-free" style={{ fontSize: ".8rem", background: "#222", borderRadius: 999, padding: ".1rem .55rem", border: "1px solid rgba(255,255,255,.15)" }}>🥜‍🚫</span> : null}
                {product.diet && product.diet.dairyFree ? <span title="Dairy-free" style={{ fontSize: ".8rem", background: "#222", borderRadius: 999, padding: ".1rem .55rem", border: "1px solid rgba(255,255,255,.15)" }}>DF</span> : null}
              </div>
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
          );
        })}
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

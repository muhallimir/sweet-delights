import React, { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";
import { allProducts } from "../Products/data";
import { getFavorites, toggleFavorite } from "../../utils/favorites";
import { useCurrency } from "../../utils/currency";

const WishlistSection = () => {
  const { addToCart, items } = useCart();
  const { format } = useCurrency();
  const [favorites, setFavorites] = useState(() => getFavorites());

  useEffect(() => {
    const onFav = (e) => {
      if (e && e.detail) setFavorites(e.detail);
      else setFavorites(getFavorites());
    };
    window.addEventListener("sd:favorites", onFav);
    return () => window.removeEventListener("sd:favorites", onFav);
  }, []);

  const saved = (allProducts || []).filter((p) => favorites.includes(p.id));
  const inCartIds = new Set((items || []).map((i) => i.id));
  const toShow = saved.filter((p) => !inCartIds.has(p.id));

  if (saved.length === 0) return null;

  return (
    <div style={{ marginTop: "1rem", borderTop: "1px dashed rgba(255,255,255,.15)", paddingTop: ".8rem" }} aria-label="Wishlist">
      <h3 style={{ fontSize: ".95rem", margin: "0 0 .6rem", color: "#e3c987" }}>
        ♥ Wishlist ({saved.length})
      </h3>
      {toShow.length === 0 ? (
        <p style={{ fontSize: ".85rem", opacity: 0.75 }}>All saved items are in your cart.</p>
      ) : (
        toShow.map((p) => (
          <div key={p.id} style={{ display: "flex", alignItems: "center", gap: ".6rem", marginBottom: ".6rem" }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: ".88rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
              <div style={{ fontSize: ".8rem", opacity: 0.75 }}>{format(p.priceValue)}</div>
            </div>
            <button
              type="button"
              onClick={() => addToCart(p, 1)}
              style={{ borderRadius: 999, border: "none", background: "#e3c987", color: "#111", fontWeight: 700, padding: ".35rem .8rem", cursor: "pointer", fontSize: ".8rem" }}
              aria-label={`Move ${p.name} to cart`}
            >
              Move to cart
            </button>
            <button
              type="button"
              onClick={() => {
                const next = toggleFavorite(p.id);
                setFavorites(next);
              }}
              style={{ background: "transparent", border: "none", color: "#ff9a9a", cursor: "pointer", fontSize: ".8rem", textDecoration: "underline" }}
              aria-label={`Remove ${p.name} from wishlist`}
            >
              Remove
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default WishlistSection;

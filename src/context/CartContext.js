import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import { parsePriceToNumber, cartCount, cartSubtotal } from "../utils/format";

const CartContext = createContext(null);
const STORAGE_KEY = "sweet-delights-cart-v1";

function toCartItem(product, qty) {
  const priceValue =
    typeof product.priceValue === "number"
      ? product.priceValue
      : parsePriceToNumber(product.price);
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    priceValue,
    img: product.img,
    alt: product.alt || product.name,
    desc: product.desc || "",
    qty: qty || 1,
  };
}

function cartReducer(state, action) {
  switch (action.type) {
    case "HYDRATE":
      return Array.isArray(action.items) ? action.items : state;
    case "ADD": {
      const { product, qty } = action;
      if (!product || !product.id) return state;
      const addQty = Math.max(1, Math.min(99, qty || 1));
      const found = state.find((i) => i.id === product.id);
      if (found) {
        return state.map((i) =>
          i.id === product.id
            ? { ...i, qty: Math.min(99, (i.qty || 0) + addQty) }
            : i
        );
      }
      return [...state, toCartItem(product, addQty)];
    }
    case "REMOVE":
      return state.filter((i) => i.id !== action.id);
    case "SET_QTY": {
      const q = Number(action.qty);
      if (!action.id) return state;
      if (!Number.isFinite(q) || q <= 0) {
        return state.filter((i) => i.id !== action.id);
      }
      return state.map((i) =>
        i.id === action.id ? { ...i, qty: Math.min(99, Math.floor(q)) } : i
      );
    }
    case "INCREMENT":
      return state.map((i) =>
        i.id === action.id ? { ...i, qty: Math.min(99, (i.qty || 0) + 1) } : i
      );
    case "DECREMENT": {
      const target = state.find((i) => i.id === action.id);
      if (!target) return state;
      if ((target.qty || 0) <= 1) {
        return state.filter((i) => i.id !== action.id);
      }
      return state.map((i) =>
        i.id === action.id ? { ...i, qty: (i.qty || 0) - 1 } : i
      );
    }
    case "CLEAR":
      return [];
    default:
      return state;
  }
}

function loadInitialCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((i) => i && i.id && Number(i.qty) > 0)
      .map((i) => ({
        ...i,
        qty: Math.min(99, Math.max(1, Math.floor(Number(i.qty) || 1))),
        priceValue:
          typeof i.priceValue === "number"
            ? i.priceValue
            : parsePriceToNumber(i.price),
      }));
  } catch (e) {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, [], loadInitialCart);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [lastAddedId, setLastAddedId] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      // storage full or unavailable, ignore
    }
  }, [items]);

  const value = useMemo(() => {
    const count = cartCount(items);
    const subtotal = cartSubtotal(items);
    return {
      items,
      count,
      subtotal,
      isCartOpen,
      lastAddedId,
      openCart: () => setIsCartOpen(true),
      closeCart: () => setIsCartOpen(false),
      addToCart: (product, qty) => {
        dispatch({ type: "ADD", product, qty: qty || 1 });
        setLastAddedId(product && product.id ? product.id : null);
        setIsCartOpen(true);
      },
      addQuiet: (product, qty) => {
        dispatch({ type: "ADD", product, qty: qty || 1 });
        setLastAddedId(product && product.id ? product.id : null);
      },
      removeFromCart: (id) => dispatch({ type: "REMOVE", id }),
      setQty: (id, qty) => dispatch({ type: "SET_QTY", id, qty }),
      increment: (id) => dispatch({ type: "INCREMENT", id }),
      decrement: (id) => dispatch({ type: "DECREMENT", id }),
      clearCart: () => dispatch({ type: "CLEAR" }),
    };
  }, [items, isCartOpen, lastAddedId]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

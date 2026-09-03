import { useCallback, useEffect, useState } from "react";

export const CURRENCY_KEY = "sd-currency";
export const PHP_PER_USD = 56;

export function getCurrency() {
  try {
    const v = localStorage.getItem(CURRENCY_KEY);
    return v === "USD" ? "USD" : "PHP";
  } catch (e) {
    return "PHP";
  }
}

export function setCurrency(cur) {
  try {
    localStorage.setItem(CURRENCY_KEY, cur === "USD" ? "USD" : "PHP");
    window.dispatchEvent(new CustomEvent("sd:currency", { detail: cur }));
  } catch (e) {
    // ignore
  }
}

export function convertPhp(valuePhp, currency) {
  const n = Number(valuePhp) || 0;
  if (currency === "USD") return n / PHP_PER_USD;
  return n;
}

export function formatPrice(valuePhp, currency) {
  const cur = currency || getCurrency();
  const n = Number(valuePhp) || 0;
  if (cur === "USD") {
    const usd = n / PHP_PER_USD;
    try {
      return "$" + usd.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    } catch (e) {
      return "$" + usd.toFixed(2);
    }
  }
  try {
    return "₱" + n.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  } catch (e) {
    return "₱" + n.toFixed(2);
  }
}

export function useCurrency() {
  const [currency, setCur] = useState(() => getCurrency());
  useEffect(() => {
    const onChange = (e) => {
      if (e && e.detail) setCur(e.detail === "USD" ? "USD" : "PHP");
      else setCur(getCurrency());
    };
    window.addEventListener("sd:currency", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("sd:currency", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);
  const format = useCallback((v) => formatPrice(v, currency), [currency]);
  const toggle = useCallback(() => {
    const next = currency === "USD" ? "PHP" : "USD";
    setCurrency(next);
    setCur(next);
  }, [currency]);
  return { currency, format, toggle, setCurrency: (c) => { setCurrency(c); setCur(c); } };
}

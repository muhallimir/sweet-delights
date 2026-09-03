import { useCallback, useEffect, useState } from "react";

const KEY = "sd-theme";

export function getTheme() {
  try {
    const v = localStorage.getItem(KEY);
    return v === "light" ? "light" : "dark";
  } catch (e) {
    return "dark";
  }
}

export function applyTheme(theme) {
  try {
    document.documentElement.setAttribute("data-theme", theme);
    document.body.setAttribute("data-theme", theme);
  } catch (e) {
    // ignore
  }
}

export function setTheme(theme) {
  const next = theme === "light" ? "light" : "dark";
  try {
    localStorage.setItem(KEY, next);
  } catch (e) {
    // ignore
  }
  applyTheme(next);
  try {
    window.dispatchEvent(new CustomEvent("sd:theme", { detail: next }));
  } catch (e) {
    // ignore
  }
}

export function useTheme() {
  const [theme, setThemeState] = useState(() => getTheme());

  useEffect(() => {
    applyTheme(theme);
    const onChange = (e) => {
      if (e && e.detail) {
        setThemeState(e.detail);
        applyTheme(e.detail);
      } else {
        const cur = getTheme();
        setThemeState(cur);
        applyTheme(cur);
      }
    };
    window.addEventListener("sd:theme", onChange);
    return () => window.removeEventListener("sd:theme", onChange);
  }, [theme]);

  const toggle = useCallback(() => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    setThemeState(next);
  }, [theme]);

  return { theme, toggle, setTheme: (t) => { setTheme(t); setThemeState(t); } };
}

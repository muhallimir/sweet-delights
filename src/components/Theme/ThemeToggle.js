import React from "react";
import { useTheme } from "../../utils/theme";

const ThemeToggle = () => {
  const { theme, toggle } = useTheme();
  const isLight = theme === "light";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
      aria-pressed={isLight}
      title={isLight ? "Dark mode" : "Light mode"}
      style={{
        borderRadius: 999,
        border: "1px solid rgba(255,255,255,.3)",
        background: isLight ? "#fff" : "transparent",
        color: isLight ? "#111" : "#fff",
        width: 32,
        height: 30,
        cursor: "pointer",
        fontSize: "0.95rem",
        flexShrink: 0,
      }}
    >
      {isLight ? "☀️" : "🌙"}
    </button>
  );
};

export default ThemeToggle;

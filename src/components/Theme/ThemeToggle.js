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
        width: 38,
        height: 32,
        cursor: "pointer",
        fontSize: "1rem",
      }}
    >
      {isLight ? "☀️" : "🌙"}
    </button>
  );
};

export default ThemeToggle;

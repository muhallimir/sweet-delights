import React from "react";
import {
  computeMacroPercents,
  macroConicGradient,
  macroTableRows,
  macroAriaLabel,
} from "../../utils/macros";

const MacroPie = ({ product }) => {
  const percents = computeMacroPercents(product);
  const gradient = macroConicGradient(percents);
  const rows = macroTableRows(percents);
  const ariaLabel = macroAriaLabel(percents);

  return (
    <div
      aria-label={ariaLabel}
      style={{
        marginTop: ".7rem",
        padding: ".7rem .9rem",
        background: "#101010",
        border: "1px solid rgba(255,255,255,.12)",
        borderRadius: ".7rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
        <div
          aria-hidden="true"
          style={{
            width: 110,
            height: 110,
            borderRadius: "50%",
            background: gradient,
            position: "relative",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 14,
              borderRadius: "50%",
              background: "#1b1b10",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: ".7rem",
              color: "#e3c987",
              fontWeight: 700,
              flexDirection: "column",
              lineHeight: 1.2,
              textAlign: "center",
            }}
          >
            <span>Macros</span>
            <span style={{ opacity: 0.7 }}>{percents.estimated ? "est." : "real"}</span>
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: ".88rem" }}>
            <caption className="sr-only" style={{ position: "absolute", left: "-9999px" }}>
              {ariaLabel}
            </caption>
            <thead>
              <tr style={{ textAlign: "left", color: "#e3c987" }}>
                <th style={{ padding: ".25rem .35rem" }}>Macro</th>
                <th style={{ padding: ".25rem .35rem" }}>%</th>
                <th style={{ padding: ".25rem .35rem" }}>Grams</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.key}>
                  <td style={{ padding: ".25rem .35rem" }}>
                    <span
                      aria-hidden="true"
                      style={{
                        display: "inline-block",
                        width: 10,
                        height: 10,
                        background: r.color,
                        borderRadius: 2,
                        marginRight: ".35rem",
                      }}
                    />
                    {r.label}
                  </td>
                  <td style={{ padding: ".25rem .35rem" }}>{r.percent}%</td>
                  <td style={{ padding: ".25rem .35rem" }}>{r.grams > 0 ? `${r.grams} g` : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MacroPie;
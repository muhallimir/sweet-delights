import React, { useState } from "react";
import { validatePromo, normalizePromo } from "../../utils/promo";

const PromoForm = ({ appliedCode, onApply, onRemove }) => {
  const [input, setInput] = useState(appliedCode || "");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  React.useEffect(() => {
    setInput(appliedCode || "");
  }, [appliedCode]);

  const submit = (e) => {
    e.preventDefault();
    const result = validatePromo(input);
    if (!result.ok) {
      setMessage(result.message);
      setIsError(true);
      return;
    }
    setMessage(result.message);
    setIsError(false);
    onApply(result.code);
  };

  if (appliedCode) {
    return (
      <div
        style={{
          background: "#14351f",
          border: "1px solid #2f7a44",
          borderRadius: ".7rem",
          padding: ".7rem .9rem",
          marginBottom: ".8rem",
          fontSize: ".9rem",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: ".6rem", alignItems: "center" }}>
          <span>
            Code <strong>{normalizePromo(appliedCode)}</strong> applied
          </span>
          <button
            type="button"
            onClick={onRemove}
            style={{
              background: "transparent",
              border: "1px solid rgba(255,255,255,.3)",
              color: "#fff",
              borderRadius: 999,
              padding: ".2rem .7rem",
              cursor: "pointer",
              fontSize: ".8rem",
            }}
            aria-label="Remove promo code"
          >
            Remove
          </button>
        </div>
        {message && !isError ? (
          <div style={{ marginTop: ".3rem", color: "#c8f0d2" }} role="status">
            {message}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <form onSubmit={submit} style={{ marginBottom: ".8rem" }} aria-label="Promo code form">
      <label htmlFor="promo-input" style={{ display: "block", fontSize: ".85rem", marginBottom: ".3rem" }}>
        Promo code (try SWEET10 or FREESHIP)
      </label>
      <div style={{ display: "flex", gap: ".5rem" }}>
        <input
          id="promo-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="SWEET10"
          autoComplete="off"
          style={{
            flex: 1,
            borderRadius: 8,
            border: "1px solid #555",
            background: "#222",
            color: "#fff",
            padding: ".55rem .7rem",
            textTransform: "uppercase",
          }}
          aria-invalid={isError}
          aria-describedby={message ? "promo-msg" : undefined}
        />
        <button
          type="submit"
          style={{
            borderRadius: 999,
            border: "none",
            background: "#e3c987",
            color: "#111",
            fontWeight: 700,
            padding: ".55rem 1rem",
            cursor: "pointer",
          }}
        >
          Apply
        </button>
      </div>
      {message ? (
        <div
          id="promo-msg"
          role={isError ? "alert" : "status"}
          style={{ fontSize: ".82rem", marginTop: ".35rem", color: isError ? "#ff9a9a" : "#c8f0d2" }}
        >
          {message}
        </div>
      ) : null}
    </form>
  );
};

export default PromoForm;

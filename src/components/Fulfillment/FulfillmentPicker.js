import React from "react";
import { TIME_SLOTS } from "../../utils/fulfillment";

const FulfillmentPicker = ({ value, onChange, errors }) => {
  const set = (k, v) => onChange({ ...value, [k]: v });

  return (
    <div style={{ background: "#101010", border: "1px solid rgba(255,255,255,.1)", borderRadius: ".8rem", padding: ".9rem", marginBottom: "1rem" }} aria-label="Pickup or delivery scheduling">
      <div role="group" aria-label="Fulfillment type" style={{ display: "flex", gap: ".6rem", marginBottom: ".8rem" }}>
        {["delivery", "pickup"].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => set("type", t)}
            aria-pressed={value.type === t}
            style={{
              flex: 1,
              borderRadius: 999,
              border: value.type === t ? "1px solid #e3c987" : "1px solid rgba(255,255,255,.25)",
              background: value.type === t ? "#e3c987" : "transparent",
              color: value.type === t ? "#111" : "#fff",
              fontWeight: 800,
              padding: ".6rem 1rem",
              cursor: "pointer",
              textTransform: "capitalize",
            }}
          >
            {t}
          </button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".6rem" }}>
        <div>
          <label htmlFor="ful-date" style={{ display: "block", fontSize: ".85rem", marginBottom: ".3rem" }}>Date *</label>
          <input
            id="ful-date"
            type="date"
            value={value.date || ""}
            onChange={(e) => set("date", e.target.value)}
            style={{ width: "100%", borderRadius: 8, border: "1px solid #555", background: "#0f0f0f", color: "#fff", padding: ".6rem .7rem" }}
          />
          {errors && errors.date ? <div role="alert" style={{ color: "#ff9a9a", fontSize: ".82rem", marginTop: ".25rem" }}>{errors.date}</div> : null}
        </div>
        <div>
          <label htmlFor="ful-slot" style={{ display: "block", fontSize: ".85rem", marginBottom: ".3rem" }}>Time slot *</label>
          <select
            id="ful-slot"
            value={value.slot || ""}
            onChange={(e) => set("slot", e.target.value)}
            style={{ width: "100%", borderRadius: 8, border: "1px solid #555", background: "#0f0f0f", color: "#fff", padding: ".6rem .7rem" }}
          >
            <option value="">Pick slot</option>
            {TIME_SLOTS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {errors && errors.slot ? <div role="alert" style={{ color: "#ff9a9a", fontSize: ".82rem", marginTop: ".25rem" }}>{errors.slot}</div> : null}
        </div>
      </div>
      <p style={{ fontSize: ".82rem", opacity: 0.7, margin: ".6rem 0 0" }}>
        {value.type === "pickup" ? "Pickup at Poblacion store. Bring your order ID." : "Rider delivers in your slot. Free over ₱500."}
      </p>
    </div>
  );
};

export default FulfillmentPicker;

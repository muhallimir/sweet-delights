import React, { useMemo, useState } from "react";
import { useCurrency } from "../../utils/currency";

export const CATERING_TIERS = [
  { id: "standard", label: "Standard · ₱180/head", price: 180, desc: "Pasta + sweets + drinks" },
  { id: "premium", label: "Premium · ₱280/head", price: 280, desc: "2 mains + desserts + drinks" },
  { id: "deluxe", label: "Deluxe · ₱380/head", price: 380, desc: "Lechon belly + full spread" },
];

export const CATERING_ADDONS = [
  { id: "dessert", label: "Dessert bar", price: 2500, perHead: false },
  { id: "lechon", label: "Lechon station", price: 6000, perHead: false },
  { id: "drinks", label: "Drinks package", price: 60, perHead: true },
  { id: "crew", label: "Service crew", price: 1500, perHead: false },
];

export function calcCateringQuote({ guests, tierId, addons }) {
  const g = Math.max(10, Math.min(1000, Number(guests) || 0));
  const tier =
    CATERING_TIERS.find((t) => t.id === tierId) || CATERING_TIERS[1];
  let sum = g * tier.price;
  (addons || []).forEach((id) => {
    const a = CATERING_ADDONS.find((x) => x.id === id);
    if (!a) return;
    sum += a.perHead ? a.price * g : a.price;
  });
  return Math.round(sum);
}

const TIERS = CATERING_TIERS;
const ADDONS = CATERING_ADDONS;

const QuoteCalculator = () => {
  const [guests, setGuests] = useState(50);
  const { format } = useCurrency();
  const [tier, setTier] = useState("premium");
  const [addons, setAddons] = useState(["dessert"]);
  const [sent, setSent] = useState("");

  const tierObj = TIERS.find((t) => t.id === tier) || TIERS[1];

  const total = useMemo(
    () => calcCateringQuote({ guests, tierId: tier, addons }),
    [guests, tier, addons]
  );

  const toggleAddon = (id) => {
    setAddons((prev) => (prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]));
    setSent("");
  };

  const prefill = () => {
    const g = Math.max(10, Math.min(1000, Number(guests) || 50));
    const addonLabels = addons.map((id) => {
      const a = ADDONS.find((x) => x.id === id);
      return a ? a.label : id;
    }).join(", ") || "none";
    const message = `Quote: ${g} guests x ${tierObj.label} + addons (${addonLabels}) = ${format(total)}. Please confirm availability and final menu.`;
    try {
      window.dispatchEvent(new CustomEvent("sd:catering-prefill", { detail: { guests: String(g), message } }));
    } catch (e) {
      // ignore
    }
    setSent("Quote added to the inquiry form below. Just add your name and date, then send.");
    const el = document.getElementById("cat-msg");
    if (el) el.focus();
  };

  return (
    <div style={{ background: "#101010", border: "1px solid rgba(227,201,135,.3)", borderRadius: ".9rem", padding: "1rem 1.1rem", marginBottom: "1rem" }} aria-label="Catering quote calculator">
      <h3 style={{ margin: "0 0 .3rem", color: "#e3c987" }}>Instant quote calculator</h3>
      <p style={{ fontSize: ".88rem", opacity: 0.8, margin: "0 0 .8rem" }}>Guests x tier + add-ons. Live total, prefill inquiry in one click.</p>
      <div style={{ display: "grid", gap: ".7rem" }}>
        <label style={{ fontSize: ".9rem" }}>
          Guests (10-1000)
          <input type="number" min="10" max="1000" value={guests} onChange={(e) => { setGuests(e.target.value); setSent(""); }} style={{ display: "block", marginTop: ".3rem", width: 160, borderRadius: 8, border: "1px solid #555", background: "#222", color: "#fff", padding: ".55rem .7rem" }} />
        </label>
        <div role="group" aria-label="Per-head tier">
          {TIERS.map((t) => (
            <label key={t.id} style={{ display: "flex", gap: ".6rem", alignItems: "center", background: "#0f0f0f", border: "1px solid rgba(255,255,255,.12)", borderRadius: ".7rem", padding: ".6rem .8rem", cursor: "pointer", marginBottom: ".4rem" }}>
              <input type="radio" name="tier" value={t.id} checked={tier === t.id} onChange={() => { setTier(t.id); setSent(""); }} />
              <span><strong>{t.label}</strong><br /><span style={{ fontSize: ".82rem", opacity: 0.75 }}>{t.desc}</span></span>
            </label>
          ))}
        </div>
        <div>
          <div style={{ fontSize: ".9rem", fontWeight: 700, marginBottom: ".35rem" }}>Add-ons</div>
          {ADDONS.map((a) => (
            <label key={a.id} style={{ display: "flex", gap: ".6rem", alignItems: "center", marginBottom: ".35rem", cursor: "pointer", fontSize: ".92rem" }}>
              <input type="checkbox" checked={addons.includes(a.id)} onChange={() => toggleAddon(a.id)} />
              {a.label} · {a.perHead ? `${format(a.price)}/head` : format(a.price)}
            </label>
          ))}
        </div>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
          <strong style={{ fontSize: "1.3rem", color: "#e3c987" }}>{format(total)}</strong>
          <span style={{ fontSize: ".85rem", opacity: 0.7 }}>{guests} guests · {tierObj.label}</span>
          <button type="button" onClick={prefill} style={{ borderRadius: 999, border: "none", background: "#e3c987", color: "#111", fontWeight: 800, padding: ".65rem 1.3rem", cursor: "pointer" }}>
            Use this quote in inquiry
          </button>
        </div>
        {sent ? <p role="status" style={{ color: "#c8f0d2", fontSize: ".88rem" }}>{sent}</p> : null}
      </div>
    </div>
  );
};

export default QuoteCalculator;

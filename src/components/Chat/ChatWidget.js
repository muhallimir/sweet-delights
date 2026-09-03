import React, { useState } from "react";
import styled from "styled-components";

const Fab = styled.button`
  position: fixed;
  right: 18px;
  bottom: 18px;
  z-index: 1300;
  width: 58px;
  height: 58px;
  border-radius: 999px;
  border: none;
  background: #e3c987;
  color: #111;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: 0 6px 24px rgba(0,0,0,.45);
`;

const Panel = styled.div`
  position: fixed;
  right: 18px;
  bottom: 86px;
  z-index: 1300;
  width: min(340px, calc(100vw - 36px));
  background: #141414;
  color: #fff;
  border: 1px solid rgba(255,255,255,.15);
  border-radius: 1rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-height: 480px;
`;

const ANSWERS = {
  hours: "Open Mon-Sat 8AM-8PM, Sun 9AM-6PM. Pickup at Poblacion or Calamba. Same-day for menu items, 2 days for 50+ pax catering.",
  delivery: "Metro Manila ₱49 (45-60 min), Calabarzon ₱79 (1-2h), Provincial ₱129 (1-2 days). FREE over ₱500. Try FREESHIP or check estimator in cart.",
  allergen: "Menu has diet chips: nut-free, gluten-free, vegan, dairy-free. Tap Details then View nutrition for ingredients + allergens per product.",
  promo: "Try SWEET10 for 10% off, FREESHIP for free delivery. Birthday month? Use BDAY15 from Birthday Club.",
  default: "Thanks! For orders use Track (/track) with your SD- ID. For bulk, try the catering quote calculator. Anything else? Tap a topic below.",
};

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! I am SweetBot (demo). Ask about hours, delivery, allergens, or promos." },
  ]);
  const [input, setInput] = useState("");

  const reply = (text) => {
    const t = String(text || "").toLowerCase();
    let key = "default";
    if (t.includes("hour") || t.includes("open") || t.includes("close")) key = "hours";
    else if (t.includes("deliver") || t.includes("ship") || t.includes("fee") || t.includes("eta") || t.includes("post")) key = "delivery";
    else if (t.includes("aller") || t.includes("nut") || t.includes("vegan") || t.includes("gluten") || t.includes("dairy")) key = "allergen";
    else if (t.includes("promo") || t.includes("code") || t.includes("discount") || t.includes("coupon") || t.includes("sweet10") || t.includes("freeship")) key = "promo";
    setMessages((prev) => [...prev, { from: "user", text: String(text).slice(0, 200) }, { from: "bot", text: ANSWERS[key] }]);
  };

  const send = (e) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;
    reply(input.trim());
    setInput("");
  };

  return (
    <>
      <Fab onClick={() => setOpen((o) => !o)} aria-label={open ? "Close chat" : "Open chat"} aria-expanded={open}>
        {open ? "✕" : "💬"}
      </Fab>
      {open ? (
        <Panel role="dialog" aria-label="SweetBot chat">
          <div style={{ background: "#1b1b10", padding: ".8rem 1rem", fontWeight: 800, color: "#e3c987" }}>
            SweetBot · mock · no backend
          </div>
          <div style={{ padding: ".8rem", overflowY: "auto", display: "grid", gap: ".5rem", flex: 1 }} aria-live="polite">
            {messages.map((m, i) => (
              <div key={i} style={{ justifySelf: m.from === "bot" ? "start" : "end", background: m.from === "bot" ? "#222" : "#e3c987", color: m.from === "bot" ? "#fff" : "#111", borderRadius: ".8rem", padding: ".55rem .8rem", maxWidth: "85%", fontSize: ".9rem" }}>
                {m.text}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: ".4rem", flexWrap: "wrap", padding: "0 .8rem" }}>
            {["hours", "delivery", "allergen", "promo"].map((k) => (
              <button key={k} type="button" onClick={() => reply(k)} style={{ borderRadius: 999, border: "1px solid rgba(255,255,255,.25)", background: "transparent", color: "#fff", fontSize: ".8rem", padding: ".3rem .7rem", cursor: "pointer", textTransform: "capitalize" }}>
                {k}
              </button>
            ))}
          </div>
          <form onSubmit={send} style={{ display: "flex", gap: ".5rem", padding: ".8rem" }}>
            <label htmlFor="chat-input" style={{ position: "absolute", left: "-9999px" }}>Chat message</label>
            <input id="chat-input" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask hours, delivery..." style={{ flex: 1, borderRadius: 999, border: "1px solid #555", background: "#222", color: "#fff", padding: ".55rem .9rem" }} />
            <button type="submit" style={{ borderRadius: 999, border: "none", background: "#e3c987", color: "#111", fontWeight: 800, padding: ".55rem 1rem", cursor: "pointer" }}>Send</button>
          </form>
        </Panel>
      ) : null}
    </>
  );
};

export default ChatWidget;

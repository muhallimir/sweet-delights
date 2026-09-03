import React, { useMemo, useState } from "react";
import styled from "styled-components";

const FaqSection = styled.section`
  background: #0d0d0d;
  color: #fff;
  padding: 3rem 1.25rem;
  border-top: 1px solid rgba(255,255,255,.08);
`;

const FaqInner = styled.div`
  max-width: 860px;
  margin: 0 auto;
  h2 { color: #e3c987; margin: 0 0 .3rem; }
`;

const Item = styled.div`
  background: #161616;
  border: 1px solid rgba(255,255,255,.08);
  border-radius: .9rem;
  margin-top: .6rem;
  overflow: hidden;
  button {
    width: 100%;
    text-align: left;
    background: transparent;
    border: none;
    color: #fff;
    padding: .9rem 1.1rem;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    gap: 1rem;
  }
  .answer {
    padding: 0 1.1rem 1rem;
    font-size: .92rem;
    opacity: .88;
    line-height: 1.6;
  }
`;

const FAQS = [
  { cat: "Ordering", q: "How do I order?", a: "Add treats to cart, go to checkout, fill name/phone/address, pick delivery or pickup slot, and place order. We text to confirm. No prepayment needed." },
  { cat: "Ordering", q: "Can I build my own box?", a: "Yes. Use Build-a-Box for 6 or 12 pcs. Mix any treats, save 10%. Box adds as one line item." },
  { cat: "Delivery", q: "How much is delivery?", a: "Metro Manila ₱49, Calabarzon ₱79, Provincial ₱129. FREE over ₱500. FREESHIP code gives free delivery. Check the estimator in cart with your postcode." },
  { cat: "Delivery", q: "Pickup or delivery?", a: "Choose at checkout with date + time slot (9-11AM, 11AM-1PM, 2-4PM, 4-6PM). Pickup is free at your selected store." },
  { cat: "Allergen", q: "Which items are nut-free or vegan?", a: "Use diet chips on the menu: nut-free, gluten-free, vegan, dairy-free. Cards show icons. Detail modal lists allergens and nutrition per product." },
  { cat: "Allergen", q: "Do you list ingredients?", a: "Yes. Tap Details, then View nutrition for calories, serving, ingredients, and allergens." },
  { cat: "Payment", q: "What payments do you accept?", a: "Cash on Delivery, GCash (optional ref), or card on pickup. Mock checkout, no real charge." },
  { cat: "Payment", q: "Do loyalty points expire?", a: "No. Earn 1pt per ₱1. 100pts = ₱250 off with the toggle in cart or checkout. Balance persists." },
];

const Faq = () => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(0);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return FAQS;
    return FAQS.filter((f) => `${f.cat} ${f.q} ${f.a}`.toLowerCase().includes(q));
  }, [query]);

  return (
    <FaqSection id="faq" aria-label="Frequently asked questions">
      <FaqInner>
        <h2>FAQ</h2>
        <p style={{ opacity: 0.8, margin: 0 }}>Ordering, delivery, allergen, payment. Search to filter.</p>
        <label htmlFor="faq-search" style={{ position: "absolute", left: "-9999px" }}>Search FAQs</label>
        <input
          id="faq-search"
          type="search"
          placeholder="Search e.g. delivery, vegan, GCash..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ marginTop: ".8rem", width: "100%", borderRadius: 999, border: "1px solid #555", background: "#222", color: "#fff", padding: ".65rem 1.1rem" }}
        />
        <div role="status" style={{ fontSize: ".85rem", opacity: 0.7, marginTop: ".4rem" }}>{filtered.length} answers</div>
        {filtered.map((f, idx) => {
          const isOpen = open === idx;
          return (
            <Item key={`${f.q}-${idx}`}>
              <button type="button" onClick={() => setOpen(isOpen ? -1 : idx)} aria-expanded={isOpen} aria-controls={`faq-a-${idx}`} id={`faq-q-${idx}`}>
                <span><span style={{ fontSize: ".75rem", opacity: 0.7, textTransform: "uppercase", marginRight: ".5rem" }}>{f.cat}</span>{f.q}</span>
                <span aria-hidden="true">{isOpen ? "−" : "+"}</span>
              </button>
              {isOpen ? <div className="answer" id={`faq-a-${idx}`} role="region" aria-labelledby={`faq-q-${idx}`}>{f.a}</div> : null}
            </Item>
          );
        })}
        {filtered.length === 0 ? <p style={{ opacity: 0.8 }}>No answers found. Try delivery or vegan.</p> : null}
      </FaqInner>
    </FaqSection>
  );
};

export default Faq;

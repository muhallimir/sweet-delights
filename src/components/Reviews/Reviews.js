import React, { useState } from "react";
import { starText, getReviews, addReview, validateReview } from "../../utils/reviews";
import PhotoReviewForm from "./PhotoReviewForm";

const seedFor = (productId) => {
  const seeds = {
    "leche-flan": [
      { name: "Maria", rating: 5, text: "Creamy and not too sweet. Caramel is perfect.", date: "2026-05-02T00:00:00.000Z" },
      { name: "Jose", rating: 5, text: "Ordered 10 tubs for fiesta, all gone in minutes.", date: "2026-06-11T00:00:00.000Z" },
    ],
    "coconut-macaroons": [
      { name: "Ana", rating: 5, text: "Chewy inside, golden outside. Best with coffee.", date: "2026-04-18T00:00:00.000Z" },
    ],
    "combo-delights": [
      { name: "Ramon", rating: 5, text: "Sulit combo. Great for pasalubong.", date: "2026-07-01T00:00:00.000Z" },
    ],
  };
  return seeds[productId] || [{ name: "Liza", rating: 5, text: "Fresh and delicious. Will order again.", date: "2026-03-20T00:00:00.000Z" }];
};

const Reviews = ({ product }) => {
  const [list, setList] = useState(() => {
    const stored = getReviews(product.id);
    return stored.length > 0 ? stored : seedFor(product.id);
  });
  const [form, setForm] = useState({ name: "", rating: "5", text: "" });
  const [errors, setErrors] = useState({});
  const [ok, setOk] = useState("");

  const submit = (e) => {
    e.preventDefault();
    const errs = validateReview(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    const next = addReview(product.id, { name: form.name, rating: Number(form.rating), text: form.text });
    setList(next);
    setForm({ name: "", rating: "5", text: "" });
    setErrors({});
    setOk("Salamat! Your review was posted.");
  };

  const avgSeed = Number(product.rating) || 5;
  const countSeed = Number(product.reviewsCount) || list.length;

  return (
    <div style={{ marginTop: "1rem", borderTop: "1px solid rgba(255,255,255,.1)", paddingTop: "1rem" }} aria-label={`Reviews for ${product.name}`}>
      <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".6rem" }}>
        <span style={{ color: "#e3c987", fontSize: "1.1rem" }} aria-hidden="true">{starText(avgSeed)}</span>
        <span style={{ fontSize: ".9rem" }}>{avgSeed.toFixed(1)} · {countSeed + (list.length > 1 ? list.length : 0)} reviews</span>
      </div>
      <div style={{ display: "grid", gap: ".6rem", marginBottom: "1rem", maxHeight: 220, overflowY: "auto" }}>
        {list.map((r, idx) => (
          <div key={`${r.date}-${idx}`} style={{ background: "#0f0f0f", border: "1px solid rgba(255,255,255,.08)", borderRadius: ".7rem", padding: ".6rem .8rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: ".6rem" }}>
              <strong style={{ fontSize: ".9rem" }}>{r.name}</strong>
              <span style={{ color: "#e3c987", fontSize: ".85rem" }} aria-label={`${r.rating} out of 5 stars`}>{starText(r.rating)}</span>
            </div>
            <p style={{ fontSize: ".88rem", opacity: 0.9, margin: ".3rem 0 0" }}>{r.text}</p>
          </div>
        ))}
      </div>
      <form onSubmit={submit} noValidate aria-label="Write a review">
        <h4 style={{ margin: "0 0 .5rem" }}>Write a review</h4>
        <div style={{ display: "grid", gap: ".5rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 120px", gap: ".5rem" }}>
            <input
              type="text"
              placeholder="Your name *"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              aria-label="Your name"
              style={{ borderRadius: 8, border: "1px solid #555", background: "#222", color: "#fff", padding: ".55rem .7rem" }}
            />
            <select
              value={form.rating}
              onChange={(e) => setForm((p) => ({ ...p, rating: e.target.value }))}
              aria-label="Star rating"
              style={{ borderRadius: 8, border: "1px solid #555", background: "#222", color: "#fff", padding: ".55rem .5rem" }}
            >
              <option value="5">5 ★</option>
              <option value="4">4 ★</option>
              <option value="3">3 ★</option>
              <option value="2">2 ★</option>
              <option value="1">1 ★</option>
            </select>
          </div>
          {errors.name ? <span role="alert" style={{ color: "#ff9a9a", fontSize: ".82rem" }}>{errors.name}</span> : null}
          {errors.rating ? <span role="alert" style={{ color: "#ff9a9a", fontSize: ".82rem" }}>{errors.rating}</span> : null}
          <textarea
            placeholder="What did you love? *"
            value={form.text}
            onChange={(e) => setForm((p) => ({ ...p, text: e.target.value }))}
            aria-label="Review text"
            rows="3"
            style={{ borderRadius: 8, border: "1px solid #555", background: "#222", color: "#fff", padding: ".55rem .7rem" }}
          />
          {errors.text ? <span role="alert" style={{ color: "#ff9a9a", fontSize: ".82rem" }}>{errors.text}</span> : null}
          <button type="submit" style={{ borderRadius: 999, border: "none", background: "#e3c987", color: "#111", fontWeight: 700, padding: ".6rem 1rem", cursor: "pointer" }}>
            Post review
          </button>
          {ok ? <span role="status" style={{ color: "#c8f0d2", fontSize: ".85rem" }}>{ok}</span> : null}
        </div>
      </form>
      <PhotoReviewForm product={product} />
    </div>
  );
};

export default Reviews;

import React, { useEffect, useState } from "react";
import {
  MAX_PHOTO_BYTES,
  readFileAsDataURL,
  validatePhotoFile,
  validatePhotoReview,
  addPhotoReview,
  getPhotoReviews,
} from "../../utils/photoReviews";

const PhotoReviewForm = ({ product }) => {
  const [list, setList] = useState(() => getPhotoReviews(product.id));
  const [name, setName] = useState("");
  const [rating, setRating] = useState("5");
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState(null);
  const [dataUrl, setDataUrl] = useState("");
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  useEffect(() => {
    setList(getPhotoReviews(product.id));
  }, [product.id]);

  const onFile = (e) => {
    const f = e.target.files && e.target.files[0];
    setFile(f || null);
    setDataUrl("");
    setErr("");
    if (!f) return;
    const v = validatePhotoFile(f);
    if (v) {
      setErr(v);
      return;
    }
    readFileAsDataURL(f).then((url) => setDataUrl(url)).catch(() => setErr("Could not read that file."));
  };

  const submit = (e) => {
    e.preventDefault();
    const errs = validatePhotoReview({ name, rating, text: caption });
    if (!dataUrl) {
      errs.photo = "Add a photo to post your review.";
    }
    if (Object.keys(errs).length > 0) {
      setErr(Object.values(errs)[0]);
      return;
    }
    setErr("");
    const next = addPhotoReview(product.id, {
      name,
      rating,
      text: caption,
      caption,
      dataUrl,
    });
    setList(next);
    setName("");
    setRating("5");
    setCaption("");
    setFile(null);
    setDataUrl("");
    setOk("Photo review posted. Salamat!");
  };

  return (
    <div style={{ marginTop: "1rem", borderTop: "1px solid rgba(255,255,255,.1)", paddingTop: "1rem" }} aria-label={`Photo reviews for ${product.name}`}>
      <h4 style={{ margin: "0 0 .5rem" }}>Add your photo</h4>
      <form onSubmit={submit} noValidate aria-label="Photo review form" style={{ display: "grid", gap: ".55rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 110px", gap: ".5rem" }}>
          <input
            type="text"
            placeholder="Your name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ borderRadius: 8, border: "1px solid #555", background: "#222", color: "#fff", padding: ".55rem .7rem" }}
          />
          <select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
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
        <input
          type="text"
          placeholder="Caption *"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          aria-label="Photo caption"
          style={{ borderRadius: 8, border: "1px solid #555", background: "#222", color: "#fff", padding: ".55rem .7rem" }}
        />
        <label htmlFor={`photo-${product.id}`} style={{ fontSize: ".85rem" }}>
          Photo (max {Math.round(MAX_PHOTO_BYTES / 1024)} KB):
        </label>
        <input
          id={`photo-${product.id}`}
          type="file"
          accept="image/*"
          onChange={onFile}
          aria-label="Choose photo"
          style={{ color: "#fff", fontSize: ".85rem" }}
        />
        {file ? (
          <div style={{ fontSize: ".78rem", opacity: 0.8 }}>
            {file.name} · {Math.round(file.size / 1024)} KB
            {file.size > MAX_PHOTO_BYTES ? <span style={{ color: "#ff9a9a" }}> · too large</span> : null}
          </div>
        ) : null}
        {dataUrl ? (
          <img
            src={dataUrl}
            alt="preview"
            style={{ width: "100%", maxHeight: 180, objectFit: "cover", borderRadius: 8, border: "1px solid rgba(255,255,255,.15)" }}
          />
        ) : null}
        {err ? <div role="alert" style={{ color: "#ff9a9a", fontSize: ".85rem" }}>{err}</div> : null}
        {ok ? <div role="status" style={{ color: "#c8f0d2", fontSize: ".85rem" }}>{ok}</div> : null}
        <button type="submit" style={{ borderRadius: 999, border: "none", background: "#e3c987", color: "#111", fontWeight: 700, padding: ".55rem 1rem", cursor: "pointer" }}>
          Post photo review
        </button>
      </form>
      {list.length > 0 ? (
        <div style={{ marginTop: ".8rem", display: "grid", gap: ".7rem" }} aria-label="Photo review list">
          {list.map((r) => (
            <article key={r.id} style={{ background: "#0f0f0f", border: "1px solid rgba(255,255,255,.1)", borderRadius: ".7rem", padding: ".55rem .7rem" }}>
              <img
                src={r.dataUrl}
                alt={`${r.name} review`}
                loading="lazy"
                style={{ width: "100%", maxHeight: 220, objectFit: "cover", borderRadius: ".55rem" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: ".4rem", fontSize: ".88rem" }}>
                <strong>{r.name}</strong>
                <span aria-label={`${r.rating} out of 5 stars`} style={{ color: "#e3c987" }}>
                  {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
                </span>
              </div>
              <p style={{ margin: ".25rem 0 0", fontSize: ".88rem" }}>{r.caption || r.text}</p>
            </article>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default PhotoReviewForm;
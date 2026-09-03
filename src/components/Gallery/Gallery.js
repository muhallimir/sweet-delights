import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { allProducts } from "../Products/data";

const GalSection = styled.section`
  background: #111;
  color: #fff;
  padding: 3rem 1.25rem;
  border-top: 1px solid rgba(255,255,255,.08);
`;

const GalInner = styled.div`
  max-width: 1080px;
  margin: 0 auto;
  h2 { color: #e3c987; margin: 0 0 .3rem; }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: .7rem;
  margin-top: 1rem;
  @media screen and (max-width: 760px) {
    grid-template-columns: repeat(2, 1fr);
  }
  button {
    border: none;
    padding: 0;
    background: transparent;
    cursor: pointer;
    border-radius: .8rem;
    overflow: hidden;
  }
  img {
    width: 100%;
    height: 160px;
    object-fit: cover;
    display: block;
    transition: transform .2s ease;
  }
  button:hover img, button:focus-visible img {
    transform: scale(1.05);
  }
`;

const Lightbox = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.85);
  z-index: 1200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  img {
    max-width: min(860px, 92vw);
    max-height: 76vh;
    border-radius: 1rem;
    border: 1px solid rgba(255,255,255,.2);
  }
`;

const Gallery = () => {
  const images = (allProducts || []).slice(0, 8);
  const [index, setIndex] = useState(null);

  const close = useCallback(() => setIndex(null), []);
  const prev = useCallback(() => setIndex((i) => (i == null ? null : (i - 1 + images.length) % images.length)), [images.length]);
  const next = useCallback(() => setIndex((i) => (i == null ? null : (i + 1) % images.length)), [images.length]);

  useEffect(() => {
    if (index == null) return;
    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [index, close, prev, next]);

  return (
    <GalSection aria-label="Gallery">
      <GalInner>
        <h2>Gallery Wall</h2>
        <p style={{ opacity: 0.8, margin: 0 }}>Tap to open lightbox. Esc to close, arrows to browse.</p>
        <Grid>
          {images.map((p, i) => (
            <button key={p.id} type="button" onClick={() => setIndex(i)} aria-label={`Open ${p.name} in lightbox`}>
              <img src={p.img} alt={p.alt || p.name} loading="lazy" />
            </button>
          ))}
        </Grid>
        {index != null && images[index] ? (
          <Lightbox onClick={close} role="presentation">
            <div style={{ position: "relative" }} onClick={(e) => e.stopPropagation()}>
              <button type="button" onClick={close} aria-label="Close lightbox" style={{ position: "absolute", top: -44, right: 0, borderRadius: 999, border: "1px solid rgba(255,255,255,.4)", background: "transparent", color: "#fff", width: 36, height: 36, cursor: "pointer" }}>
                ✕
              </button>
              <img src={images[index].img} alt={images[index].alt || images[index].name} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: ".6rem", gap: "1rem" }}>
                <button type="button" onClick={prev} aria-label="Previous image" style={{ borderRadius: 999, border: "1px solid rgba(255,255,255,.3)", background: "transparent", color: "#fff", padding: ".5rem 1rem", cursor: "pointer" }}>← Prev</button>
                <span style={{ fontSize: ".9rem" }}>{images[index].name} · {index + 1}/{images.length}</span>
                <button type="button" onClick={next} aria-label="Next image" style={{ borderRadius: 999, border: "1px solid rgba(255,255,255,.3)", background: "transparent", color: "#fff", padding: ".5rem 1rem", cursor: "pointer" }}>Next →</button>
              </div>
            </div>
          </Lightbox>
        ) : null}
      </GalInner>
    </GalSection>
  );
};

export default Gallery;

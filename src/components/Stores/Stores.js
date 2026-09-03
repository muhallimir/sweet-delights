import React, { useState } from "react";
import styled from "styled-components";
import { STORES, getStoreId, setStoreId } from "../../utils/store";

const StoresSection = styled.section`
  background: #0d0d0d;
  color: #fff;
  padding: 3rem 1.25rem;
  border-top: 1px solid rgba(255,255,255,.08);
`;

const StoresInner = styled.div`
  max-width: 1080px;
  margin: 0 auto;
  h2 { color: #e3c987; margin: 0 0 .3rem; }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 1rem;
  @media screen and (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: #161616;
  border: 1px solid ${(p) => (p.selected ? "#e3c987" : "rgba(255,255,255,.1)")};
  border-radius: 1rem;
  overflow: hidden;
  iframe {
    width: 100%;
    height: 200px;
    border: 0;
    display: block;
  }
  .body { padding: 1rem 1.1rem 1.2rem; }
`;

const Stores = () => {
  const [selected, setSelected] = useState(() => getStoreId());

  const pick = (id) => {
    setStoreId(id);
    setSelected(id);
  };

  return (
    <StoresSection id="stores" aria-label="Store locations">
      <StoresInner>
        <h2>Our Stores</h2>
        <p style={{ opacity: 0.8, margin: 0 }}>Pickup available at both. Select your pickup store, saved for checkout.</p>
        <Grid>
          {STORES.map((s) => (
            <Card key={s.id} selected={selected === s.id}>
              <iframe title={`${s.name} map`} src={s.map} loading="lazy" />
              <div className="body">
                <h3 style={{ margin: "0 0 .3rem", color: "#e3c987" }}>{s.name}{selected === s.id ? " · ★ pickup" : ""}</h3>
                <p style={{ margin: ".2rem 0", fontSize: ".92rem" }}>{s.address}</p>
                <p style={{ margin: ".2rem 0", fontSize: ".92rem" }}>{s.hours}</p>
                <p style={{ margin: ".2rem 0 .8rem", fontSize: ".92rem" }}>
                  <a href={`tel:${s.phone.replace(/\s/g, "")}`} style={{ color: "#fff" }}>{s.phone}</a>
                </p>
                <button
                  type="button"
                  onClick={() => pick(s.id)}
                  aria-pressed={selected === s.id}
                  style={{
                    borderRadius: 999,
                    border: selected === s.id ? "none" : "1px solid #e3c987",
                    background: selected === s.id ? "#e3c987" : "transparent",
                    color: selected === s.id ? "#111" : "#e3c987",
                    fontWeight: 800,
                    padding: ".55rem 1.2rem",
                    cursor: "pointer",
                  }}
                >
                  {selected === s.id ? "Pickup store ✓" : "Set as pickup store"}
                </button>
              </div>
            </Card>
          ))}
        </Grid>
      </StoresInner>
    </StoresSection>
  );
};

export default Stores;

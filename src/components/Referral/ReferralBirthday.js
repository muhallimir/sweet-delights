import React, { useState } from "react";
import styled from "styled-components";

const RefSection = styled.section`
  background: #111;
  color: #fff;
  padding: 3rem 1.25rem;
  border-top: 1px solid rgba(255,255,255,.08);
`;

const RefInner = styled.div`
  max-width: 1080px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  @media screen and (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: #161616;
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 1rem;
  padding: 1.2rem 1.3rem;
  h3 { color: #e3c987; margin: 0 0 .4rem; }
`;

function getReferral() {
  try {
    let code = localStorage.getItem("sd-referral");
    if (!code) {
      code = "SD-" + Math.random().toString(36).slice(2, 8).toUpperCase();
      localStorage.setItem("sd-referral", code);
    }
    return code;
  } catch (e) {
    return "SD-FRIEND";
  }
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const ReferralBirthday = () => {
  const [ref] = useState(() => getReferral());
  const [copied, setCopied] = useState("");
  const [month, setMonth] = useState(() => {
    try {
      return localStorage.getItem("sd-birthday-month") || "";
    } catch (e) {
      return "";
    }
  });
  const [bdayMsg, setBdayMsg] = useState(() => {
    try {
      return localStorage.getItem("sd-birthday-code") ? "You already claimed BDAY15. Use it at checkout for 15% off." : "";
    } catch (e) {
      return "";
    }
  });

  const copyRef = async () => {
    const url = `https://sweetdelights.ph/r/${ref}`;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const ta = document.createElement("textarea");
        ta.value = url;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied("Referral link copied! Give ₱100, get ₱100 credit (mock).");
    } catch (e) {
      setCopied(url);
    }
  };

  const joinBday = (e) => {
    if (e) e.preventDefault();
    if (!month) {
      setBdayMsg("Pick your birth month first.");
      return;
    }
    try {
      localStorage.setItem("sd-birthday-month", month);
      localStorage.setItem("sd-birthday-code", "BDAY15");
    } catch (err) {
      // ignore
    }
    setBdayMsg(`Locked in! Your coupon is BDAY15 for 15% off. Use it with your ${month} treat.`);
  };

  return (
    <RefSection aria-label="Referral and birthday club">
      <RefInner>
        <Card>
          <h3>Refer a friend</h3>
          <p style={{ opacity: 0.85, fontSize: ".92rem" }}>Share your link. They get ₱100 off first order, you get ₱100 credit (mock, tracked on this device).</p>
          <div style={{ background: "#0f0f0f", borderRadius: ".7rem", padding: ".7rem .9rem", fontSize: ".9rem", margin: ".7rem 0", wordBreak: "break-all" }}>
            https://sweetdelights.ph/r/{ref}
          </div>
          <button type="button" onClick={copyRef} style={{ borderRadius: 999, border: "none", background: "#e3c987", color: "#111", fontWeight: 800, padding: ".6rem 1.2rem", cursor: "pointer" }}>
            Copy referral link
          </button>
          {copied ? <p role="status" style={{ color: "#c8f0d2", fontSize: ".88rem" }}>{copied}</p> : null}
        </Card>
        <Card as="form" onSubmit={joinBday} aria-label="Birthday club signup">
          <h3>Birthday Club</h3>
          <p style={{ opacity: 0.85, fontSize: ".92rem" }}>Join with your birth month, get BDAY15 for 15% off. Works at checkout.</p>
          <label htmlFor="bday-month" style={{ display: "block", fontSize: ".9rem", margin: ".6rem 0 .3rem" }}>Birth month</label>
          <select id="bday-month" value={month} onChange={(e) => setMonth(e.target.value)} style={{ width: "100%", borderRadius: 8, border: "1px solid #555", background: "#0f0f0f", color: "#fff", padding: ".6rem .8rem" }}>
            <option value="">Pick month</option>
            {MONTHS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <button type="submit" style={{ marginTop: ".8rem", borderRadius: 999, border: "1px solid #e3c987", background: "transparent", color: "#e3c987", fontWeight: 800, padding: ".6rem 1.2rem", cursor: "pointer" }}>
            Claim BDAY15
          </button>
          {bdayMsg ? <p role="status" style={{ color: "#c8f0d2", fontSize: ".88rem" }}>{bdayMsg}</p> : null}
        </Card>
      </RefInner>
    </RefSection>
  );
};

export default ReferralBirthday;

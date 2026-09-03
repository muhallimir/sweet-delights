import React, { useState } from "react";
import { NewsSection, Form, Msg } from "./NewsletterElements";

const KEY = "sweet-delights-newsletter";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function loadList() {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    const v = email.trim().toLowerCase();
    if (!EMAIL_RE.test(v)) {
      setError("Please enter a valid email address.");
      setDone(false);
      return;
    }
    const list = loadList();
    if (list.includes(v)) {
      setError("");
      setDone(true);
      return;
    }
    try {
      localStorage.setItem(KEY, JSON.stringify([...list, v]));
    } catch (err) {
      // ignore
    }
    setError("");
    setDone(true);
    setEmail("");
  };

  return (
    <NewsSection aria-label="Newsletter signup">
      <h2>Get fresh drops + suki discounts</h2>
      <p>
        One email a month. New flavors, fiesta bundles, and 10% off your first
        catering inquiry when you join.
      </p>
      {done ? (
        <p role="status" style={{ color: "#c8f0d2", fontWeight: 700 }}>
          Salamat! You are on the list. Check your inbox for 10% off.
        </p>
      ) : (
        <Form onSubmit={submit} noValidate>
          <label htmlFor="nl-email" style={{ position: "absolute", left: "-9999px" }}>
            Email address
          </label>
          <input
            id="nl-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "nl-err" : undefined}
          />
          <button type="submit">Join free</button>
        </Form>
      )}
      {error && (
        <Msg error role="alert" id="nl-err">
          {error}
        </Msg>
      )}
      {!done && !error && (
        <Msg role="note">No spam. Unsubscribe anytime.</Msg>
      )}
    </NewsSection>
  );
};

export default Newsletter;

import React, { useEffect, useState } from "react";
import {
  CaterSection,
  CaterInner,
  Grid,
  Card,
  Field,
  Row2,
  Err,
  SubmitBtn,
  Toast,
  InfoList,
} from "./CateringElements";

const KEY = "sweet-delights-catering";

function validate(v) {
  const e = {};
  if (!v.name || v.name.trim().length < 2) e.name = "Please enter your name.";
  const contact = (v.contact || "").trim();
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(contact);
  const isPhone = /^(\+?63|0)?\d{9,11}$/.test(contact.replace(/[\s-]/g, ""));
  if (!isEmail && !isPhone)
    e.contact = "Enter a valid email or PH phone number.";
  if (!v.date) e.date = "Please pick an event date.";
  else {
    const picked = new Date(v.date + "T00:00:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (Number.isNaN(picked.getTime())) e.date = "Invalid date.";
    else if (picked < today) e.date = "Date must be today or later.";
  }
  const g = Number(v.guests);
  if (!Number.isFinite(g) || g < 10 || g > 1000)
    e.guests = "Guests: 10 to 1000.";
  if (!v.message || v.message.trim().length < 10)
    e.message = "Tell us a bit more (min 10 characters).";
  return e;
}

const Catering = () => {
  const [values, setValues] = useState({
    name: "",
    contact: "",
    date: "",
    guests: "50",
    type: "Birthday",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 5000);
    return () => clearTimeout(t);
  }, [toast]);

  const set = (k) => (e) => setValues((p) => ({ ...p, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    const errs = validate(values);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    try {
      const raw = localStorage.getItem(KEY);
      const prev = raw ? JSON.parse(raw) : [];
      const next = Array.isArray(prev)
        ? [...prev, { ...values, at: new Date().toISOString() }]
        : [{ ...values, at: new Date().toISOString() }];
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch (err) {
      // ignore
    }
    setToast(
      `Salamat ${values.name.split(" ")[0]}! Inquiry sent. We reply within 24h.`
    );
    setValues({
      name: "",
      contact: "",
      date: "",
      guests: "50",
      type: "Birthday",
      message: "",
    });
    setErrors({});
  };

  return (
    <CaterSection id="catering" aria-label="Catering and contact">
      <CaterInner>
        <h2>Catering + Bulk Orders</h2>
        <p className="sub">
          Fiestas, birthdays, office merienda. 2 days lead time for bulk.
        </p>
        <Grid>
          <Card as="form" onSubmit={submit} noValidate aria-label="Catering inquiry form">
            <Row2>
              <Field>
                <label htmlFor="cat-name">Name *</label>
                <input
                  id="cat-name"
                  value={values.name}
                  onChange={set("name")}
                  placeholder="Maria Santos"
                  autoComplete="name"
                  aria-invalid={Boolean(errors.name)}
                />
                {errors.name && <Err role="alert">{errors.name}</Err>}
              </Field>
              <Field>
                <label htmlFor="cat-contact">Email or phone *</label>
                <input
                  id="cat-contact"
                  value={values.contact}
                  onChange={set("contact")}
                  placeholder="0917... or you@mail.com"
                  autoComplete="tel"
                  aria-invalid={Boolean(errors.contact)}
                />
                {errors.contact && <Err role="alert">{errors.contact}</Err>}
              </Field>
            </Row2>
            <Row2>
              <Field>
                <label htmlFor="cat-date">Event date *</label>
                <input
                  id="cat-date"
                  type="date"
                  value={values.date}
                  onChange={set("date")}
                  aria-invalid={Boolean(errors.date)}
                />
                {errors.date && <Err role="alert">{errors.date}</Err>}
              </Field>
              <Field>
                <label htmlFor="cat-guests">Guests *</label>
                <input
                  id="cat-guests"
                  type="number"
                  min="10"
                  max="1000"
                  value={values.guests}
                  onChange={set("guests")}
                  aria-invalid={Boolean(errors.guests)}
                />
                {errors.guests && <Err role="alert">{errors.guests}</Err>}
              </Field>
            </Row2>
            <Field>
              <label htmlFor="cat-type">Occasion</label>
              <select id="cat-type" value={values.type} onChange={set("type")}>
                <option>Birthday</option>
                <option>Fiesta</option>
                <option>Wedding</option>
                <option>Office</option>
                <option>Other</option>
              </select>
            </Field>
            <Field>
              <label htmlFor="cat-msg">What do you need? *</label>
              <textarea
                id="cat-msg"
                rows="4"
                placeholder="e.g. 10 tubs leche flan + 60 pcs macaroons for 50 pax..."
                value={values.message}
                onChange={set("message")}
                aria-invalid={Boolean(errors.message)}
              />
              {errors.message && <Err role="alert">{errors.message}</Err>}
            </Field>
            <SubmitBtn type="submit">Send catering inquiry</SubmitBtn>
          </Card>
          <Card aria-label="Hours and location">
            <h3 style={{ marginTop: 0, color: "#e3c987" }}>
              Hours + Location
            </h3>
            <InfoList>
              <li>
                <strong>Open:</strong> Mon–Sat 8AM–8PM · Sun 9AM–6PM
              </li>
              <li>
                <strong>Pickup:</strong> Poblacion, Philippines. Landmark: near
                market plaza.
              </li>
              <li>
                <strong>Contact:</strong>{" "}
                <a href="tel:+639171234567" style={{ color: "#fff" }}>
                  0917 123 4567
                </a>{" "}
                ·{" "}
                <a
                  href="mailto:hello@sweetdelights.ph"
                  style={{ color: "#fff" }}
                >
                  hello@sweetdelights.ph
                </a>
              </li>
              <li>
                <strong>Lead time:</strong> same-day for menu items, 2 days for
                50+ pax catering.
              </li>
              <li>
                <strong>Payment:</strong> COD, GCash, card on pickup. No
                downpayment under ₱2,000.
              </li>
            </InfoList>
            <div
              style={{
                marginTop: "1rem",
                borderRadius: ".8rem",
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,.1)",
              }}
            >
              <iframe
                title="Sweet Delights location map"
                src="https://www.openstreetmap.org/export/embed.html?bbox=120.95%2C14.55%2C121.05%2C14.65&layer=mapnik"
                style={{ width: "100%", height: 220, border: 0 }}
                loading="lazy"
              />
            </div>
          </Card>
        </Grid>
      </CaterInner>
      {toast && <Toast role="status">{toast}</Toast>}
    </CaterSection>
  );
};

export default Catering;

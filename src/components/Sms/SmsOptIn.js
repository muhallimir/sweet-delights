import React, { useEffect, useState } from "react";
import { addSmsSub, validatePhone } from "../../utils/sms";

const SmsOptIn = ({ phone, orderId, onChange }) => {
  const [enabled, setEnabled] = useState(false);
  const [localPhone, setLocalPhone] = useState(phone || "");
  const [err, setErr] = useState("");

  useEffect(() => {
    setLocalPhone(phone || "");
  }, [phone]);

  const toggle = (next) => {
    setEnabled(next);
    if (next) {
      const message = validatePhone(localPhone);
      if (message) {
        setErr(message);
        setEnabled(false);
        return;
      }
      setErr("");
      const sub = addSmsSub({ orderId, phone: localPhone });
      onChange && onChange({ enabled: true, phone: localPhone, sub });
      window.dispatchEvent(new CustomEvent("sd:toast", { detail: { message: `SMS updates on for ${localPhone} (mock).`, tone: "success" } }));
    } else {
      onChange && onChange({ enabled: false, phone: localPhone });
    }
  };

  return (
    <div style={{ marginTop: ".8rem", padding: ".7rem .9rem", background: "#101010", border: "1px solid rgba(255,255,255,.12)", borderRadius: ".7rem" }} aria-label="SMS order updates">
      <label style={{ display: "flex", alignItems: "center", gap: ".5rem", cursor: "pointer" }}>
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => toggle(e.target.checked)}
          aria-label="Get SMS updates about this order"
        />
        <span style={{ fontWeight: 700 }}>Get SMS order updates (mock)</span>
      </label>
      <div style={{ marginTop: ".5rem", display: "flex", gap: ".5rem", flexWrap: "wrap", alignItems: "center" }}>
        <label htmlFor="sms-phone" style={{ position: "absolute", left: "-9999px" }}>Phone for SMS</label>
        <input
          id="sms-phone"
          type="tel"
          placeholder="09171234567"
          value={localPhone}
          onChange={(e) => setLocalPhone(e.target.value)}
          disabled={enabled}
          style={{ flex: "1 1 180px", borderRadius: 8, border: "1px solid #555", background: "#0f0f0f", color: "#fff", padding: ".5rem .7rem", opacity: enabled ? 0.7 : 1 }}
        />
      </div>
      <p style={{ margin: ".4rem 0 0", fontSize: ".78rem", opacity: 0.7 }}>
        We will push placed, baking, out for delivery, and delivered toasts in this demo browser.
      </p>
      {err ? <div role="alert" style={{ color: "#ff9a9a", fontSize: ".85rem", marginTop: ".35rem" }}>{err}</div> : null}
    </div>
  );
};

export default SmsOptIn;
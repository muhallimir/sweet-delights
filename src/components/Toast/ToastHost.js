import React, { useEffect, useState } from "react";
import { getSmsSubs, tickSmsSubs, stageMessage } from "../../utils/sms";

const ToastHost = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const onToast = (e) => {
      if (!e || !e.detail) return;
      const id = `t-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`;
      setItems((prev) => [...prev, { id, ...e.detail }]);
      const tone = e.detail.tone || "info";
      const ttl = e.detail.ttl || (tone === "error" ? 7000 : 4500);
      setTimeout(() => {
        setItems((prev) => prev.filter((i) => i.id !== id));
      }, ttl);
    };
    window.addEventListener("sd:toast", onToast);
    return () => window.removeEventListener("sd:toast", onToast);
  }, []);

  useEffect(() => {
    let lastTick = 0;
    const t = setInterval(() => {
      const now = Date.now();
      if (now - lastTick < 5000) return;
      lastTick = now;
      const subs = getSmsSubs();
      subs.forEach((sub) => {
        const updated = tickSmsSubs(now);
        const fresh = updated.find((s) => s.orderId === sub.orderId);
        if (fresh && fresh.stage > sub.stage) {
          window.dispatchEvent(new CustomEvent("sd:toast", {
            detail: {
              title: `Order ${sub.orderId.slice(-4)}`,
              message: stageMessage(sub.orderId, fresh.stage),
              tone: fresh.stage === 3 ? "success" : "info",
            },
          }));
        }
      });
    }, 3000);
    return () => clearInterval(t);
  }, []);

  if (items.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      style={{
        position: "fixed",
        bottom: 16,
        right: 16,
        display: "grid",
        gap: ".5rem",
        zIndex: 1500,
        maxWidth: 320,
      }}
    >
      {items.map((t) => {
        const color = t.tone === "error" ? "#ff9a9a" : t.tone === "success" ? "#7fdba3" : "#a9c8e8";
        const bg = t.tone === "error" ? "#3a0e0e" : t.tone === "success" ? "#0e2a17" : "#10233b";
        return (
          <div
            key={t.id}
            role="status"
            style={{
              background: bg,
              border: `1px solid ${color}`,
              borderRadius: ".7rem",
              padding: ".65rem .85rem",
              color: "#fff",
              boxShadow: "0 6px 16px rgba(0,0,0,.4)",
              fontSize: ".9rem",
            }}
          >
            {t.title ? <div style={{ fontWeight: 800, marginBottom: ".2rem" }}>{t.title}</div> : null}
            <div>{t.message}</div>
          </div>
        );
      })}
    </div>
  );
};

export default ToastHost;
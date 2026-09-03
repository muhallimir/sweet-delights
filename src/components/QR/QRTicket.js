import React, { useEffect, useRef, useState } from "react";
import { useCurrency } from "../../utils/currency";
import { generateQR, downloadPng } from "../../utils/qr";

const QRTicket = ({ orderId, value }) => {
  const { format } = useCurrency();
  const [qr, setQr] = useState(null);
  const [err, setErr] = useState("");
  const canvasRef = useRef(null);

  useEffect(() => {
    try {
      const payload = `Sweet Delights Order ${orderId} | ${value}`;
      const generated = generateQR(payload, { ec: "M" });
      setQr(generated);
      if (canvasRef.current && typeof document !== "undefined") {
        const scale = 6;
        const canvas = canvasRef.current;
        canvas.width = generated.size * scale;
        canvas.height = generated.size * scale;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#000000";
        for (let r = 0; r < generated.size; r++) {
          for (let c = 0; c < generated.size; c++) {
            if (generated.modules[r][c]) {
              ctx.fillRect(c * scale, r * scale, scale, scale);
            }
          }
        }
      }
    } catch (e) {
      setErr(e && e.message ? e.message : "Could not generate QR.");
    }
  }, [orderId, value]);

  const onSave = () => {
    if (!qr) return;
    downloadPng(qr, `sweet-delights-${orderId}.png`, 8);
  };

  return (
    <div
      style={{
        marginTop: "1rem",
        padding: "1rem",
        background: "#ffffff",
        color: "#111",
        borderRadius: ".8rem",
        display: "grid",
        gap: ".6rem",
        maxWidth: 360,
      }}
      aria-label="Pickup QR ticket"
    >
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: ".78rem", letterSpacing: ".1em", textTransform: "uppercase", color: "#666" }}>
          Sweet Delights
        </div>
        <div style={{ fontWeight: 800 }}>In-store pickup</div>
        <div style={{ fontSize: ".85rem", color: "#444" }}>Order {orderId}</div>
      </div>
      {err ? (
        <div role="alert" style={{ color: "#c0392b" }}>{err}</div>
      ) : (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <canvas
            ref={canvasRef}
            aria-label={`QR code for order ${orderId}`}
            style={{ width: "100%", maxWidth: 280, height: "auto", imageRendering: "pixelated" }}
          />
        </div>
      )}
      <div style={{ textAlign: "center", fontSize: ".85rem" }}>
        Show this code at the counter. Total {format(value)}.
      </div>
      <button
        type="button"
        onClick={onSave}
        disabled={!qr}
        aria-label="Save QR ticket as PNG"
        style={{
          background: qr ? "#e3c987" : "#ccc",
          color: "#111",
          border: "none",
          borderRadius: 999,
          padding: ".5rem 1rem",
          fontWeight: 700,
          cursor: qr ? "pointer" : "not-allowed",
        }}
      >
        Save as image
      </button>
    </div>
  );
};

export default QRTicket;
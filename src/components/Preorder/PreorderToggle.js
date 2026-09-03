import React, { useState } from "react";
import { nextDayISO, PREORDER_TIMES, buildScheduledAt } from "../../utils/preorder";

const PreorderToggle = ({ productId, onSchedule, onCancel, scheduledAt }) => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(() => nextDayISO());
  const [time, setTime] = useState("10:00");
  const [err, setErr] = useState("");

  const submit = () => {
    const target = buildScheduledAt(date, time);
    if (!target) {
      setErr("Pick a future time slot.");
      return;
    }
    setErr("");
    onSchedule({ date, time, scheduledAt: target });
    setOpen(false);
  };

  if (scheduledAt) {
    return (
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: ".4rem",
          padding: ".35rem .7rem",
          background: "#10233b",
          border: "1px solid #2f5a8a",
          borderRadius: 999,
          fontSize: ".8rem",
          color: "#a9c8e8",
        }}
        aria-label={`Scheduled for ${new Date(scheduledAt).toLocaleString()}`}
      >
        <span aria-hidden="true">⏰</span>
        <span>Scheduled</span>
        <button
          type="button"
          onClick={onCancel}
          aria-label="Cancel pre-order"
          style={{
            background: "transparent",
            border: "none",
            color: "#ff9a9a",
            cursor: "pointer",
            textDecoration: "underline",
            fontSize: ".75rem",
          }}
        >
          cancel
        </button>
      </div>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        aria-label={`Pre-order ${productId} for tomorrow`}
        style={{
          background: "transparent",
          border: "1px solid rgba(255,255,255,.25)",
          color: "#fff",
          borderRadius: 999,
          padding: ".35rem .85rem",
          fontSize: ".8rem",
          cursor: "pointer",
        }}
      >
        Pre-order for tomorrow
      </button>
    );
  }

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        background: "#101010",
        border: "1px solid rgba(255,255,255,.2)",
        borderRadius: ".6rem",
        padding: ".55rem .7rem",
        display: "grid",
        gap: ".4rem",
      }}
    >
      <label style={{ fontSize: ".78rem" }}>
        Date:
        <input
          type="date"
          value={date}
          min={nextDayISO()}
          onChange={(e) => setDate(e.target.value)}
          style={{ marginLeft: ".4rem", background: "#222", color: "#fff", border: "1px solid #555", borderRadius: 6, padding: ".2rem .4rem" }}
        />
      </label>
      <label style={{ fontSize: ".78rem" }}>
        Time:
        <select
          value={time}
          onChange={(e) => setTime(e.target.value)}
          style={{ marginLeft: ".4rem", background: "#222", color: "#fff", border: "1px solid #555", borderRadius: 6, padding: ".2rem .4rem" }}
        >
          {PREORDER_TIMES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </label>
      {err ? <div role="alert" style={{ color: "#ff9a9a", fontSize: ".78rem" }}>{err}</div> : null}
      <div style={{ display: "flex", gap: ".4rem" }}>
        <button
          type="button"
          onClick={submit}
          style={{ flex: 1, background: "#e3c987", color: "#111", border: "none", borderRadius: 999, padding: ".35rem .8rem", fontWeight: 700, cursor: "pointer", fontSize: ".8rem" }}
        >
          Schedule
        </button>
        <button
          type="button"
          onClick={() => { setOpen(false); setErr(""); }}
          style={{ background: "transparent", color: "#fff", border: "1px solid rgba(255,255,255,.3)", borderRadius: 999, padding: ".35rem .7rem", cursor: "pointer", fontSize: ".8rem" }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default PreorderToggle;
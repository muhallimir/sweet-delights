import React, { useEffect, useState } from "react";
import { useCurrency } from "../../utils/currency";
import { getLoyaltyBalance } from "../../utils/loyalty";
import { progressToNextTier, tierForPoints, tierPerksFor } from "../../utils/loyaltyTier";

const TIER_COLORS = {
  Bronze: "#cd7f32",
  Silver: "#c0c0c0",
  Gold: "#ffd166",
};

const TierCard = ({ compact = false }) => {
  useCurrency();
  const [points, setPoints] = useState(() => getLoyaltyBalance());

  useEffect(() => {
    const onStorage = () => setPoints(getLoyaltyBalance());
    window.addEventListener("storage", onStorage);
    const t = setInterval(() => setPoints(getLoyaltyBalance()), 1500);
    return () => {
      window.removeEventListener("storage", onStorage);
      clearInterval(t);
    };
  }, []);

  const tier = tierForPoints(points);
  const progress = progressToNextTier(points);
  const perks = tierPerksFor(points);
  const color = TIER_COLORS[tier];

  if (compact) {
    return (
      <div
        style={{
          background: "#1b1b10",
          border: `1px solid ${color}`,
          borderRadius: ".7rem",
          padding: ".6rem .8rem",
          marginBottom: ".6rem",
          fontSize: ".85rem",
        }}
        aria-label={`Loyalty tier ${tier}`}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <strong style={{ color }}>{tier} member</strong>
          <span style={{ opacity: 0.75 }}>{points} pts</span>
        </div>
        {progress.next ? (
          <div style={{ marginTop: ".4rem" }}>
            <div
              style={{
                height: 6,
                background: "#2a2a18",
                borderRadius: 999,
                overflow: "hidden",
              }}
              role="progressbar"
              aria-valuenow={progress.percent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${progress.percent}% to ${progress.next}`}
            >
              <div
                style={{
                  width: `${progress.percent}%`,
                  height: "100%",
                  background: color,
                  transition: "width .3s ease",
                }}
              />
            </div>
            <div style={{ fontSize: ".78rem", opacity: 0.7, marginTop: ".2rem" }}>
              {progress.remaining} pts to {progress.next}
            </div>
          </div>
        ) : (
          <div style={{ fontSize: ".78rem", opacity: 0.75, marginTop: ".2rem" }}>
            Top tier · all rewards unlocked
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #1b1b10 0%, #222210 100%)",
        border: `1px solid ${color}`,
        borderRadius: ".9rem",
        padding: "1rem 1.1rem",
        margin: "1rem 0",
      }}
      aria-label="Loyalty tier progress"
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
        <div>
          <div style={{ fontSize: ".8rem", opacity: 0.75, textTransform: "uppercase", letterSpacing: ".05em" }}>
            Your tier
          </div>
          <div style={{ fontSize: "1.4rem", fontWeight: 800, color }}>{tier}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: ".8rem", opacity: 0.75 }}>Lifetime points</div>
          <div style={{ fontSize: "1.2rem", fontWeight: 700 }}>{points}</div>
        </div>
      </div>
      {progress.next ? (
        <div style={{ marginTop: ".7rem" }}>
          <div
            style={{
              height: 10,
              background: "#2a2a18",
              borderRadius: 999,
              overflow: "hidden",
            }}
            role="progressbar"
            aria-valuenow={progress.percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${progress.percent}% to ${progress.next} tier`}
          >
            <div
              style={{
                width: `${progress.percent}%`,
                height: "100%",
                background: `linear-gradient(90deg, ${color}, #fff5d1)`,
                transition: "width .3s ease",
              }}
            />
          </div>
          <div style={{ fontSize: ".82rem", opacity: 0.8, marginTop: ".3rem" }}>
            <strong>{progress.remaining}</strong> pts to <strong>{progress.next}</strong> · {progress.percent}% there
          </div>
        </div>
      ) : (
        <div style={{ marginTop: ".7rem", fontSize: ".85rem", color }}>
          Top tier unlocked. Thank you for being a regular.
        </div>
      )}
      {perks.length > 0 ? (
        <div style={{ marginTop: ".8rem", borderTop: "1px solid rgba(255,255,255,.1)", paddingTop: ".7rem" }}>
          <div style={{ fontSize: ".78rem", opacity: 0.7, textTransform: "uppercase", letterSpacing: ".05em" }}>
            Your perks
          </div>
          <ul style={{ margin: ".3rem 0 0", paddingLeft: "1.1rem", fontSize: ".88rem" }}>
            {perks.map((p) => (
              <li key={p} style={{ marginBottom: ".15rem" }}>{p}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
};

export default TierCard;
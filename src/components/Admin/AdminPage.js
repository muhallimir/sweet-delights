import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CheckoutWrap, Card, Title, Sub, BackLink } from "../Checkout/CheckoutElements";
import { useCurrency } from "../../utils/currency";

const STATUS_KEY = "sd-order-status";

function getStatuses() {
  try {
    const raw = localStorage.getItem(STATUS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function getOrders() {
  try {
    const raw = localStorage.getItem("sweet-delights-orders");
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}const AdminPage = () => {
  const { format } = useCurrency();
  const [orders, setOrders] = useState(() => getOrders());
  const [statuses, setStatuses] = useState(() => getStatuses());
  const [expanded, setExpanded] = useState(null);

  const setStatus = (id, status) => {
    const next = { ...statuses, [id]: status };
    setStatuses(next);
    try {
      localStorage.setItem(STATUS_KEY, JSON.stringify(next));
    } catch (e) {
      // ignore
    }
  };

  const refresh = () => {
    setOrders(getOrders());
    setStatuses(getStatuses());
  };

  const sales = useMemo(() => {
    return orders
      .filter((o) => (statuses[o.id] || "placed") !== "cancelled")
      .reduce((s, o) => s + (Number(o.total) || 0), 0);
  }, [orders, statuses]);

  const byDay = useMemo(() => {
    const map = {};
    orders
      .filter((o) => (statuses[o.id] || "placed") !== "cancelled")
      .forEach((o) => {
        const d = new Date(o.date);
        const key = `${d.getMonth() + 1}/${d.getDate()}`;
        map[key] = (map[key] || 0) + (Number(o.total) || 0);
      });
    const entries = Object.entries(map).slice(-7);
    const max = Math.max(1, ...entries.map(([, v]) => v));
    return { entries, max };
  }, [orders, statuses]);

  return (
    <CheckoutWrap>
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <BackLink as={Link} to="/">← Back to home</BackLink>
        <Title>Admin · mock</Title>
        <Sub>Orders from localStorage. Mark fulfilled/cancel. CSS bar chart, no backend.</Sub>
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <h3 style={{ margin: 0 }}>Sales total: {format(sales)} · {orders.length} orders</h3>
            <button type="button" onClick={refresh} style={{ borderRadius: 999, border: "1px solid rgba(255,255,255,.3)", background: "transparent", color: "#fff", padding: ".5rem 1rem", cursor: "pointer" }}>
              Refresh
            </button>
          </div>
          <div style={{ display: "flex", gap: ".6rem", alignItems: "end", height: 120, marginTop: "1rem", borderBottom: "1px solid rgba(255,255,255,.15)", paddingBottom: ".4rem" }} aria-label="Sales bar chart">
            {byDay.entries.length === 0 ? <span style={{ opacity: 0.7 }}>No sales yet. Place a test order.</span> : byDay.entries.map(([day, val]) => (
              <div key={day} style={{ flex: 1, textAlign: "center" }}>
                <div style={{ background: "#e3c987", height: `${Math.max(6, (val / byDay.max) * 90)}px`, borderRadius: "6px 6px 0 0" }} title={`${day}: ${format(val)}`} />
                <div style={{ fontSize: ".72rem", marginTop: ".25rem" }}>{day}</div>
              </div>
            ))}
          </div>
        </Card>
        <Card style={{ marginTop: "1rem" }}>
          <h3 style={{ marginTop: 0 }}>Orders</h3>
          {orders.length === 0 ? <p style={{ opacity: 0.8 }}>No orders yet. Orders placed on this device appear here.</p> : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: ".9rem" }}>
                <thead>
                  <tr style={{ textAlign: "left", color: "#e3c987" }}>
                    <th style={{ padding: ".5rem" }}>ID</th>
                    <th style={{ padding: ".5rem" }}>Items</th>
                    <th style={{ padding: ".5rem" }}>Total</th>
                    <th style={{ padding: ".5rem" }}>Status</th>
                    <th style={{ padding: ".5rem" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[...orders].reverse().map((o) => {
                    const st = statuses[o.id] || "placed";
                    const isOpen = expanded === o.id;
                    const driverNote = o.customer && o.customer.driverNote;
                    const bakerNote = o.customer && o.customer.bakerNote;
                    return (
                      <React.Fragment key={o.id}>
                        <tr style={{ borderTop: "1px solid rgba(255,255,255,.08)" }}>
                          <td style={{ padding: ".5rem" }}>{o.id}<br /><span style={{ opacity: 0.6, fontSize: ".78rem" }}>{new Date(o.date).toLocaleString()}</span></td>
                          <td style={{ padding: ".5rem" }}>
                            {o.items.reduce((s, i) => s + (i.qty || 0), 0)}
                            {(driverNote || bakerNote) ? (
                              <button
                                type="button"
                                onClick={() => setExpanded(isOpen ? null : o.id)}
                                style={{ marginLeft: ".5rem", background: "transparent", border: "1px solid rgba(255,255,255,.3)", color: "#fff", borderRadius: 999, padding: ".15rem .6rem", fontSize: ".72rem", cursor: "pointer" }}
                                aria-expanded={isOpen}
                                aria-label={`Toggle notes for ${o.id}`}
                              >
                                {isOpen ? "Hide notes" : "Show notes"}
                              </button>
                            ) : null}
                          </td>
                          <td style={{ padding: ".5rem" }}>{format(o.total)}</td>
                          <td style={{ padding: ".5rem", textTransform: "capitalize" }}>{st}</td>
                          <td style={{ padding: ".5rem" }}>
                            <div style={{ display: "flex", gap: ".4rem" }}>
                              <button type="button" onClick={() => setStatus(o.id, "fulfilled")} disabled={st === "fulfilled"} style={{ borderRadius: 999, border: "none", background: st === "fulfilled" ? "#555" : "#2f7a44", color: "#fff", padding: ".35rem .8rem", cursor: st === "fulfilled" ? "default" : "pointer", fontSize: ".8rem" }}>
                                Fulfilled
                              </button>
                              <button type="button" onClick={() => setStatus(o.id, "cancelled")} disabled={st === "cancelled"} style={{ borderRadius: 999, border: "1px solid #ff9a9a", background: "transparent", color: "#ff9a9a", padding: ".35rem .8rem", cursor: st === "cancelled" ? "default" : "pointer", fontSize: ".8rem" }}>
                                Cancel
                              </button>
                            </div>
                          </td>
                        </tr>
                        {isOpen && (driverNote || bakerNote) ? (
                          <tr style={{ background: "#0f0f0f" }}>
                            <td colSpan="5" style={{ padding: ".5rem .8rem", borderTop: "1px solid rgba(255,255,255,.05)" }}>
                              {driverNote ? <div style={{ marginBottom: ".25rem" }}><strong style={{ color: "#a9c8e8" }}>Driver:</strong> {driverNote}</div> : null}
                              {bakerNote ? <div><strong style={{ color: "#e3c987" }}>Baker:</strong> {bakerNote}</div> : null}
                            </td>
                          </tr>
                        ) : null}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </CheckoutWrap>
  );
};

export default AdminPage;

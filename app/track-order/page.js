"use client";

import { useState } from "react";

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTrackOrder = async (event) => {
    event.preventDefault();

    setMessage("");
    setOrder(null);

    const cleanedOrderId = orderId.trim();

    if (!cleanedOrderId) {
      setMessage("Please enter your Order ID.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `/api/orders/${encodeURIComponent(cleanedOrderId)}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Order not found.");
      }

      setOrder(data.order);
    } catch (error) {
      setMessage(error.message || "Unable to track your order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={styles.page}>
      <section style={styles.container}>
        <div style={styles.header}>
          <p style={styles.badge}>GiftGenie Order Tracking</p>

          <h1 style={styles.heading}>Track Your Gift</h1>

          <p style={styles.subheading}>
            Enter your Order ID to view the tracking information for your gift.
          </p>
        </div>

        <form onSubmit={handleTrackOrder} style={styles.form}>
          <label htmlFor="orderId" style={styles.label}>
            Order ID
          </label>

          <div style={styles.searchRow}>
            <input
              id="orderId"
              type="text"
              value={orderId}
              onChange={(event) => setOrderId(event.target.value)}
              placeholder="Enter your Order ID"
              autoComplete="off"
              style={styles.input}
            />

            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.button,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Tracking..." : "Track Order"}
            </button>
          </div>
        </form>

        {message && (
          <div style={styles.errorBox}>
            <p style={styles.errorText}>{message}</p>
          </div>
        )}

        {order && (
          <div style={styles.resultCard}>
            <div style={styles.resultHeader}>
              <div>
                <p style={styles.successLabel}>Order Found</p>
                <h2 style={styles.resultTitle}>Your tracking details</h2>
              </div>

              <span style={styles.packageIcon}>🎁</span>
            </div>

            <div style={styles.detailsGrid}>
              <div style={styles.detailBox}>
                <span style={styles.detailLabel}>Order ID</span>
                <strong style={styles.detailValue}>{order.orderId}</strong>
              </div>

              <div style={styles.detailBox}>
                <span style={styles.detailLabel}>Tracking Number</span>
                <strong style={styles.detailValue}>
                  {order.trackingNumber || "Not available yet"}
                </strong>
              </div>
            </div>

            <p style={styles.note}>
              Use this tracking number on the delivery partner&apos;s tracking
              website to check the latest shipment movement.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "80px 20px",
    display: "flex",
    justifyContent: "center",
    background:
      "linear-gradient(135deg, #f8f0f6 0%, #fffaf7 50%, #f2e7ee 100%)",
  },

  container: {
    width: "100%",
    maxWidth: "860px",
  },

  header: {
    textAlign: "center",
    marginBottom: "34px",
  },

  badge: {
    display: "inline-block",
    margin: "0 0 12px",
    padding: "8px 14px",
    borderRadius: "999px",
    background: "#ead8e5",
    color: "#6c315f",
    fontSize: "14px",
    fontWeight: "700",
  },

  heading: {
    margin: "0",
    color: "#4f2146",
    fontSize: "clamp(36px, 6vw, 58px)",
    lineHeight: "1.1",
  },

  subheading: {
    maxWidth: "620px",
    margin: "16px auto 0",
    color: "#6c5b65",
    fontSize: "17px",
    lineHeight: "1.7",
  },

  form: {
    padding: "28px",
    borderRadius: "22px",
    background: "#ffffff",
    boxShadow: "0 18px 50px rgba(89, 45, 79, 0.12)",
  },

  label: {
    display: "block",
    marginBottom: "10px",
    color: "#3f3038",
    fontSize: "15px",
    fontWeight: "700",
  },

  searchRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
  },

  input: {
    flex: "1 1 320px",
    minWidth: "0",
    padding: "15px 16px",
    border: "1px solid #d8c8d2",
    borderRadius: "12px",
    outline: "none",
    color: "#2e252a",
    background: "#fffdfd",
    fontSize: "16px",
  },

  button: {
    flex: "0 0 auto",
    padding: "15px 24px",
    border: "none",
    borderRadius: "12px",
    background: "#6c315f",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "700",
  },

  errorBox: {
    marginTop: "20px",
    padding: "16px 18px",
    border: "1px solid #efc3c3",
    borderRadius: "12px",
    background: "#fff3f3",
  },

  errorText: {
    margin: "0",
    color: "#a13737",
    fontWeight: "600",
  },

  resultCard: {
    marginTop: "26px",
    padding: "30px",
    borderRadius: "22px",
    background: "#ffffff",
    boxShadow: "0 18px 50px rgba(89, 45, 79, 0.12)",
  },

  resultHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    marginBottom: "24px",
  },

  successLabel: {
    margin: "0 0 6px",
    color: "#357a46",
    fontSize: "14px",
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },

  resultTitle: {
    margin: "0",
    color: "#4f2146",
    fontSize: "28px",
  },

  packageIcon: {
    fontSize: "46px",
  },

  detailsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
  },

  detailBox: {
    padding: "18px",
    borderRadius: "14px",
    background: "#f8f0f6",
    border: "1px solid #ead9e4",
  },

  detailLabel: {
    display: "block",
    marginBottom: "8px",
    color: "#7a6672",
    fontSize: "13px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },

  detailValue: {
    display: "block",
    overflowWrap: "anywhere",
    color: "#3e2938",
    fontSize: "18px",
  },

  note: {
    margin: "22px 0 0",
    paddingTop: "18px",
    borderTop: "1px solid #eee3e9",
    color: "#6a5c64",
    lineHeight: "1.7",
  },
};
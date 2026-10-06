
"use client";

import { useState } from "react";

export default function AdminOrdersPage() {
  const [orderId, setOrderId] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    if (!orderId.trim() || !trackingNumber.trim()) {
      setMessage("Order ID aur Tracking Number dono required hain.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: orderId.trim(),
          trackingNumber: trackingNumber.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Order save nahi ho paya.");
      }

      setMessage("Order successfully save ho gaya.");
      setOrderId("");
      setTrackingNumber("");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.heading}>Add Order Tracking</h1>

        <p style={styles.description}>
          Company ka actual Order ID aur Tracking Number yahan enter karo.
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            Order ID
            <input
              type="text"
              value={orderId}
              onChange={(event) => setOrderId(event.target.value)}
              placeholder="Enter actual Order ID"
              style={styles.input}
            />
          </label>

          <label style={styles.label}>
            Tracking Number
            <input
              type="text"
              value={trackingNumber}
              onChange={(event) => setTrackingNumber(event.target.value)}
              placeholder="Enter actual Tracking Number"
              style={styles.input}
            />
          </label>

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "Saving..." : "Save Order"}
          </button>
        </form>

        {message && <p style={styles.message}>{message}</p>}
      </div>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    background: "#f7f2f5",
  },

  card: {
    width: "100%",
    maxWidth: "520px",
    padding: "32px",
    borderRadius: "18px",
    background: "#ffffff",
    boxShadow: "0 12px 35px rgba(0, 0, 0, 0.1)",
  },

  heading: {
    marginBottom: "8px",
    color: "#5a274f",
  },

  description: {
    marginBottom: "24px",
    color: "#6b5b65",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },

  label: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    fontWeight: "600",
    color: "#3f3139",
  },

  input: {
    padding: "12px 14px",
    border: "1px solid #cdbfc7",
    borderRadius: "10px",
    fontSize: "16px",
  },

  button: {
    padding: "13px",
    border: "none",
    borderRadius: "10px",
    background: "#6c315f",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
  },

  message: {
    marginTop: "20px",
    fontWeight: "600",
    color: "#5a274f",
  },
};
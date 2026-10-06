"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();

    setMessage("");

    if (!password.trim()) {
      setMessage("Please enter the admin password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Invalid admin password.");
      }

      router.push("/admin/dashboard");
      router.refresh();
    } catch (error) {
      setMessage(error.message || "Unable to login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <div style={styles.icon}>🔐</div>

        <p style={styles.badge}>GiftGenie Admin</p>

        <h1 style={styles.heading}>Admin Login</h1>

        <p style={styles.description}>
          Enter the admin password to access order management.
        </p>

        <form onSubmit={handleLogin} style={styles.form}>
          <label htmlFor="admin-password" style={styles.label}>
            Admin Password
          </label>

          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter admin password"
            autoComplete="current-password"
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
            {loading ? "Checking..." : "Login to Admin"}
          </button>
        </form>

        {message && <div style={styles.errorBox}>{message}</div>}

        <button
          type="button"
          onClick={() => router.push("/")}
          style={styles.backButton}
        >
          ← Back to GiftGenie
        </button>
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "calc(100vh - 100px)",
    padding: "70px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "linear-gradient(135deg, #f8edf7 0%, #fffaf7 50%, #f2e7df 100%)",
  },

  card: {
    width: "100%",
    maxWidth: "460px",
    padding: "38px",
    borderRadius: "26px",
    background: "#ffffff",
    boxShadow: "0 22px 60px rgba(88, 42, 78, 0.16)",
    textAlign: "center",
  },

  icon: {
    fontSize: "52px",
    marginBottom: "12px",
  },

  badge: {
    display: "inline-block",
    margin: "0 0 14px",
    padding: "8px 14px",
    borderRadius: "999px",
    background: "#f0e2ed",
    color: "#6c315f",
    fontSize: "13px",
    fontWeight: "800",
  },

  heading: {
    margin: "0",
    color: "#3f2038",
    fontSize: "36px",
  },

  description: {
    margin: "14px 0 26px",
    color: "#75646e",
    lineHeight: "1.7",
  },

  form: {
    textAlign: "left",
  },

  label: {
    display: "block",
    marginBottom: "9px",
    color: "#3f3038",
    fontSize: "14px",
    fontWeight: "800",
  },

  input: {
    width: "100%",
    padding: "14px 15px",
    border: "1px solid #dacbd4",
    borderRadius: "12px",
    outline: "none",
    fontSize: "16px",
    color: "#33272e",
    background: "#fffdfd",
    boxSizing: "border-box",
  },

  button: {
    width: "100%",
    marginTop: "16px",
    padding: "14px 18px",
    border: "none",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #6c315f, #9b477d)",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "800",
  },

  errorBox: {
    marginTop: "18px",
    padding: "13px",
    border: "1px solid #efc7c7",
    borderRadius: "11px",
    background: "#fff3f3",
    color: "#a33838",
    fontWeight: "700",
  },

  backButton: {
    marginTop: "20px",
    border: "none",
    background: "transparent",
    color: "#6c315f",
    fontWeight: "800",
    cursor: "pointer",
  },
};
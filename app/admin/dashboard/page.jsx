"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext.jsx";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState("users"); // "users" | "products"
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSellers: 0,
    totalProducts: 0,
  });
  const [usersList, setUsersList] = useState([]);
  const [productsList, setProductsList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, productsRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/users"),
        fetch("/api/seller/products"),
      ]);

      const statsData = await statsRes.json();
      const usersData = await usersRes.json();
      const productsData = await productsRes.json();

      if (statsData.success) setStats(statsData.stats);
      if (usersData.success) setUsersList(usersData.users || []);
      if (productsData.success) setProductsList(productsData.products || []);
    } catch (err) {
      console.error("Failed to load admin dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDeleteUser = async (id, email) => {
    if (!window.confirm(`Are you sure you want to delete user "${email}"?`)) return;

    try {
      const res = await fetch(`/api/admin/users?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setUsersList((prev) => prev.filter((u) => u.id !== id));
        fetchDashboardData();
      } else {
        alert(data.message || "Failed to delete user.");
      }
    } catch (err) {
      console.error("Delete user error:", err);
    }
  };

  const handleDeleteProduct = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete product "${title}"?`)) return;

    try {
      const res = await fetch(`/api/seller/products?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setProductsList((prev) => prev.filter((p) => p.id !== id));
        fetchDashboardData();
      } else {
        alert(data.message || "Failed to delete product.");
      }
    } catch (err) {
      console.error("Delete product error:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch (e) {
      console.error(e);
    }
    await logout();
    router.push("/admin/login");
  };

  return (
    <main style={styles.page}>
      <section style={styles.container}>
        {/* Header */}
        <header style={styles.header}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
              <span style={styles.badge}>GiftGenie Administration</span>
              <span style={styles.adminRoleTag}>Platform Owner</span>
            </div>

            <h1 style={styles.heading}>Admin Dashboard</h1>

            <p style={styles.description}>
              Monitor platform metrics, manage registered user accounts, and oversee seller product listings integrated into the AI recommendation engine.
            </p>
          </div>

          <div style={styles.headerActions}>
            <button
              type="button"
              onClick={() => router.push("/")}
              style={styles.homeButton}
            >
              View Website
            </button>

            <button
              type="button"
              onClick={handleLogout}
              style={styles.logoutButton}
            >
              Logout
            </button>
          </div>
        </header>

        {/* Overview Metrics Cards */}
        <div style={styles.statsGrid}>
          <article style={styles.statCard}>
            <span style={styles.statIcon}>👥</span>
            <div>
              <strong style={styles.statValue}>{stats.totalUsers}</strong>
              <p style={styles.statLabel}>Total Registered Users</p>
            </div>
          </article>

          <article style={styles.statCard}>
            <span style={styles.statIcon}>🛍️</span>
            <div>
              <strong style={styles.statValue}>{stats.totalSellers}</strong>
              <p style={styles.statLabel}>Total Sellers</p>
            </div>
          </article>

          <article style={styles.statCard}>
            <span style={styles.statIcon}>🎁</span>
            <div>
              <strong style={styles.statValue}>{stats.totalProducts}</strong>
              <p style={styles.statLabel}>Seller Products Listed</p>
            </div>
          </article>

          <article style={styles.statCard}>
            <span style={styles.statIcon}>🤖</span>
            <div>
              <strong style={{ ...styles.statValue, color: "#16a34a" }}>Gemini Flash</strong>
              <p style={styles.statLabel}>AI Recommendation Engine</p>
            </div>
          </article>
        </div>

        {/* Tab Navigation */}
        <div style={styles.tabsNav}>
          <button
            type="button"
            onClick={() => setActiveTab("users")}
            style={{
              ...styles.tabBtn,
              background: activeTab === "users" ? "#6c315f" : "#ffffff",
              color: activeTab === "users" ? "#ffffff" : "#45243e",
              border: activeTab === "users" ? "none" : "1px solid #dacbd4",
            }}
          >
            👥 Registered Users ({usersList.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("products")}
            style={{
              ...styles.tabBtn,
              background: activeTab === "products" ? "#6c315f" : "#ffffff",
              color: activeTab === "products" ? "#ffffff" : "#45243e",
              border: activeTab === "products" ? "none" : "1px solid #dacbd4",
            }}
          >
            🎁 Seller Products ({productsList.length})
          </button>
        </div>

        {/* Main Panel Content */}
        <div style={styles.tableCard}>
          {loading ? (
            <div style={styles.loadingBox}>Loading platform records...</div>
          ) : activeTab === "users" ? (
            /* Users Table */
            <div>
              <div style={styles.tableHeaderRow}>
                <h2 style={styles.tableTitle}>Recent User Registrations</h2>
                <span style={styles.tableSubtitle}>
                  Permanent database records of all customers and sellers
                </span>
              </div>

              {usersList.length === 0 ? (
                <div style={styles.emptyState}>No registered users found.</div>
              ) : (
                <div style={styles.tableWrapper}>
                  <table style={styles.table}>
                    <thead>
                      <tr style={styles.thRow}>
                        <th style={styles.th}>Name</th>
                        <th style={styles.th}>Email</th>
                        <th style={styles.th}>Role</th>
                        <th style={styles.th}>Registered At</th>
                        <th style={styles.th}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usersList.map((u) => (
                        <tr key={u.id} style={styles.tr}>
                          <td style={styles.td}>
                            <strong>{u.name}</strong>
                          </td>
                          <td style={styles.td}>{u.email}</td>
                          <td style={styles.td}>
                            <span
                              style={{
                                ...styles.rolePill,
                                background:
                                  u.role === "admin"
                                    ? "#fef3c7"
                                    : u.role === "seller"
                                    ? "#dcfce7"
                                    : "#f3e8ff",
                                color:
                                  u.role === "admin"
                                    ? "#92400e"
                                    : u.role === "seller"
                                    ? "#166534"
                                    : "#6b21a8",
                              }}
                            >
                              {u.role.toUpperCase()}
                            </span>
                          </td>
                          <td style={styles.td}>
                            {u.createdAt
                              ? new Date(u.createdAt).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })
                              : "Recent"}
                          </td>
                          <td style={styles.td}>
                            {u.role !== "admin" && (
                              <button
                                type="button"
                                onClick={() => handleDeleteUser(u.id, u.email)}
                                style={styles.deleteActionBtn}
                              >
                                Delete
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            /* Seller Products Table */
            <div>
              <div style={styles.tableHeaderRow}>
                <h2 style={styles.tableTitle}>Products Listed by Sellers</h2>
                <span style={styles.tableSubtitle}>
                  Integrated directly into the Gemini Flash recommendation engine
                </span>
              </div>

              {productsList.length === 0 ? (
                <div style={styles.emptyState}>
                  No seller products listed yet. Products added from /seller/dashboard will appear here.
                </div>
              ) : (
                <div style={styles.tableWrapper}>
                  <table style={styles.table}>
                    <thead>
                      <tr style={styles.thRow}>
                        <th style={styles.th}>Product Title</th>
                        <th style={styles.th}>Category</th>
                        <th style={styles.th}>Price</th>
                        <th style={styles.th}>Seller</th>
                        <th style={styles.th}>Store Link</th>
                        <th style={styles.th}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productsList.map((p) => (
                        <tr key={p.id} style={styles.tr}>
                          <td style={styles.td}>
                            <strong style={{ color: "#3f2038" }}>{p.title}</strong>
                            {p.description && (
                              <p style={styles.itemSnippet}>{p.description.slice(0, 75)}...</p>
                            )}
                          </td>
                          <td style={styles.td}>
                            <span style={styles.catBadge}>{p.category}</span>
                          </td>
                          <td style={styles.td}>
                            <strong style={{ color: "#45243e" }}>{p.price}</strong>
                          </td>
                          <td style={styles.td}>
                            <span>{p.sellerName || "Seller"}</span>
                            <small style={{ display: "block", color: "#8a7e8e" }}>
                              {p.sellerEmail}
                            </small>
                          </td>
                          <td style={styles.td}>
                            <a
                              href={p.purchaseUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={styles.extLink}
                            >
                              Visit URL ↗
                            </a>
                          </td>
                          <td style={styles.td}>
                            <button
                              type="button"
                              onClick={() => handleDeleteProduct(p.id, p.title)}
                              style={styles.deleteActionBtn}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "60px 22px 80px",
    background: "linear-gradient(135deg, #f7edf5 0%, #fffaf7 52%, #f2e7df 100%)",
  },
  container: {
    width: "100%",
    maxWidth: "1240px",
    margin: "0 auto",
  },
  header: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "24px",
    marginBottom: "34px",
  },
  badge: {
    display: "inline-block",
    padding: "7px 14px",
    borderRadius: "999px",
    background: "#ead9e6",
    color: "#6c315f",
    fontSize: "13px",
    fontWeight: "800",
  },
  adminRoleTag: {
    display: "inline-block",
    padding: "6px 12px",
    borderRadius: "999px",
    background: "#fef3c7",
    color: "#92400e",
    fontSize: "12px",
    fontWeight: "800",
  },
  heading: {
    margin: "0",
    color: "#3f2038",
    fontSize: "clamp(34px, 5vw, 48px)",
  },
  description: {
    maxWidth: "680px",
    margin: "12px 0 0",
    color: "#75636d",
    fontSize: "16px",
    lineHeight: "1.65",
  },
  headerActions: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
  },
  homeButton: {
    padding: "12px 18px",
    border: "1px solid #cab5c3",
    borderRadius: "12px",
    background: "#ffffff",
    color: "#5d2e52",
    fontWeight: "800",
    fontSize: "14px",
    cursor: "pointer",
  },
  logoutButton: {
    padding: "12px 18px",
    border: "none",
    borderRadius: "12px",
    background: "#6c315f",
    color: "#ffffff",
    fontWeight: "800",
    fontSize: "14px",
    cursor: "pointer",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
    gap: "18px",
    marginBottom: "32px",
  },
  statCard: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "22px",
    border: "1px solid rgba(111, 63, 94, 0.12)",
    borderRadius: "20px",
    background: "#ffffff",
    boxShadow: "0 15px 35px rgba(85, 43, 73, 0.08)",
  },
  statIcon: {
    fontSize: "36px",
  },
  statValue: {
    display: "block",
    color: "#45243e",
    fontSize: "24px",
  },
  statLabel: {
    margin: "4px 0 0",
    color: "#7a6872",
    fontSize: "13.5px",
    fontWeight: "600",
  },
  tabsNav: {
    display: "flex",
    gap: "12px",
    marginBottom: "20px",
  },
  tabBtn: {
    padding: "12px 20px",
    borderRadius: "14px",
    fontWeight: "800",
    fontSize: "14.5px",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  tableCard: {
    padding: "30px",
    borderRadius: "24px",
    background: "#ffffff",
    border: "1px solid rgba(111, 63, 94, 0.12)",
    boxShadow: "0 18px 45px rgba(85, 43, 73, 0.08)",
  },
  tableHeaderRow: {
    marginBottom: "22px",
  },
  tableTitle: {
    margin: "0 0 5px",
    color: "#3f2038",
    fontSize: "22px",
  },
  tableSubtitle: {
    color: "#75636d",
    fontSize: "14px",
  },
  loadingBox: {
    padding: "40px",
    textAlign: "center",
    color: "#75636d",
    fontSize: "15px",
  },
  emptyState: {
    padding: "50px 20px",
    textAlign: "center",
    background: "#faf5f8",
    borderRadius: "16px",
    color: "#75636d",
    fontSize: "15px",
  },
  tableWrapper: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
  },
  thRow: {
    borderBottom: "2px solid #eddfe9",
  },
  th: {
    padding: "14px 16px",
    color: "#6c315f",
    fontSize: "13px",
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  tr: {
    borderBottom: "1px solid #f2e6ee",
  },
  td: {
    padding: "16px",
    fontSize: "14.5px",
    color: "#3f2038",
  },
  rolePill: {
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: "800",
  },
  catBadge: {
    display: "inline-block",
    padding: "4px 9px",
    borderRadius: "8px",
    background: "#f3e8ff",
    color: "#7e22ce",
    fontSize: "12px",
    fontWeight: "700",
  },
  itemSnippet: {
    margin: "4px 0 0",
    color: "#7a6872",
    fontSize: "12px",
  },
  extLink: {
    color: "#7e22ce",
    fontWeight: "800",
    textDecoration: "none",
    fontSize: "13.5px",
  },
  deleteActionBtn: {
    background: "transparent",
    border: "1px solid #fca5a5",
    color: "#dc2626",
    borderRadius: "8px",
    padding: "5px 12px",
    fontSize: "12px",
    fontWeight: "800",
    cursor: "pointer",
  },
};
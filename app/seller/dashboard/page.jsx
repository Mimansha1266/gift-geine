"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext.jsx";

const CATEGORIES = [
  "Personalized Keepsakes",
  "Home & Living",
  "Tech & Gadgets",
  "Wellness & Spa",
  "Gourmet & Treats",
  "Fashion & Jewelry",
  "Handmade Crafts",
];

export default function SellerDashboardPage() {
  const router = useRouter();
  const { user, logout, loading: authLoading } = useAuth();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    purchaseUrl: "",
    category: "Personalized Keepsakes",
    tags: "",
  });

  // Load products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/seller/products");
      const data = await res.json();
      if (data.success) {
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setMessage({ type: "", text: "" });
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!formData.title.trim() || !formData.price.trim() || !formData.purchaseUrl.trim()) {
      setMessage({ type: "error", text: "Please enter product title, price, and purchase URL." });
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/seller/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags
            ? formData.tags.split(",").map((t) => t.trim()).filter(Boolean)
            : [],
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Unable to list product.");
      }

      setMessage({ type: "success", text: "Product successfully listed on GiftGenie!" });
      setFormData({
        title: "",
        description: "",
        price: "",
        purchaseUrl: "",
        category: "Personalized Keepsakes",
        tags: "",
      });
      fetchProducts();
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Failed to create product." });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to remove this product?")) return;

    try {
      const res = await fetch(`/api/seller/products?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert(data.message || "Failed to delete product.");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const sellerDisplayName = user?.name || "Seller Partner";

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        {/* Header Section */}
        <header style={styles.header}>
          <div>
            <div style={styles.badgeRow}>
              <span style={styles.badge}>🛍️ GiftGenie Seller Hub</span>
              <span style={styles.roleTag}>Verified Seller</span>
            </div>
            <h1 style={styles.heading}>Welcome, {sellerDisplayName}!</h1>
            <p style={styles.subtitle}>
              List your products to be recommended directly by GiftGenie AI to thousands of shoppers looking for meaningful gifts.
            </p>
          </div>

          <div style={styles.headerActions}>
            <button
              type="button"
              onClick={() => router.push("/")}
              style={styles.outlineBtn}
            >
              Browse Website
            </button>
            <button
              type="button"
              onClick={handleLogout}
              style={styles.logoutBtn}
            >
              Logout
            </button>
          </div>
        </header>

        {/* Quick Stats Grid */}
        <section style={styles.statsGrid}>
          <div style={styles.statCard}>
            <span style={styles.statIcon}>🎁</span>
            <div>
              <strong style={styles.statNumber}>{products.length}</strong>
              <p style={styles.statLabel}>Products Listed</p>
            </div>
          </div>

          <div style={styles.statCard}>
            <span style={styles.statIcon}>🤖</span>
            <div>
              <strong style={{ ...styles.statNumber, color: "#16a34a" }}>Active</strong>
              <p style={styles.statLabel}>AI Recommendation Engine</p>
            </div>
          </div>

          <div style={styles.statCard}>
            <span style={styles.statIcon}>📈</span>
            <div>
              <strong style={styles.statNumber}>100% Free</strong>
              <p style={styles.statLabel}>Zero Listing Fees</p>
            </div>
          </div>
        </section>

        {/* Main Content Layout */}
        <div style={styles.contentLayout}>
          {/* Left: Product Listing Form */}
          <section style={styles.formCard}>
            <div style={styles.cardHeader}>
              <span style={styles.formIcon}>✨</span>
              <div>
                <h2 style={styles.cardTitle}>List a New Gift Product</h2>
                <p style={styles.cardSubtitle}>
                  This product will be injected into AI recommendations when users search for matching gifts.
                </p>
              </div>
            </div>

            {message.text && (
              <div
                style={{
                  ...styles.alertBox,
                  background: message.type === "success" ? "#f0fdf4" : "#fef2f2",
                  color: message.type === "success" ? "#166534" : "#991b1b",
                  border: `1px solid ${message.type === "success" ? "#bbf7d0" : "#fecaca"}`,
                }}
              >
                {message.type === "success" ? "✓ " : "⚠ "}
                {message.text}
              </div>
            )}

            <form onSubmit={handleCreateProduct} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Product Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Personalized Engraved Wooden Keepsake Box"
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Price (INR) *</label>
                  <input
                    type="text"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="e.g. ₹1,499"
                    style={styles.input}
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    style={styles.select}
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Purchase URL / Store Link *</label>
                <input
                  type="url"
                  name="purchaseUrl"
                  value={formData.purchaseUrl}
                  onChange={handleChange}
                  placeholder="https://amazon.in/dp/... or https://yourstore.com/item"
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Tags (comma separated)</label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="e.g. handcrafted, birthday, sister, luxury, wooden"
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Description</label>
                <textarea
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe what makes this gift special, materials used, personalization options..."
                  style={styles.textarea}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                style={{
                  ...styles.submitBtn,
                  opacity: submitting ? 0.75 : 1,
                  cursor: submitting ? "not-allowed" : "pointer",
                }}
              >
                {submitting ? "Listing Product..." : "+ List Product in GiftGenie AI"}
              </button>
            </form>
          </section>

          {/* Right: Listed Products Table/Cards */}
          <section style={styles.productsCard}>
            <div style={styles.cardHeader}>
              <span style={styles.formIcon}>📦</span>
              <div>
                <h2 style={styles.cardTitle}>Your Listed Products</h2>
                <p style={styles.cardSubtitle}>
                  {products.length} {products.length === 1 ? "product" : "products"} active in GiftGenie AI catalog
                </p>
              </div>
            </div>

            {loading ? (
              <div style={styles.emptyState}>Loading your listings...</div>
            ) : products.length === 0 ? (
              <div style={styles.emptyState}>
                <span style={{ fontSize: "42px", display: "block", marginBottom: "12px" }}>🎁</span>
                <strong style={{ fontSize: "17px", color: "#44223c" }}>No products listed yet</strong>
                <p style={{ color: "#74626c", fontSize: "14px", marginTop: "6px" }}>
                  Use the form on the left to add your first product. It will be prioritized by the AI recommendation engine!
                </p>
              </div>
            ) : (
              <div style={styles.productList}>
                {products.map((product) => (
                  <article key={product.id} style={styles.productItem}>
                    <div style={styles.productMain}>
                      <div style={styles.productBadgeRow}>
                        <span style={styles.categoryBadge}>{product.category}</span>
                        <strong style={styles.priceTag}>{product.price}</strong>
                      </div>

                      <h3 style={styles.productTitle}>{product.title}</h3>
                      {product.description && (
                        <p style={styles.productDescription}>{product.description}</p>
                      )}

                      {product.tags && product.tags.length > 0 && (
                        <div style={styles.tagRow}>
                          {product.tags.map((tag, i) => (
                            <span key={i} style={styles.tagPill}>
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div style={styles.productActions}>
                      <a
                        href={product.purchaseUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={styles.viewLink}
                      >
                        Visit Link ↗
                      </a>
                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(product.id)}
                        style={styles.deleteBtn}
                        title="Delete product"
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "50px 20px 80px",
    background: "linear-gradient(135deg, #f7edf5 0%, #fffaf7 52%, #f2e7df 100%)",
  },
  container: {
    maxWidth: "1240px",
    margin: "0 auto",
  },
  header: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "24px",
    marginBottom: "32px",
  },
  badgeRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "12px",
  },
  badge: {
    padding: "6px 14px",
    borderRadius: "999px",
    background: "#ead9e6",
    color: "#6c315f",
    fontSize: "12.5px",
    fontWeight: "800",
  },
  roleTag: {
    padding: "5px 12px",
    borderRadius: "999px",
    background: "#dcfce7",
    color: "#166534",
    fontSize: "12px",
    fontWeight: "800",
  },
  heading: {
    margin: "0",
    color: "#3f2038",
    fontSize: "clamp(32px, 4vw, 44px)",
    lineHeight: "1.2",
  },
  subtitle: {
    maxWidth: "680px",
    margin: "12px 0 0",
    color: "#75636d",
    fontSize: "15.5px",
    lineHeight: "1.6",
  },
  headerActions: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },
  outlineBtn: {
    padding: "11px 18px",
    border: "1px solid #cab5c3",
    borderRadius: "12px",
    background: "#ffffff",
    color: "#5d2e52",
    fontWeight: "800",
    fontSize: "14px",
    cursor: "pointer",
  },
  logoutBtn: {
    padding: "11px 18px",
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
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "18px",
    marginBottom: "36px",
  },
  statCard: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "20px 24px",
    borderRadius: "20px",
    background: "#ffffff",
    border: "1px solid rgba(111, 63, 94, 0.12)",
    boxShadow: "0 12px 30px rgba(85, 43, 73, 0.06)",
  },
  statIcon: {
    fontSize: "34px",
  },
  statNumber: {
    fontSize: "24px",
    color: "#3f2038",
    display: "block",
  },
  statLabel: {
    margin: "4px 0 0",
    color: "#7a6872",
    fontSize: "13.5px",
    fontWeight: "600",
  },
  contentLayout: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
    gap: "28px",
    alignItems: "start",
  },
  formCard: {
    padding: "30px",
    borderRadius: "24px",
    background: "#ffffff",
    border: "1px solid rgba(111, 63, 94, 0.12)",
    boxShadow: "0 18px 45px rgba(85, 43, 73, 0.08)",
  },
  productsCard: {
    padding: "30px",
    borderRadius: "24px",
    background: "#ffffff",
    border: "1px solid rgba(111, 63, 94, 0.12)",
    boxShadow: "0 18px 45px rgba(85, 43, 73, 0.08)",
    minHeight: "400px",
  },
  cardHeader: {
    display: "flex",
    alignItems: "flex-start",
    gap: "14px",
    marginBottom: "22px",
  },
  formIcon: {
    fontSize: "26px",
    background: "#f7edf5",
    padding: "8px 12px",
    borderRadius: "14px",
  },
  cardTitle: {
    margin: "0 0 4px",
    color: "#3f2038",
    fontSize: "21px",
  },
  cardSubtitle: {
    margin: "0",
    color: "#75636d",
    fontSize: "13.5px",
    lineHeight: "1.45",
  },
  alertBox: {
    padding: "12px 16px",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: "700",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    flex: 1,
  },
  formRow: {
    display: "flex",
    gap: "14px",
  },
  label: {
    color: "#4a3346",
    fontSize: "13.5px",
    fontWeight: "800",
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "12px",
    border: "1px solid #dacbd4",
    background: "#fffdfd",
    fontSize: "14.5px",
    outline: "none",
    boxSizing: "border-box",
  },
  select: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "12px",
    border: "1px solid #dacbd4",
    background: "#fffdfd",
    fontSize: "14.5px",
    outline: "none",
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "12px",
    border: "1px solid #dacbd4",
    background: "#fffdfd",
    fontSize: "14.5px",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
    resize: "vertical",
  },
  submitBtn: {
    marginTop: "8px",
    padding: "14px 20px",
    borderRadius: "13px",
    border: "none",
    background: "linear-gradient(135deg, #6c315f, #9b477d)",
    color: "#ffffff",
    fontWeight: "800",
    fontSize: "15px",
    cursor: "pointer",
    boxShadow: "0 8px 20px rgba(108, 49, 95, 0.25)",
  },
  emptyState: {
    padding: "50px 20px",
    textAlign: "center",
    background: "#faf5f8",
    borderRadius: "18px",
  },
  productList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    maxHeight: "650px",
    overflowY: "auto",
    paddingRight: "4px",
  },
  productItem: {
    padding: "18px",
    borderRadius: "16px",
    background: "#fdfafd",
    border: "1px solid #eddfe9",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  productMain: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  productBadgeRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoryBadge: {
    fontSize: "11.5px",
    fontWeight: "800",
    color: "#7e22ce",
    background: "#f3e8ff",
    padding: "3px 9px",
    borderRadius: "999px",
  },
  priceTag: {
    fontSize: "16px",
    color: "#3f2038",
    fontWeight: "800",
  },
  productTitle: {
    margin: "4px 0 0",
    fontSize: "16.5px",
    color: "#3f2038",
    lineHeight: "1.35",
  },
  productDescription: {
    margin: "0",
    fontSize: "13.5px",
    color: "#6b5864",
    lineHeight: "1.45",
  },
  tagRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
    marginTop: "4px",
  },
  tagPill: {
    fontSize: "11px",
    fontWeight: "700",
    color: "#6b5864",
    background: "#ece4ea",
    padding: "2px 7px",
    borderRadius: "6px",
  },
  productActions: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: "10px",
    borderTop: "1px solid #eddfe9",
  },
  viewLink: {
    fontSize: "13.5px",
    fontWeight: "800",
    color: "#7e22ce",
    textDecoration: "none",
  },
  deleteBtn: {
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

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext.jsx";
import "./RoleGateway.css";

const ROLES = [
  {
    id: "user",
    icon: "🎁",
    badge: "For Shoppers",
    title: "User / Buyer",
    subtitle: "AI Gift Finder & Saved Wishlists",
    description: "Discover personalized gifts with AI, explore trending gift ideas, and checkout via verified sellers.",
    color: "#7e22ce",
    badgeBg: "#f3e8ff",
    badgeColor: "#6b21a8",
  },
  {
    id: "seller",
    icon: "🛍️",
    badge: "For Artisans & Vendors",
    title: "Seller Partner",
    subtitle: "List Products & Manage Catalog",
    description: "List your gift items on GiftGenie. Your products get featured directly inside AI gift recommendations.",
    color: "#16a34a",
    badgeBg: "#dcfce7",
    badgeColor: "#15803d",
  },
  {
    id: "admin",
    icon: "🔐",
    badge: "For Platform Staff",
    title: "Admin / Owner",
    subtitle: "Platform Analytics & Oversight",
    description: "Manage registered users, moderate seller product listings, and view live platform metrics.",
    color: "#b45309",
    badgeBg: "#fef3c7",
    badgeColor: "#92400e",
  },
];

export default function RoleGateway({ onGuestExplore, initialRole = "user", initialMode = "signup" }) {
  const router = useRouter();
  const { signup, login } = useAuth();

  const [activeRole, setActiveRole] = useState(initialRole); // "user" | "seller" | "admin"
  const [authMode, setAuthMode] = useState(initialRole === "admin" ? "login" : initialMode);

  // User & Seller Form
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreed: true,
  });

  // Admin Form
  const [adminEmail, setAdminEmail] = useState("admin@giftgenie.com");
  const [adminPassword, setAdminPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRoleSelect = (roleId) => {
    setActiveRole(roleId);
    setError("");
    if (roleId === "admin") {
      setAuthMode("login");
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError("");
  };

  // Submit Handler for User or Seller
  const handleUserOrSellerSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (authMode === "signup") {
      if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
        setError("Please fill in all required fields.");
        return;
      }

      if (formData.name.trim().length < 2) {
        setError("Name must be at least 2 characters.");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        setError("Please enter a valid email address.");
        return;
      }

      if (formData.password.length < 8) {
        setError("Password must contain at least 8 characters.");
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      if (!formData.agreed) {
        setError("Please accept the terms to proceed.");
        return;
      }

      try {
        setLoading(true);
        await signup({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
          role: activeRole, // "user" or "seller"
        });

        if (activeRole === "seller") {
          router.push("/seller/dashboard");
        } else {
          if (onGuestExplore) {
            onGuestExplore();
          } else {
            router.push("/#gift-finder-view");
          }
        }
      } catch (err) {
        setError(err.message || "Failed to create account. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      // Login mode for User or Seller
      if (!formData.email.trim() || !formData.password) {
        setError("Please enter both email and password.");
        return;
      }

      try {
        setLoading(true);
        const loggedUser = await login(formData.email.trim(), formData.password);

        if (loggedUser?.role === "seller") {
          router.push("/seller/dashboard");
        } else if (loggedUser?.role === "admin") {
          router.push("/admin/dashboard");
        } else {
          if (onGuestExplore) {
            onGuestExplore();
          } else {
            router.push("/#gift-finder-view");
          }
        }
      } catch (err) {
        setError(err.message || "Invalid credentials. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  // Submit Handler for Admin
  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!adminPassword.trim()) {
      setError("Please enter the admin master password.");
      return;
    }

    try {
      setLoading(true);
      await login(adminEmail.trim(), adminPassword.trim());
      router.push("/admin/dashboard");
    } catch (err) {
      setError(err.message || "Invalid admin password. Default is admin12345.");
    } finally {
      setLoading(false);
    }
  };

  const currentRole = ROLES.find((r) => r.id === activeRole) || ROLES[0];

  return (
    <section className="gateway-section" id="role-gateway">
      <div className="gateway-container">
        {/* Top Header */}
        <div className="gateway-header">
          <div className="gateway-brand">
            <span className="gateway-logo-icon">🎁</span>
            <span className="gateway-logo-text">GiftGenie</span>
          </div>

          <span className="gateway-badge">✨ STEP 1: CHOOSE YOUR ROLE</span>

          <h1 className="gateway-title">
            Welcome to <span>GiftGenie</span>
          </h1>

          <p className="gateway-subtitle">
            Please choose how you want to access the platform. Select whether you are signing up as a{" "}
            <strong>Gift Buyer (User)</strong>, a <strong>Partner Seller</strong> to list products, or logging in as the{" "}
            <strong>Platform Admin</strong>.
          </p>
        </div>

        {/* 3 Role Selection Cards */}
        <div className="gateway-roles-grid">
          {ROLES.map((role) => {
            const isSelected = activeRole === role.id;
            return (
              <button
                type="button"
                key={role.id}
                className={`gateway-role-card ${isSelected ? "selected" : ""}`}
                onClick={() => handleRoleSelect(role.id)}
              >
                <div className="role-card-top">
                  <div className="role-card-icon">{role.icon}</div>
                  <span
                    className="role-card-badge"
                    style={{ background: role.badgeBg, color: role.badgeColor }}
                  >
                    {role.badge}
                  </span>
                </div>

                <h3 className="role-card-title">{role.title}</h3>
                <p className="role-card-subtitle">{role.subtitle}</p>
                <p className="role-card-desc">{role.description}</p>

                <div className="role-card-footer">
                  <span className={`select-indicator ${isSelected ? "active" : ""}`}>
                    {isSelected ? "✓ Selected" : "Select Role →"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Form Container for the Selected Role */}
        <div className="gateway-form-wrapper">
          <div className="gateway-form-header">
            <div className="form-header-left">
              <span className="form-role-icon">{currentRole.icon}</span>
              <div>
                <h2>
                  {activeRole === "admin"
                    ? "Admin Portal Access"
                    : `${authMode === "signup" ? "Sign Up" : "Sign In"} as ${currentRole.title}`}
                </h2>
                <p>
                  {activeRole === "admin"
                    ? "Log in with admin credentials to access platform oversight"
                    : activeRole === "seller"
                    ? `${authMode === "signup" ? "Register your business" : "Sign in"} to access your Seller Hub and list gift items`
                    : `${authMode === "signup" ? "Create your buyer account" : "Sign in"} to unlock AI gift recommendations`}
                </p>
              </div>
            </div>

            {/* Auth Mode Toggle (Signup vs Login) for User & Seller */}
            {activeRole !== "admin" && (
              <div className="auth-mode-toggle">
                <button
                  type="button"
                  className={`toggle-btn ${authMode === "signup" ? "active" : ""}`}
                  onClick={() => {
                    setAuthMode("signup");
                    setError("");
                  }}
                >
                  Sign Up
                </button>
                <button
                  type="button"
                  className={`toggle-btn ${authMode === "login" ? "active" : ""}`}
                  onClick={() => {
                    setAuthMode("login");
                    setError("");
                  }}
                >
                  Sign In
                </button>
              </div>
            )}
          </div>

          {/* Form Error Alert */}
          {error && (
            <div className="gateway-alert-error" role="alert">
              ⚠️ {error}
            </div>
          )}

          {/* Role Forms */}
          {activeRole === "admin" ? (
            /* ADMIN LOGIN FORM */
            <form onSubmit={handleAdminSubmit} className="gateway-form">
              <div className="gateway-form-row">
                <div className="gateway-input-group">
                  <label htmlFor="adminEmail">Admin Email</label>
                  <input
                    id="adminEmail"
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="gateway-input-group">
                  <label htmlFor="adminPassword">Admin Master Password</label>
                  <input
                    id="adminPassword"
                    type="password"
                    value={adminPassword}
                    onChange={(e) => {
                      setAdminPassword(e.target.value);
                      setError("");
                    }}
                    placeholder="Enter admin password (default: admin12345)"
                    autoComplete="current-password"
                    required
                  />
                </div>
              </div>

              <div className="gateway-action-bar">
                <button
                  type="submit"
                  className="gateway-submit-btn admin-btn"
                  disabled={loading}
                >
                  {loading ? "Verifying..." : "Enter Admin Dashboard ↗"}
                </button>
              </div>
            </form>
          ) : (
            /* USER OR SELLER SIGNUP / LOGIN FORM */
            <form onSubmit={handleUserOrSellerSubmit} className="gateway-form">
              <div className="gateway-form-row">
                {authMode === "signup" && (
                  <div className="gateway-input-group full-width">
                    <label htmlFor="name">
                      {activeRole === "seller" ? "Business / Store Name" : "Your Full Name"}
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder={
                        activeRole === "seller"
                          ? "e.g. GiftVerse Creations"
                          : "e.g. Mimansha Chaudhary"
                      }
                      autoComplete="name"
                      required
                    />
                  </div>
                )}

                <div className="gateway-input-group">
                  <label htmlFor="email">
                    {activeRole === "seller" ? "Business Email" : "Email Address"}
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="name@example.com"
                    autoComplete="email"
                    required
                  />
                </div>

                <div className="gateway-input-group">
                  <label htmlFor="password">Password</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Minimum 8 characters"
                    autoComplete={authMode === "signup" ? "new-password" : "current-password"}
                    required
                  />
                </div>

                {authMode === "signup" && (
                  <div className="gateway-input-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Re-enter password"
                      autoComplete="new-password"
                      required
                    />
                  </div>
                )}
              </div>

              {authMode === "signup" && (
                <label className="gateway-terms-checkbox">
                  <input
                    type="checkbox"
                    name="agreed"
                    checked={formData.agreed}
                    onChange={handleInputChange}
                    required
                  />
                  <span>
                    I accept GiftGenie&apos;s Terms of Service and Privacy Policy.
                  </span>
                </label>
              )}

              <div className="gateway-action-bar">
                <button
                  type="submit"
                  className={`gateway-submit-btn ${activeRole === "seller" ? "seller-btn" : "user-btn"}`}
                  disabled={loading}
                >
                  {loading
                    ? "Processing..."
                    : authMode === "signup"
                    ? activeRole === "seller"
                      ? "Create Seller Account & Enter Hub →"
                      : "Create Buyer Account & Start Shopping →"
                    : activeRole === "seller"
                    ? "Sign In to Seller Hub →"
                    : "Sign In as Buyer →"}
                </button>

                {/* Guest option for users */}
                {activeRole === "user" && onGuestExplore && (
                  <button
                    type="button"
                    className="gateway-guest-btn"
                    onClick={onGuestExplore}
                  >
                    Or Explore GiftGenie as Guest Shopper →
                  </button>
                )}
              </div>
            </form>
          )}

          {/* Quick Demo Accounts Helper */}
          <div className="gateway-demo-box">
            <div className="demo-box-header">
              <span>🔑</span>
              <strong>Quick Test Logins:</strong>
            </div>
            <div className="demo-box-grid">
              <button
                type="button"
                className="demo-chip"
                onClick={() => {
                  setActiveRole("user");
                  setAuthMode("login");
                  setFormData((p) => ({ ...p, email: "demo@acme.test", password: "password123" }));
                }}
              >
                <strong>Buyer:</strong> demo@acme.test / password123
              </button>
              <button
                type="button"
                className="demo-chip"
                onClick={() => {
                  setActiveRole("seller");
                  setAuthMode("login");
                  setFormData((p) => ({ ...p, email: "rahul@giftverse.in", password: "seller123" }));
                }}
              >
                <strong>Seller:</strong> rahul@giftverse.in / seller123
              </button>
              <button
                type="button"
                className="demo-chip"
                onClick={() => {
                  setActiveRole("admin");
                  setAdminEmail("admin@giftgenie.com");
                  setAdminPassword("admin12345");
                }}
              >
                <strong>Admin:</strong> admin@giftgenie.com / admin12345
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

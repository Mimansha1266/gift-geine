"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext.jsx";
import RoleGateway from "../components/RoleGateway/RoleGateway.jsx";
import Hero from "../components/Hero/Hero.jsx";
import Brands from "../components/Brands/Brands.jsx";
import GiftFinder from "../components/GiftFinder/GiftFinder.jsx";
import TrendingGifts from "../components/TrendingGifts/TrendingGifts.jsx";
import HowItWorks from "../components/HowItWorks/HowItWorks.jsx";
import Features from "../components/Features/Features.jsx";
import Corporate from "../components/Corporate/Corporate.jsx";
import FAQ from "../components/FAQ/FAQ.jsx";
import Footer from "../components/Footer/Footer.jsx";

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [guestMode, setGuestMode] = useState(false);

  // Auto-redirect sellers to Seller Dashboard and admins to Admin Dashboard
  useEffect(() => {
    if (!loading && user) {
      if (user.role === "seller") {
        router.replace("/seller/dashboard");
      } else if (user.role === "admin") {
        router.replace("/admin/dashboard");
      }
    }
  }, [user, loading, router]);

  // While checking auth state, show a clean loader
  if (loading) {
    return (
      <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#7b2cbf", fontWeight: "700" }}>Loading GiftGenie...</p>
      </div>
    );
  }

  // 1. If user is logged in as "user", show full customer shopping experience
  if (user && user.role === "user") {
    return (
      <main>
        <Hero />
        <Brands />
        <GiftFinder />
        <TrendingGifts />
        <HowItWorks />
        <Features />
        <Corporate />
        <FAQ />
        <Footer />
      </main>
    );
  }

  // 2. If visitor selected "Explore as Guest Shopper", show full customer shopping experience
  if (guestMode) {
    return (
      <main>
        <div style={{
          background: "linear-gradient(135deg, #f3e8ff, #fce7f3)",
          padding: "10px 20px",
          textAlign: "center",
          fontSize: "13.5px",
          color: "#581c87",
          borderBottom: "1px solid rgba(123, 44, 191, 0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
          flexWrap: "wrap"
        }}>
          <span>Browsing as Guest Shopper. Ready to create an account or switch to Seller / Admin?</span>
          <button
            type="button"
            onClick={() => setGuestMode(false)}
            style={{
              background: "#7b2cbf",
              color: "#ffffff",
              border: "none",
              padding: "4px 12px",
              borderRadius: "8px",
              fontWeight: "800",
              fontSize: "12px",
              cursor: "pointer"
            }}
          >
            ← Open Role Portal
          </button>
        </div>

        <Hero />
        <Brands />
        <GiftFinder />
        <TrendingGifts />
        <HowItWorks />
        <Features />
        <Corporate />
        <FAQ />
        <Footer />
      </main>
    );
  }

  // 3. FIRST SCREEN WHEN VISITING THE APP: The 3-Role Gateway (User, Seller, Admin)
  return (
    <main>
      <RoleGateway onGuestExplore={() => setGuestMode(true)} />
    </main>
  );
}
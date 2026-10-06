"use client";

import { useRouter } from "next/navigation";
import "./Footer.css";

export default function Footer() {
  const router = useRouter();

  const openSellerSignup = () => {
    router.push("/signup");
  };

  return (
    <footer className="footer">
      <div className="footer-cta">
        <span className="partner-badge">
          GiftGenie for Sellers
        </span>

        <h2>Become a GiftGenie Partner</h2>

        <p>
          Showcase your products to customers searching for meaningful
          gifts through our AI-powered recommendations.
        </p>

        <div className="partner-benefits">
          <span>✓ AI-powered discovery</span>
          <span>✓ Reach more customers</span>
          <span>✓ Grow your business</span>
        </div>

        <button
          type="button"
          onClick={openSellerSignup}
        >
          Start Selling
          <span aria-hidden="true">→</span>
        </button>
      </div>

      <div className="footer-main">
        <div>
          <h3>🎁 GiftGenie</h3>

          <p>
            AI-powered gifting intelligence platform for individuals and
            companies.
          </p>
        </div>

        <div>
          <h4>Company</h4>
          <p>About</p>
          <p>Careers</p>
          <p>Contact</p>
        </div>

        <div>
          <h4>Product</h4>
          <p>Gift Finder</p>
          <p>Corporate</p>
          <p>Pricing</p>
        </div>

        <div>
          <h4>Legal</h4>
          <p>Privacy</p>
          <p>Terms</p>
          <p>Security</p>
        </div>
      </div>

      <div className="footer-bottom">
        © 2026 GiftGenie AI. All rights reserved.
      </div>
    </footer>
  );
}
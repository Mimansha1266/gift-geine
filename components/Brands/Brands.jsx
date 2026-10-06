
"use client";

import Image from "next/image";
import "./Brands.css";

const partners = [
  { name: "Amazon", logo: "/logos/amazon.svg" },
  { name: "Flipkart", logo: "/logos/flipkart.svg" },
  { name: "Myntra", logo: "/logos/myntra.svg" },
  { name: "AJIO", logo: "/logos/ajio.svg" },
  { name: "Nykaa", logo: "/logos/nykaa.svg" },
  
  { name: "Zomato", logo: "/logos/zomato.svg" },
  { name: "Swiggy", logo: "/logos/swiggy.svg" },
];

export default function Brands() {
  return (
    <section className="brands-section">
      <div className="brands-header">
        <span>🛍 Popular Shopping & Gifting Platforms</span>
        <h2>Explore Gifts from Popular Brands</h2>
        <p>
          GiftGenie helps users discover thoughtful gifts available across
          popular shopping, gifting and food platforms.
        </p>
      </div>

      <div className="brands-grid">
        {partners.map((partner) => (
          <div className="brand-card" key={partner.name}>
            <Image
              src={partner.logo}
              alt={partner.name}
              width={120}
              height={50}
              className="brand-logo"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
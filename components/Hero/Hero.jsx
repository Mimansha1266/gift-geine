"use client";

import { stats } from "../../data/gifts";
import "./Hero.css";

export default function Hero() {
  const openGiftFinder = () => {
    const giftFinder = document.getElementById("gift-finder-view");

    if (!giftFinder) return;

    giftFinder.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    window.history.replaceState(
      null,
      "",
      window.location.pathname + window.location.search
    );
  };

  return (
    <section className="hero-section" id="home">
      <div className="hero-left">
        <div className="section-badge">
          <span>✨</span>
          <span>AI Powered Gifting</span>
        </div>

        <h1>
          Find the Perfect Gift for <span>Every Occasion</span>
        </h1>

        <p>
          GiftGenie helps you discover thoughtful, personalised gifts using AI,
          so every gift feels special, timely and meaningful.
        </p>

        <div className="hero-buttons">
          <button
            type="button"
            className="primary-btn"
            onClick={openGiftFinder}
          >
            Generate AI Gifts ✨
          </button>
        </div>

        <div className="hero-stats">
          {stats.map((item) => (
            <div className="stat-card" key={item.label}>
              <h3>{item.value}</h3>
              <p>{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="hero-right">
        <img
          src="/images/robot.png"
          alt="GiftGenie AI Robot with gifts"
          className="hero-robot-image"
          width={650}
          height={650}
          loading="eager"
          fetchPriority="high"
        />
      </div>
    </section>
  );
}
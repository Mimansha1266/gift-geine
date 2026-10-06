
import "./Features.css";

export default function Features() {
  const features = [
    ["Fast AI Suggestions", "Gift ideas in seconds, not hours.", "⚡"],
    ["Personalised Matching", "Recommendations based on relationship and interests.", "🧠"],
    ["Wishlist & Save", "Users can save gifts for later.", "💜"],
    ["Privacy First", "User preferences stay protected.", "🛡️"],
    ["Corporate Gifting", "Bulk gifting workflows for teams.", "💼"],
    ["Smart Analytics", "Track gifting campaigns and spending.", "📈"],
  ];

  return (
    <section className="features-section" id="features">
      <div className="section-badge">
        <span>⭐</span>
        <span>Why GiftGenie?</span>
      </div>

      <h2>Built for Smart, Personal and Fast Gifting</h2>

      <div className="features-grid">
        {features.map(([title, text, icon]) => (
          <div className="feature-card" key={title}>
            <div className="feature-icon">{icon}</div>
            <h3>{title}</h3>
            <p>{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
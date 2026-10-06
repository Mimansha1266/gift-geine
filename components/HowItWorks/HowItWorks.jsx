
import "./HowItWorks.css";

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      icon: "👥",
      title: "Tell us about recipient",
      description:
        "Choose relationship, occasion, budget, interests and personality.",
    },
    {
      number: "02",
      icon: "✨",
      title: "AI understands context",
      description:
        "GiftGenie analyzes emotional fit, urgency, budget and preferences.",
    },
    {
      number: "03",
      icon: "🎁",
      title: "Get curated gifts",
      description:
        "Receive personalised gift recommendations with clear reasons.",
    },
    {
      number: "04",
      icon: "🛍️",
      title: "Save or Buy",
      description:
        "Wishlist the gift or continue to partner platforms for purchase.",
    },
  ];

  return (
    <section className="how-section" id="how-it-works">
      <div className="section-badge">
  <span>⚙️</span>
  <span>How It Works</span>
</div>
      <h1>From Confusion to Perfect Gift</h1>

      <p className="how-subtitle">
        GiftGenie turns a difficult gifting decision into a simple AI-guided
        journey.
      </p>

      <div className="how-grid">
        {steps.map((step) => (
          <div className="how-card" key={step.number}>
            <span className="step-number">{step.number}</span>

            <div className="step-icon">{step.icon}</div>

            <h3>{step.title}</h3>

            <p>{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
"use client";

import { useState } from "react";
import "./FAQ.css";

const faqs = [
  ["How does GiftGenie work?", "It uses relationship, occasion, budget, interests and personality to suggest relevant gifts."],
  ["Is this connected to real stores?", "The frontend currently uses demo data. Later it can connect to Amazon, Flipkart and vendor APIs."],
  ["Can companies use it?", "Yes, the platform includes corporate gifting automation for HR and business teams."],
  ["Is it responsive?", "Yes, the layout is designed for desktop, tablet and mobile screens."],
];

export default function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section className="faq-section" id="faq">
      <div className="section-heading">
        <div className="section-badge">
          <span>❓</span>
          <span>FAQ</span>
        </div>
        <h2>Frequently Asked Questions</h2>
      </div>

      <div className="faq-list">
        {faqs.map(([q, a], index) => (
          <div className="faq-item" key={q}>
            <button onClick={() => setOpen(open === index ? null : index)}>
              {q}
              <span>{open === index ? "−" : "+"}</span>
            </button>
            {open === index && <p>{a}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
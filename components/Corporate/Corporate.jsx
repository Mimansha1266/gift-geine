
"use client";

import { useState } from "react";
import "./Corporate.css";

export default function Corporate() {
  const [open, setOpen] = useState(false);

  const submitForm = (e) => {
    e.preventDefault();

    alert("🎉 Demo Request Submitted Successfully!\n\nOur corporate team will contact you shortly.");

    setOpen(false);
  };

  return (
    <>
      <section className="corporate-section" id="corporate">
        <div className="corporate-left">

          <span className="section-badge">
            🏢 Corporate Gifting
          </span>

          <h2>Automated Bulk Gifting Dashboard</h2>

          <p>
            Manage CSV uploads, AI recommendations, budgets,
            approvals, delivery tracking and recurring campaigns
            from one dashboard.
          </p>

          <ul>
            <li>✔ Bulk recipient upload via CSV</li>
            <li>✔ AI-generated gift suggestions</li>
            <li>✔ Budget control</li>
            <li>✔ Approval workflow</li>
            <li>✔ Delivery tracking</li>
            <li>✔ Analytics dashboard</li>
          </ul>

          <button
            className="corporate-btn"
            onClick={() => setOpen(true)}
          >
            Request Corporate Demo
          </button>

        </div>

        <div className="corporate-right">

          <div className="dashboard-card">

            <h3>Campaign Dashboard</h3>

            <span className="live-tag">Live</span>

            <div className="budget-card">
              <p>Diwali Employee Gifts</p>

              <h2>₹4,50,000 Budget</h2>

              <div className="progress">
                <div className="progress-fill"></div>
              </div>
            </div>

            <div className="dashboard-grid">

              <div>
                <h2>240</h2>
                <span>Recipients</span>
              </div>

              <div>
                <h2>96%</h2>
                <span>Approved</span>
              </div>

              <div>
                <h2>18</h2>
                <span>Vendors</span>
              </div>

              <div>
                <h2>4.8</h2>
                <span>Rating</span>
              </div>

            </div>

          </div>

        </div>
      </section>

      {open && (

        <div className="modal-overlay">

          <div className="corporate-modal">

            <button
              className="close-btn"
              onClick={() => setOpen(false)}
            >
              ✕
            </button>

            <h2>Corporate Demo Request</h2>

            <p>
              Fill in your details and our team will contact you.
            </p>

            <form onSubmit={submitForm}>

              <input
                type="text"
                placeholder="Company Name"
                required
              />

              <input
                type="text"
                placeholder="Contact Person"
                required
              />

              <input
                type="email"
                placeholder="Business Email"
                required
              />

              <input
                type="tel"
                placeholder="Phone Number"
                required
              />

              <input
                type="number"
                placeholder="Number of Employees"
              />

              <select required>
                <option value="">
                  Annual Gifting Budget
                </option>

                <option>₹50,000 - ₹2 Lakhs</option>
                <option>₹2 - ₹10 Lakhs</option>
                <option>₹10 - ₹50 Lakhs</option>
                <option>₹50 Lakhs+</option>

              </select>

              <textarea
                rows="4"
                placeholder="Tell us about your gifting requirements..."
              ></textarea>

              <button
                type="submit"
                className="submit-demo-btn"
              >
                Submit Demo Request
              </button>

            </form>

          </div>

        </div>

      )}
    </>
  );
}
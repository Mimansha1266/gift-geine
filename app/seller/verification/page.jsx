"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./verification.css";

const emptyBusinessData = {
  businessName: "",
  ownerName: "",
  businessType: "",
  productCategory: "",
  email: "",
  phone: "",
  gstNumber: "",
  panNumber: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  pinCode: "",
  logoName: "",
  logoPreview: "",
};

export default function SellerVerificationPage() {
  const router = useRouter();

  const [businessData, setBusinessData] =
    useState(emptyBusinessData);

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [confirmedAccuracy, setConfirmedAccuracy] =
    useState(false);

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const savedBusinessData = sessionStorage.getItem(
        "giftgenieSellerBusinessData"
      );

      if (!savedBusinessData) {
        router.replace("/seller/business-details");
        return;
      }

      const parsedBusinessData = JSON.parse(savedBusinessData);

      setBusinessData({
        ...emptyBusinessData,
        ...parsedBusinessData,
      });
    } catch (storageError) {
      console.error(
        "Unable to load seller business details:",
        storageError
      );

      router.replace("/seller/business-details");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const handleFinalSubmit = async () => {
    setError("");

    if (!acceptedTerms || !confirmedAccuracy) {
      setError(
        "Please accept both confirmations before submitting your seller application."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      /*
        SQL backend connect hone ke baad yahan final API call hogi:

        const response = await fetch("/api/seller/business-details", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(businessData),
        });

        if (!response.ok) {
          throw new Error("Unable to submit seller application.");
        }
      */

      console.log(
        "Final seller application submitted:",
        businessData
      );

      await new Promise((resolve) => setTimeout(resolve, 900));

      sessionStorage.removeItem(
        "giftgenieSellerBusinessData"
      );

      router.push("/seller/business-success");
    } catch (submitError) {
      console.error(submitError);

      setError(
        "Unable to submit your seller application right now. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const maskPanNumber = (panNumber) => {
    if (!panNumber) {
      return "Not provided";
    }

    return `${panNumber.slice(0, 3)}****${panNumber.slice(-3)}`;
  };

  const maskGstNumber = (gstNumber) => {
    if (!gstNumber) {
      return "Not provided";
    }

    return `${gstNumber.slice(0, 4)}*******${gstNumber.slice(-4)}`;
  };

  const formatPhoneNumber = (phone) => {
    if (!phone) {
      return "Not provided";
    }

    return `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`;
  };

  if (isLoading) {
    return (
      <main className="verification-loading-page">
        <div className="verification-loader"></div>
        <p>Loading seller details...</p>
      </main>
    );
  }

  return (
    <main className="seller-verification-page">
      <section className="verification-shell">
        <aside className="verification-sidebar">
          <button
            type="button"
            className="verification-logo"
            onClick={() => router.push("/")}
          >
            <span>🎁</span>
            GiftGenie
          </button>

          <div className="verification-badge">
            Seller onboarding
          </div>

          <h1>
            Review and
            <span>verify your details.</span>
          </h1>

          <p className="verification-sidebar-description">
            Check your business information carefully before
            submitting your seller application.
          </p>

          <div className="verification-progress">
            <article className="verification-progress-step completed">
              <div className="verification-progress-number">✓</div>

              <div>
                <h3>Seller account</h3>
                <p>Account information completed</p>
              </div>
            </article>

            <div className="verification-progress-line completed"></div>

            <article className="verification-progress-step completed">
              <div className="verification-progress-number">✓</div>

              <div>
                <h3>Business details</h3>
                <p>Business information completed</p>
              </div>
            </article>

            <div className="verification-progress-line completed"></div>

            <article className="verification-progress-step active">
              <div className="verification-progress-number">3</div>

              <div>
                <h3>Verification</h3>
                <p>Review and submit your application</p>
              </div>
            </article>
          </div>

          <div className="verification-help-card">
            <span>🔒</span>

            <div>
              <h3>Your information is protected</h3>

              <p>
                Business details are used only for seller
                verification and order fulfilment.
              </p>
            </div>
          </div>
        </aside>

        <section className="verification-content-card">
          <header className="verification-header">
            <div>
              <p className="verification-step-label">
                Step 3 of 3
              </p>

              <h2>Verify your information</h2>

              <p>
                Make sure all information is correct before final
                submission.
              </p>
            </div>

            <div className="verification-secure-badge">
              <span>🔒</span>
              Secure review
            </div>
          </header>

          <section className="verification-summary-section">
            <div className="verification-section-header">
              <div className="verification-section-title">
                <span>01</span>

                <div>
                  <h3>Business information</h3>
                  <p>Seller and business profile details</p>
                </div>
              </div>

              <button
                type="button"
                className="verification-edit-button"
                onClick={() =>
                  router.push("/seller/business-details")
                }
              >
                ✏️ Edit
              </button>
            </div>

            <div className="verification-details-grid">
              <article className="verification-detail-item">
                <p>Business name</p>
                <h4>{businessData.businessName}</h4>
              </article>

              <article className="verification-detail-item">
                <p>Owner or representative</p>
                <h4>{businessData.ownerName}</h4>
              </article>

              <article className="verification-detail-item">
                <p>Business type</p>
                <h4>{businessData.businessType}</h4>
              </article>

              <article className="verification-detail-item">
                <p>Primary product category</p>
                <h4>{businessData.productCategory}</h4>
              </article>
            </div>
          </section>

          <section className="verification-summary-section">
            <div className="verification-section-header">
              <div className="verification-section-title">
                <span>02</span>

                <div>
                  <h3>Contact and tax information</h3>
                  <p>Communication and verification details</p>
                </div>
              </div>

              <button
                type="button"
                className="verification-edit-button"
                onClick={() =>
                  router.push("/seller/business-details")
                }
              >
                ✏️ Edit
              </button>
            </div>

            <div className="verification-details-grid">
              <article className="verification-detail-item">
                <p>Business email</p>
                <h4>{businessData.email}</h4>
              </article>

              <article className="verification-detail-item">
                <p>Phone number</p>
                <h4>{formatPhoneNumber(businessData.phone)}</h4>
              </article>

              <article className="verification-detail-item">
                <p>GST number</p>
                <h4>{maskGstNumber(businessData.gstNumber)}</h4>
              </article>

              <article className="verification-detail-item">
                <p>PAN number</p>
                <h4>{maskPanNumber(businessData.panNumber)}</h4>
              </article>
            </div>
          </section>

          <section className="verification-summary-section">
            <div className="verification-section-header">
              <div className="verification-section-title">
                <span>03</span>

                <div>
                  <h3>Pickup address</h3>
                  <p>Address used for product collection</p>
                </div>
              </div>

              <button
                type="button"
                className="verification-edit-button"
                onClick={() =>
                  router.push("/seller/business-details")
                }
              >
                ✏️ Edit
              </button>
            </div>

            <div className="verification-address-card">
              <span className="verification-address-icon">📍</span>

              <div>
                <h4>{businessData.businessName}</h4>

                <p>{businessData.addressLine1}</p>

                {businessData.addressLine2 && (
                  <p>{businessData.addressLine2}</p>
                )}

                <p>
                  {businessData.city}, {businessData.state} -{" "}
                  {businessData.pinCode}
                </p>

                <p>{formatPhoneNumber(businessData.phone)}</p>
              </div>
            </div>
          </section>

          <section className="verification-summary-section">
            <div className="verification-section-header">
              <div className="verification-section-title">
                <span>04</span>

                <div>
                  <h3>Business logo</h3>
                  <p>Seller profile branding</p>
                </div>
              </div>

              <button
                type="button"
                className="verification-edit-button"
                onClick={() =>
                  router.push("/seller/business-details")
                }
              >
                ✏️ Edit
              </button>
            </div>

            <div className="verification-logo-card">
              <div className="verification-logo-preview">
                {businessData.logoPreview ? (
                  <img
                    src={businessData.logoPreview}
                    alt="Business logo"
                  />
                ) : (
                  <span>🏪</span>
                )}
              </div>

              <div>
                <h4>
                  {businessData.logoName || "No logo uploaded"}
                </h4>

                <p>
                  {businessData.logoName
                    ? "This logo will appear on your seller profile."
                    : "You can add a logo later from your seller dashboard."}
                </p>
              </div>
            </div>
          </section>

          <section className="verification-confirmation-section">
            <h3>Final confirmation</h3>

            <p>
              Please confirm both statements before submitting your
              application.
            </p>

            <label className="verification-checkbox-row">
              <input
                type="checkbox"
                checked={confirmedAccuracy}
                onChange={(event) => {
                  setConfirmedAccuracy(event.target.checked);
                  setError("");
                }}
              />

              <span>
                I confirm that the information provided is complete,
                accurate and belongs to my business.
              </span>
            </label>

            <label className="verification-checkbox-row">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(event) => {
                  setAcceptedTerms(event.target.checked);
                  setError("");
                }}
              />

              <span>
                I agree to the GiftGenie Seller Terms, Privacy Policy
                and marketplace guidelines.
              </span>
            </label>

            {error && (
              <div className="verification-error-message">
                {error}
              </div>
            )}
          </section>

          <div className="verification-actions">
            <button
              type="button"
              className="verification-back-button"
              onClick={() =>
                router.push("/seller/business-details")
              }
            >
              <span>←</span>
              Back to details
            </button>

            <button
              type="button"
              className="verification-submit-button"
              disabled={isSubmitting}
              onClick={handleFinalSubmit}
            >
              {isSubmitting
                ? "Submitting application..."
                : "Submit seller application"}

              {!isSubmitting && <span>→</span>}
            </button>
          </div>

          <p className="verification-privacy-note">
            🔒 Your information will be securely submitted for seller
            verification.
          </p>
        </section>
      </section>
    </main>
  );
}
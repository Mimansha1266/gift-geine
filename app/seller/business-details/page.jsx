"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import "./business-details.css";

const initialFormData = {
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
};

export default function BusinessDetailsPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState(initialFormData);
  const [businessLogo, setBusinessLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    let updatedValue = value;

    if (name === "phone" || name === "pinCode") {
      updatedValue = value.replace(/\D/g, "");
    }

    if (name === "panNumber" || name === "gstNumber") {
      updatedValue = value.toUpperCase();
    }

    setFormData((previousData) => ({
      ...previousData,
      [name]: updatedValue,
    }));

    if (errors[name]) {
      setErrors((previousErrors) => ({
        ...previousErrors,
        [name]: "",
      }));
    }
  };

  const handleLogoChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const maximumFileSize = 2 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      setErrors((previousErrors) => ({
        ...previousErrors,
        businessLogo: "Please upload a JPG, PNG or WEBP image.",
      }));
      return;
    }

    if (file.size > maximumFileSize) {
      setErrors((previousErrors) => ({
        ...previousErrors,
        businessLogo: "Logo size must be less than 2 MB.",
      }));
      return;
    }

    setBusinessLogo(file);
    setLogoPreview(URL.createObjectURL(file));

    setErrors((previousErrors) => ({
      ...previousErrors,
      businessLogo: "",
    }));
  };

  const removeLogo = () => {
    setBusinessLogo(null);
    setLogoPreview("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.businessName.trim()) {
      newErrors.businessName = "Business name is required.";
    }

    if (!formData.ownerName.trim()) {
      newErrors.ownerName = "Owner name is required.";
    }

    if (!formData.businessType) {
      newErrors.businessType = "Please select a business type.";
    }

    if (!formData.productCategory) {
      newErrors.productCategory = "Please select a product category.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Business email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
    ) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = "Enter a valid 10-digit Indian phone number.";
    }

    if (
      formData.gstNumber &&
      !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(
        formData.gstNumber
      )
    ) {
      newErrors.gstNumber = "Enter a valid GST number.";
    }

    if (!formData.panNumber.trim()) {
      newErrors.panNumber = "PAN number is required.";
    } else if (
      !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(formData.panNumber)
    ) {
      newErrors.panNumber = "Enter a valid PAN number, for example ABCDE1234F.";
    }

    if (!formData.addressLine1.trim()) {
      newErrors.addressLine1 = "Pickup address is required.";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required.";
    }

    if (!formData.state) {
      newErrors.state = "Please select a state.";
    }

    if (!formData.pinCode.trim()) {
      newErrors.pinCode = "PIN code is required.";
    } else if (!/^[1-9][0-9]{5}$/.test(formData.pinCode)) {
      newErrors.pinCode = "Enter a valid 6-digit PIN code.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const isFormValid = validateForm();

    if (!isFormValid) {
      const firstErrorField = document.querySelector(
        ".business-form-error"
      );

      firstErrorField?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      return;
    }

    setIsSubmitting(true);

    try {
      const sellerBusinessData = {
  ...formData,
  logoName: businessLogo?.name || "",
  logoPreview: logoPreview || "",
};

sessionStorage.setItem(
  "giftgenieSellerBusinessData",
  JSON.stringify(sellerBusinessData)
);

console.log("Seller business details:", sellerBusinessData);

      /*
        SQL backend connect hone ke baad yahan API call hogi:

        const response = await fetch("/api/seller/business-details", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(sellerBusinessData),
        });

        if (!response.ok) {
          throw new Error("Unable to save business details.");
        }
      */

      await new Promise((resolve) => setTimeout(resolve, 800));

      router.push("/seller/verification");
    } catch (error) {
      console.error(error);

      setErrors((previousErrors) => ({
        ...previousErrors,
        submit:
          "Unable to save your details right now. Please try again.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="business-details-page">
      <section className="business-details-shell">
        <aside className="business-details-sidebar">
          <button
            type="button"
            className="business-logo-button"
            onClick={() => router.push("/")}
          >
            <span>🎁</span>
            GiftGenie
          </button>

          <div className="seller-onboarding-badge">
            Seller onboarding
          </div>

          <h1>
            Tell us about
            <span>your business.</span>
          </h1>

          <p className="business-sidebar-description">
            Complete your seller profile to start showcasing your
            products to GiftGenie customers.
          </p>

          <div className="onboarding-progress">
            <article className="progress-step completed">
              <div className="progress-number">✓</div>

              <div>
                <h3>Seller account</h3>
                <p>Account information completed</p>
              </div>
            </article>

            <div className="progress-line active"></div>

            <article className="progress-step active">
              <div className="progress-number">2</div>

              <div>
                <h3>Business details</h3>
                <p>Add your company and pickup information</p>
              </div>
            </article>

            <div className="progress-line"></div>

            <article className="progress-step">
              <div className="progress-number">3</div>

              <div>
                <h3>Verification</h3>
                <p>Review and submit your seller profile</p>
              </div>
            </article>
          </div>

          <div className="seller-support-card">
            <span>💬</span>

            <div>
              <h3>Need help?</h3>
              <p>
                Our seller support team will help you complete your
                onboarding.
              </p>
            </div>
          </div>
        </aside>

        <section className="business-form-card">
          <div className="business-form-header">
            <div>
              <p className="form-step-label">Step 2 of 3</p>
              <h2>Business details</h2>
              <p>
                Enter the information that will be used for your
                GiftGenie seller profile.
              </p>
            </div>

            <div className="secure-business-badge">
              <span>🔒</span>
              Secure
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {errors.submit && (
              <div className="business-submit-error">
                {errors.submit}
              </div>
            )}

            <div className="business-form-section">
              <div className="section-heading">
                <span>01</span>

                <div>
                  <h3>Business information</h3>
                  <p>Basic details about your business</p>
                </div>
              </div>

              <div className="business-form-grid">
                <div className="business-form-group full-width">
                  <label htmlFor="businessName">
                    Business name <span>*</span>
                  </label>

                  <input
                    id="businessName"
                    name="businessName"
                    type="text"
                    value={formData.businessName}
                    onChange={handleChange}
                    placeholder="Enter your registered business name"
                    className={
                      errors.businessName ? "input-error" : ""
                    }
                  />

                  {errors.businessName && (
                    <p className="business-form-error">
                      {errors.businessName}
                    </p>
                  )}
                </div>

                <div className="business-form-group">
                  <label htmlFor="ownerName">
                    Owner or representative name <span>*</span>
                  </label>

                  <input
                    id="ownerName"
                    name="ownerName"
                    type="text"
                    value={formData.ownerName}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    className={errors.ownerName ? "input-error" : ""}
                  />

                  {errors.ownerName && (
                    <p className="business-form-error">
                      {errors.ownerName}
                    </p>
                  )}
                </div>

                <div className="business-form-group">
                  <label htmlFor="businessType">
                    Business type <span>*</span>
                  </label>

                  <select
                    id="businessType"
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleChange}
                    className={
                      errors.businessType ? "input-error" : ""
                    }
                  >
                    <option value="">Select business type</option>
                    <option value="Individual seller">
                      Individual seller
                    </option>
                    <option value="Sole proprietorship">
                      Sole proprietorship
                    </option>
                    <option value="Partnership">Partnership</option>
                    <option value="Private limited company">
                      Private limited company
                    </option>
                    <option value="Limited liability partnership">
                      Limited liability partnership
                    </option>
                    <option value="Other">Other</option>
                  </select>

                  {errors.businessType && (
                    <p className="business-form-error">
                      {errors.businessType}
                    </p>
                  )}
                </div>

                <div className="business-form-group full-width">
                  <label htmlFor="productCategory">
                    Primary product category <span>*</span>
                  </label>

                  <select
                    id="productCategory"
                    name="productCategory"
                    value={formData.productCategory}
                    onChange={handleChange}
                    className={
                      errors.productCategory ? "input-error" : ""
                    }
                  >
                    <option value="">Select product category</option>
                    <option value="Personalized gifts">
                      Personalized gifts
                    </option>
                    <option value="Fashion and accessories">
                      Fashion and accessories
                    </option>
                    <option value="Beauty and wellness">
                      Beauty and wellness
                    </option>
                    <option value="Home and living">
                      Home and living
                    </option>
                    <option value="Electronics">
                      Electronics
                    </option>
                    <option value="Books and stationery">
                      Books and stationery
                    </option>
                    <option value="Food and hampers">
                      Food and hampers
                    </option>
                    <option value="Toys and games">
                      Toys and games
                    </option>
                    <option value="Other">Other</option>
                  </select>

                  {errors.productCategory && (
                    <p className="business-form-error">
                      {errors.productCategory}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="business-form-section">
              <div className="section-heading">
                <span>02</span>

                <div>
                  <h3>Contact and tax information</h3>
                  <p>Information used for communication and verification</p>
                </div>
              </div>

              <div className="business-form-grid">
                <div className="business-form-group">
                  <label htmlFor="email">
                    Business email <span>*</span>
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="business@example.com"
                    className={errors.email ? "input-error" : ""}
                  />

                  {errors.email && (
                    <p className="business-form-error">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="business-form-group">
                  <label htmlFor="phone">
                    Phone number <span>*</span>
                  </label>

                  <div className="phone-input-wrapper">
                    <span>+91</span>

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="9876543210"
                      className={errors.phone ? "input-error" : ""}
                    />
                  </div>

                  {errors.phone && (
                    <p className="business-form-error">
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div className="business-form-group">
                  <label htmlFor="gstNumber">
                    GST number
                    <small>Optional</small>
                  </label>

                  <input
                    id="gstNumber"
                    name="gstNumber"
                    type="text"
                    maxLength={15}
                    value={formData.gstNumber}
                    onChange={handleChange}
                    placeholder="22ABCDE1234F1Z5"
                    className={errors.gstNumber ? "input-error" : ""}
                  />

                  {errors.gstNumber && (
                    <p className="business-form-error">
                      {errors.gstNumber}
                    </p>
                  )}
                </div>

                <div className="business-form-group">
                  <label htmlFor="panNumber">
                    PAN number <span>*</span>
                  </label>

                  <input
                    id="panNumber"
                    name="panNumber"
                    type="text"
                    maxLength={10}
                    value={formData.panNumber}
                    onChange={handleChange}
                    placeholder="ABCDE1234F"
                    className={
                      errors.panNumber ? "input-error" : ""
                    }
                  />

                  {errors.panNumber && (
                    <p className="business-form-error">
                      {errors.panNumber}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="business-form-section">
              <div className="section-heading">
                <span>03</span>

                <div>
                  <h3>Pickup address</h3>
                  <p>Where your products will be collected from</p>
                </div>
              </div>

              <div className="business-form-grid">
                <div className="business-form-group full-width">
                  <label htmlFor="addressLine1">
                    Address line 1 <span>*</span>
                  </label>

                  <input
                    id="addressLine1"
                    name="addressLine1"
                    type="text"
                    value={formData.addressLine1}
                    onChange={handleChange}
                    placeholder="House number, building, street or area"
                    className={
                      errors.addressLine1 ? "input-error" : ""
                    }
                  />

                  {errors.addressLine1 && (
                    <p className="business-form-error">
                      {errors.addressLine1}
                    </p>
                  )}
                </div>

                <div className="business-form-group full-width">
                  <label htmlFor="addressLine2">
                    Address line 2
                    <small>Optional</small>
                  </label>

                  <input
                    id="addressLine2"
                    name="addressLine2"
                    type="text"
                    value={formData.addressLine2}
                    onChange={handleChange}
                    placeholder="Landmark or additional address information"
                  />
                </div>

                <div className="business-form-group">
                  <label htmlFor="city">
                    City <span>*</span>
                  </label>

                  <input
                    id="city"
                    name="city"
                    type="text"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter city"
                    className={errors.city ? "input-error" : ""}
                  />

                  {errors.city && (
                    <p className="business-form-error">
                      {errors.city}
                    </p>
                  )}
                </div>

                <div className="business-form-group">
                  <label htmlFor="state">
                    State <span>*</span>
                  </label>

                  <select
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className={errors.state ? "input-error" : ""}
                  >
                    <option value="">Select state</option>
                    <option value="Andhra Pradesh">
                      Andhra Pradesh
                    </option>
                    <option value="Arunachal Pradesh">
                      Arunachal Pradesh
                    </option>
                    <option value="Assam">Assam</option>
                    <option value="Bihar">Bihar</option>
                    <option value="Chhattisgarh">
                      Chhattisgarh
                    </option>
                    <option value="Delhi">Delhi</option>
                    <option value="Goa">Goa</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Haryana">Haryana</option>
                    <option value="Himachal Pradesh">
                      Himachal Pradesh
                    </option>
                    <option value="Jharkhand">Jharkhand</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Kerala">Kerala</option>
                    <option value="Madhya Pradesh">
                      Madhya Pradesh
                    </option>
                    <option value="Maharashtra">
                      Maharashtra
                    </option>
                    <option value="Manipur">Manipur</option>
                    <option value="Meghalaya">Meghalaya</option>
                    <option value="Mizoram">Mizoram</option>
                    <option value="Nagaland">Nagaland</option>
                    <option value="Odisha">Odisha</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Telangana">Telangana</option>
                    <option value="Uttar Pradesh">
                      Uttar Pradesh
                    </option>
                    <option value="Uttarakhand">
                      Uttarakhand
                    </option>
                    <option value="West Bengal">
                      West Bengal
                    </option>
                  </select>

                  {errors.state && (
                    <p className="business-form-error">
                      {errors.state}
                    </p>
                  )}
                </div>

                <div className="business-form-group">
                  <label htmlFor="pinCode">
                    PIN code <span>*</span>
                  </label>

                  <input
                    id="pinCode"
                    name="pinCode"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={formData.pinCode}
                    onChange={handleChange}
                    placeholder="201301"
                    className={errors.pinCode ? "input-error" : ""}
                  />

                  {errors.pinCode && (
                    <p className="business-form-error">
                      {errors.pinCode}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="business-form-section">
              <div className="section-heading">
                <span>04</span>

                <div>
                  <h3>Business logo</h3>
                  <p>Add a logo to make your seller profile recognizable</p>
                </div>
              </div>

              <div className="business-logo-upload">
                <div className="logo-preview-box">
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Business logo preview"
                    />
                  ) : (
                    <span>🏪</span>
                  )}
                </div>

                <div className="logo-upload-content">
                  <h4>Upload business logo</h4>
                  <p>JPG, PNG or WEBP. Maximum size 2 MB.</p>

                  <div className="logo-upload-actions">
                    <button
                      type="button"
                      className="upload-logo-button"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Choose image
                    </button>

                    {logoPreview && (
                      <button
                        type="button"
                        className="remove-logo-button"
                        onClick={removeLogo}
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleLogoChange}
                    hidden
                  />

                  {errors.businessLogo && (
                    <p className="business-form-error">
                      {errors.businessLogo}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="business-form-actions">
              <button
                type="button"
                className="business-back-button"
                onClick={() => router.push("/seller/signup")}
              >
                <span>←</span>
                Back
              </button>

              <button
                type="submit"
                className="business-continue-button"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Saving details..."
                  : "Continue to verification"}

                {!isSubmitting && <span>→</span>}
              </button>
            </div>

            <p className="business-privacy-text">
              🔒 Your information is encrypted and used only for seller
              verification and order fulfilment.
            </p>
          </form>
        </section>
      </section>
    </main>
  );
}
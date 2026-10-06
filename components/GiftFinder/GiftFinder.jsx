
"use client";

import { useEffect, useRef, useState } from "react";
import { giftSteps, smartModes } from "../../data/gifts";
import "./GiftFinder.css";




const initialProfile = {
  for: [],
  occasion: [],
  budget: [],
  interests: [],
  personality: [],
  smartMode: [],
  
};

function getPlaceholder(key) {
  const placeholders = {
    for: "Example: My sister, teacher or client — press Enter",
    occasion: "Example: Graduation or promotion — press Enter",
    budget: "Example: Around ₹2,500 — press Enter",
    interests: "Example: Harry Potter, coffee and painting — press Enter",
    personality: "Example: Calm, creative and minimalist — press Enter",
    smartMode: "Type your preferred gifting style — press Enter",
  };

  return placeholders[key] || "Type your answer and press Enter";
}

export default function GiftFinder() {
  const chatEndRef = useRef(null);
  
  const resultsRef = useRef(null);
  const timerRef = useRef(null);

  const conversationSteps = [
  ...giftSteps.map((item) => ({
    ...item,
    allowMultiple: item.key === "interests",
    placeholder: getPlaceholder(item.key),
  })),
  {
    question: "Choose your Smart Mode",
    key: "smartMode",
    options: smartModes.map((mode) => mode.title),
    allowMultiple: false,
    placeholder: getPlaceholder("smartMode"),
  },
];


  const [currentStep, setCurrentStep] = useState(0);
  const [typedAnswer, setTypedAnswer] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Hi! I’m GiftGenie AI 👋 I’ll help you find the perfect gift.",
    },
    {
      id: 2,
      sender: "bot",
      text: conversationSteps[0].question,
    },
  ]);

  const [profile, setProfile] = useState(initialProfile);
  const [isThinking, setIsThinking] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [savedGifts, setSavedGifts] = useState([]);
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [recommendationError, setRecommendationError] = useState("");
  const [toast, setToast] = useState(null);

  const activeStep = conversationSteps[currentStep];

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 6000);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [messages, isThinking, showResults, currentStep]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);
  useEffect(() => {
  if (!showResults || aiRecommendations.length === 0) {
    return;
  }

  const scrollTimer = setTimeout(() => {
    resultsRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, 400);

  return () => clearTimeout(scrollTimer);
}, [showResults, aiRecommendations.length]);
  

  const getBotResponse = (key, values) => {
    const firstValue = values[0];

    const replies = {
      for: `Great! I’ll find something special for ${firstValue}.`,

      occasion: `${firstValue} sounds exciting! Now let’s choose the right budget.`,

      budget: `Perfect. I’ll keep the recommendations within ${firstValue}.`,

      interests: `Nice choices! ${values.join(
        ", "
      )} will help me personalise the recommendations.`,

      personality: `Got it. I’ll look for gifts that match a ${firstValue} personality.`,

      smartMode: `${firstValue} selected. I only need one final detail.`,

      
    };

    return replies[key] || "Perfect! I’ve noted that.";
  };
  
  
  const fetchAIRecommendations = async (profileData) => {
    const response = await fetch("/api/recommendations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recipient: profileData.for?.join(", ") || "Not specified",
        occasion: profileData.occasion?.join(", ") || "Not specified",
        budget: profileData.budget?.join(", ") || "Not specified",
        interests: profileData.interests?.join(", ") || "Not specified",
        personality:
          profileData.personality?.join(", ") || "Not specified",
        smartMode: profileData.smartMode?.join(", ") || "Smart Pick",
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data.message || "Unable to generate AI recommendations."
      );
    }

    if (!Array.isArray(data.recommendations)) {
      throw new Error("The AI response did not contain valid recommendations.");
    }

    const affiliateTag =
      process.env.NEXT_PUBLIC_AMAZON_AFFILIATE_TAG || "";

    const recommendations = data.recommendations.map((gift, index) => {
      const giftName =
        gift.name ||
        gift.title ||
        gift.productName ||
        "Recommended Gift";

      const giftReason =
        gift.reason ||
        gift.description ||
        gift.whyRecommended ||
        "A personalised gift recommendation based on the selected preferences.";

      const giftPrice =
        gift.estimatedPrice ||
        gift.price ||
        gift.priceRange ||
        "Check price on Amazon";

      const searchQuery =
        gift.amazonSearch ||
        gift.amazonSearchQuery ||
        gift.searchQuery ||
        giftName;

      const amazonUrl = new URL("https://www.amazon.in/s");
      amazonUrl.searchParams.set("k", searchQuery);

      if (affiliateTag) {
        amazonUrl.searchParams.set("tag", affiliateTag);
      }

      const finalBuyLink =
        gift.purchaseUrl ||
        gift.buyLink ||
        amazonUrl.toString();

      const finalBrand =
        gift.brand ||
        (gift.purchaseUrl ? "GiftGenie Seller" : "Amazon");

      return {
        ...gift,
        id: `${giftName}-${index}`,
        name: giftName,
        reason: giftReason,
        price: giftPrice,
        category: gift.category || "Personalised Gift",
        brand: finalBrand,
        buyLink: finalBuyLink,
      };
    });

    return {
      recommendations,
      isFallback: Boolean(data.isFallback),
      provider: data.provider || "gemini",
    };
  };

  const startRecommendationProcess = async (finalProfile) => {
    setIsThinking(true);
    setShowResults(false);
    setAiRecommendations([]);
    setRecommendationError("");

    setMessages((previous) => [
      ...previous,
      {
        id: Date.now(),
        sender: "bot",
        text: "Perfect! I have everything I need. Generating personalised gifts...",
      },
    ]);

    try {
      const result = await fetchAIRecommendations(finalProfile);

      setAiRecommendations(result.recommendations);
      setShowResults(true);

      if (result.isFallback) {
        setToast({
          type: "warning",
          message:
            "Note: Google Gemini rate limit reached or offline. Showing smart curated gifts from catalog.",
        });
      }

      setMessages((previous) => [
        ...previous,
        {
          id: Date.now() + 1,
          sender: "bot",
          text: result.isFallback
            ? "I found smart curated gift recommendations for you 🎁"
            : "I found personalised AI gift recommendations for you 🎁",
        },
      ]);
    } catch (error) {
      console.error("Recommendation process failed:", error);
      const errMsg =
        error.message || "Unable to generate recommendations. Please try again.";
      setRecommendationError(errMsg);
      setToast({
        type: "error",
        message: errMsg,
      });
      setShowResults(true);

      setMessages((previous) => [
        ...previous,
        {
          id: Date.now() + 1,
          sender: "bot",
          text: "Sorry, I could not generate recommendations. Please try again.",
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const submitAnswer = (answerValues) => {
    if (
      !Array.isArray(answerValues) ||
      answerValues.length === 0 ||
      isThinking
    ) {
      return;
    }

    const cleanValues = answerValues
      .map((value) => String(value).trim())
      .filter(Boolean);

    if (!cleanValues.length) {
      return;
    }

    const currentKey = activeStep.key;
    const answerText = cleanValues.join(", ");

    const updatedProfile = {
      ...profile,
      [currentKey]: cleanValues,
    };

    setProfile(updatedProfile);

    setMessages((previous) => [
      ...previous,
      {
        id: Date.now(),
        sender: "user",
        text: answerText,
      },
    ]);
    setTypedAnswer("");
    setSelectedOptions([]);

    const isLastStep =
      currentStep === conversationSteps.length - 1;

    if (isLastStep) {
      startRecommendationProcess(updatedProfile);
      return;
    }

    const nextStep = currentStep + 1;

    setIsThinking(true);

    timerRef.current = setTimeout(() => {
      setIsThinking(false);
      setCurrentStep(nextStep);

      setMessages((previous) => [
        ...previous,
        {
          id: Date.now() + 1,
          sender: "bot",
          text: getBotResponse(currentKey, cleanValues),
        },
        {
          id: Date.now() + 2,
          sender: "bot",
          text: conversationSteps[nextStep].question,
        },
      ]);
    }, 900);
  };

  const toggleOption = (option) => {
    if (isThinking) {
      return;
    }

    /*
      Multiple selection is allowed only for:
      1. Interests
      2. Extra details
    */
    if (activeStep.allowMultiple) {
      setSelectedOptions((previous) =>
        previous.includes(option)
          ? previous.filter((item) => item !== option)
          : [...previous, option]
      );

      return;
    }

    /*
      Single option:
      Automatically submit and move to the next question.
    */
    submitAnswer([option]);
  };

  const submitTypedAnswer = () => {
    const customText = typedAnswer.trim();

    const answerValues = [
      ...selectedOptions,
      ...(customText ? [customText] : []),
    ];

    submitAnswer(answerValues);
  };

  const toggleSavedGift = (giftName) => {
    setSavedGifts((previous) =>
      previous.includes(giftName)
        ? previous.filter(
            (item) => item !== giftName
          )
        : [...previous, giftName]
    );
  };

  const startAgain = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setCurrentStep(0);
    setTypedAnswer("");
    setSelectedOptions([]);
    setShowResults(false);
    setIsThinking(false);
    setSavedGifts([]);
    setAiRecommendations([]);
    setRecommendationError("");
    setProfile(initialProfile);

    setMessages([
      {
        id: Date.now(),
        sender: "bot",
        text: "Hi! I’m GiftGenie AI 👋 I’ll help you find the perfect gift.",
      },
      {
        id: Date.now() + 1,
        sender: "bot",
        text: conversationSteps[0].question,
      },
    ]);
  };

  return (
    <section
      className="gift-finder-section"
      id="gift-finder-view"
    >
      {toast && (
        <div className={`gift-toast gift-toast-${toast.type}`} role="alert">
          <span className="toast-icon">
            {toast.type === "error" ? "⚠️" : toast.type === "warning" ? "⚡" : "✨"}
          </span>
          <span className="toast-message">{toast.message}</span>
          <button
            type="button"
            className="toast-close-btn"
            onClick={() => setToast(null)}
            aria-label="Dismiss notification"
          >
            ×
          </button>
        </div>
      )}

      <div className="gift-finder-inner">
        <div className="section-badge">
          <span>🤖</span>
          <span>Conversational AI Gift Finder</span>
        </div>

        <h1>Chat with GiftGenie AI</h1>

        <p className="finder-subtitle">
          Choose quick options or type your own
          preferences for personalised gift
          recommendations.
        </p>

        <div className="chat-finder-layout">
          <div id="gift-chat" className="chat-panel">
            <div className="chat-header">
              <div className="chat-avatar">🤖</div>

              <div>
                <h3>GiftGenie AI</h3>

                <span>
                  <i></i>
                  Online
                </span>
              </div>

              <div className="chat-progress">
                {showResults
                  ? "Complete"
                  : `${currentStep + 1}/${
                      conversationSteps.length
                    }`}
              </div>
            </div>

            <div className="chat-messages">
              {messages.map((message, index) => (
  <div
    className={`chat-row ${
      message.sender === "user"
        ? "user-row"
        : "bot-row"
    }`}
    key={`${message.id}-${index}`}
  >
    {message.sender === "bot" && (
      <div className="message-avatar">🤖</div>
    )}

    <div
      className={`chat-bubble ${message.sender}-bubble`}
    >
      {message.text}
    </div>
  </div>
))}
              {isThinking && (
                <div className="chat-row bot-row">
                  <div className="message-avatar">
                    🤖
                  </div>
                  <div className="chat-bubble bot-bubble thinking-bubble">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              )}

              <div ref={chatEndRef}></div>
            </div>

            {!showResults &&
              !isThinking &&
              activeStep && (
                <div className="chat-controls">
                  <div className="suggestion-heading">
                    {activeStep.allowMultiple
                      ? "Select one or more options"
                      : "Choose one option"}
                  </div>

                  <div className="chat-suggestions">
                    {activeStep.options.map(
                      (option) => {
                        const modeDescription =
                          activeStep.key ===
                          "smartMode"
                            ? smartModes.find(
                                (mode) =>
                                  mode.title === option
                              )?.text
                            : "";

                        return (
                          <button
                            type="button"
                            key={option}
                            className={`suggestion-chip ${
                              selectedOptions.includes(
                                option
                              )
                                ? "selected"
                                : ""
                            }`}
                            onClick={() =>
                              toggleOption(option)
                            }
                          >
                            <strong>{option}</strong>

                            {modeDescription && (
                              <small>
                                {modeDescription}
                              </small>
                            )}
                          </button>
                        );
                      }
                    )}
                  </div>

                  {activeStep.allowMultiple &&
                    selectedOptions.length > 0 && (
                      <button
                        type="button"
                        className="continue-selection-btn"
                        onClick={() =>
                          submitAnswer(selectedOptions)
                        }
                      >
                        Continue with{" "}
                        {selectedOptions.length} selected →
                      </button>
                    )}

                  <div className="chat-input-row auto-input-row">
                    <input
                      type="text"
                      value={typedAnswer}
                      placeholder={
                        activeStep.placeholder
                      }
                      onChange={(event) =>
                        setTypedAnswer(
                          event.target.value
                        )
                      }
                      onKeyDown={(event) => {
                        if (
                          event.key === "Enter" &&
                          !event.shiftKey
                        ) {
                          event.preventDefault();
                          submitTypedAnswer();
                        }
                      }}
                      disabled={isThinking}
                    />
                  </div>

                  <p className="input-help-text">
                    Type a custom answer and press Enter.
                  </p>
                </div>
              )}

            {showResults && (
              <div className="chat-complete-bar">
                <span>
                  ✨ Recommendations ready
                </span>

                <button
                  type="button"
                  onClick={startAgain}
                >
                  Start New Chat
                </button>
              </div>
            )}
          </div>

          <aside className="chat-profile-card">
            <div className="profile-heading">
              <span>🎁</span>

              <div>
                <h3>Your Gift Profile</h3>
                <p>Updates as you chat</p>
              </div>
            </div>

            <ProfileItem
              label="For"
              value={profile.for}
              icon="👤"
            />

            <ProfileItem
              label="Occasion"
              value={profile.occasion}
              icon="🎉"
            />

            <ProfileItem
              label="Budget"
              value={profile.budget}
              icon="₹"
            />

            <ProfileItem
              label="Interests"
              value={profile.interests}
              icon="❤️"
            />

            <ProfileItem
              label="Personality"
              value={profile.personality}
              icon="✨"
            />

            <ProfileItem
              label="Smart Mode"
              value={profile.smartMode}
              icon="⚡"
            />

            
          </aside>
        </div>

        {showResults && (
          <div ref={resultsRef} className="chat-results-section">
            <div className="results-heading">
              <div>
                <span>✨ AI-curated for you</span>

                <h2>
                  Your Gift Recommendations
                </h2>

                <p>
                  These suggestions are ranked
                  according to your conversation.
                </p>
              </div>

              <button
                type="button"
                onClick={startAgain}
              >
                Start Again
              </button>
            </div>

            {aiRecommendations.length > 0 ? (
              <div className="recommendation-grid">
                {aiRecommendations.map((gift,index) => {
                  const isSaved =
                    savedGifts.includes(gift.name);
                     return (
                    <article
                      className="recommendation-card"
                      key={gift.id || `${gift.name}-${index}`}
                    >
                      <div className="recommendation-top">
                        <span className="gift-category">
                          {gift.category}
                        </span>

                        <button
                          type="button"
                          className={`save-icon ${
                            isSaved ? "saved" : ""
                          }`}
                          onClick={() =>
                            toggleSavedGift(
                              gift.name
                            )
                          }
                          aria-label={
                            isSaved
                              ? "Remove saved gift"
                              : "Save gift"
                          }
                        >
                          {isSaved ? "♥" : "♡"}
                        </button>
                      </div>
                      <div className="gift-visual">
  <span className="gift-fallback">🎁</span>
</div>

                      

                      <h3>{gift.name}</h3>

                      <strong className="gift-price">
                        {gift.price}
                      </strong>

                      <p>{gift.reason}</p>

                      <div className="ai-match">
                        <span>AI Match</span>

                        <strong>AI Recommended</strong>
                      </div>

                      <div className="recommendation-actions">
                        <button
                          type="button"
                          className={`save-gift-btn ${
                            isSaved ? "saved" : ""
                          }`}
                          onClick={() =>
                            toggleSavedGift(
                              gift.name
                            )
                          }
                        >
                          {isSaved
                            ? "Saved ✓"
                            : "Save Gift"}
                        </button>

                        <a
                          href={gift.buyLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="buy-now-btn"
                        >
                          Buy on{" "}
                          {gift.brand || "Store"} →
                        </a>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="no-results">
                <span>🎁</span>

                <h3>
                  {recommendationError
                    ? "AI recommendations could not be generated"
                    : "No gift recommendations found"}
                </h3>

                <p>
                  {recommendationError ||
                    "Try selecting another interest, budget or Smart Mode."}
                </p>

                <button
                  type="button"
                  onClick={startAgain}
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
function ProfileItem({ label, value, icon }) {
  return (
    <div className="profile-item">
      <div className="profile-item-icon">
        {icon}
      </div>

      <div>
        <span>{label}</span>

        <strong>
          {value?.length
            ? value.join(", ")
            : "Not selected"}
        </strong>
      </div>
    </div>
  );
}


export const stats = [
  { value: "25K+", label: "Registered Users Target" },
  { value: "30 sec", label: "AI Recommendations" },
  { value: "6–10", label: "Gift Ideas" },
];

export const smartModes = [
  {
    title: "Smart Pick",
    text: "Balanced mix of useful, meaningful and exciting gift ideas.",
  },
  {
    title: "Last-Minute Mode",
    text: "Instant vouchers, digital gifts and quick-delivery options.",
  },
  {
    title: "Impress Mode",
    text: "Premium, luxury and high-impact gift recommendations.",
  },
  {
    title: "Budget Saver",
    text: "Best-value gifts within your selected budget.",
  },
];

export const giftSteps = [
  {
    question: "Who are you buying this gift for?",
    key: "for",
    options: [
      "Mother",
      "Father",
      "Friend",
      "Partner",
      "Brother",
      "Boss",
      "Colleague",
    ],
  },
  {
    question: "What is the occasion?",
    key: "occasion",
    options: [
      "Birthday",
      "Anniversary",
      "Wedding",
      "Diwali",
      "Corporate",
      "Festival",
    ],
  },
  {
    question: "What is your budget?",
    key: "budget",
    options: [
      "₹500–₹1,000",
      "₹1,000–₹5,000",
      "₹5,000–₹10,000",
      "₹25,000+",
    ],
  },
  {
    question: "What are their interests?",
    key: "interests",
    options: [
      "Tech",
      "Fashion",
      "Travel",
      "Fitness",
      "Books",
      "Music",
    ],
  },
  {
    question: "What is their personality/style?",
    key: "personality",
    options: [
      "Fun",
      "Practical",
      "Luxury",
      "Emotional",
      "Minimalist",
    ],
  },
];

export const corporateFeatures = [
  "Bulk recipient upload via CSV",
  "AI-generated gift suggestions per recipient",
  "Per-person and total campaign budget control",
  "One-click approval and vendor routing",
  "Delivery tracking for all gifts",
  "Recurring campaigns for Diwali, birthdays and anniversaries",
  "Analytics dashboard and satisfaction tracking",
];

export const pricingPlans = [
  {
    name: "Free",
    price: "₹0",
    features: ["Basic AI suggestions", "3 searches/day", "Wishlist"],
  },
  {
    name: "Premium",
    price: "₹199–₹499/mo",
    popular: true,
    features: [
      "Unlimited suggestions",
      "Smart Modes",
      "Gift reminders",
      "Past searches",
    ],
  },
  {
    name: "Corporate",
    price: "₹5,000–₹25,000/mo",
    features: [
      "Bulk gifting",
      "Budget tracking",
      "Analytics dashboard",
      "Vendor routing",
    ],
  },
];
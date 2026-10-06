import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";
import { NextResponse } from "next/server";
import { getProducts } from "@/lib/products";

function cleanJsonResponse(responseText = "") {
  return responseText
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

function validateRecommendations(parsedData, sellerProducts = []) {
  if (
    !parsedData ||
    !Array.isArray(parsedData.recommendations) ||
    parsedData.recommendations.length === 0
  ) {
    throw new Error("AI returned an invalid recommendation format.");
  }

  return parsedData.recommendations.slice(0, 6).map((item, idx) => {
    const matchingSellerItem = sellerProducts.find(
      (sp) =>
        sp.title?.toLowerCase() === item.name?.toLowerCase() ||
        (item.purchaseUrl && sp.purchaseUrl === item.purchaseUrl)
    );

    return {
      name: item.name || `Thoughtful Gift Idea #${idx + 1}`,
      category: item.category || "Personalized Gift",
      estimatedPrice: item.estimatedPrice || item.price || "₹1,000–₹2,500",
      reason:
        item.reason ||
        "Specially curated based on your preferences, interests, and budget.",
      amazonSearch:
        item.amazonSearch ||
        item.amazonSearchQuery ||
        item.name ||
        "personalized gifts",
      purchaseUrl: item.purchaseUrl || matchingSellerItem?.purchaseUrl || null,
      brand:
        item.brand ||
        (matchingSellerItem || item.purchaseUrl
          ? "GiftGenie Seller"
          : "Amazon"),
    };
  });
}

/**
 * Primary AI Generator using official Google Gemini SDK (@google/generative-ai)
 * Uses Free Tier models: gemini-1.5-flash or gemini-2.0-flash
 */
async function generateWithGemini(prompt, modelName = "gemini-1.5-flash", sellerProducts = []) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured on the server.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.7,
    },
  });

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const responseText = response.text();

  if (!responseText) {
    throw new Error(`Gemini (${modelName}) returned an empty response.`);
  }

  const parsedData = JSON.parse(cleanJsonResponse(responseText));
  return validateRecommendations(parsedData, sellerProducts);
}

/**
 * Secondary Backup: Groq SDK (if GROQ_API_KEY configured)
 */
async function generateWithGroq(prompt, sellerProducts = []) {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not configured.");
  }

  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  const completion = await groq.chat.completions.create({
    model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content:
          "You are GiftGenie, an expert personalized gift recommendation assistant. Always return valid JSON only.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.6,
    max_completion_tokens: 1800,
    response_format: { type: "json_object" },
  });

  const responseText = completion.choices?.[0]?.message?.content;
  if (!responseText) {
    throw new Error("Groq returned an empty response.");
  }

  const parsedData = JSON.parse(cleanJsonResponse(responseText));
  return validateRecommendations(parsedData, sellerProducts);
}

/**
 * Graceful Local Fallback:
 * If all AI APIs hit rate limits or keys are unavailable,
 * provide intelligent, realistic recommendations prioritizing seller items.
 */
function generateContextualFallback({ recipient, occasion, budget, interests, sellerProducts = [] }) {
  const interestList = interests && interests !== "Not specified" ? interests : "thoughtful lifestyle";
  const results = [];

  // 1. Incorporate verified seller products first if available
  if (sellerProducts.length > 0) {
    for (const sp of sellerProducts.slice(0, 3)) {
      results.push({
        name: sp.title,
        category: sp.category || "Verified Seller Gift",
        estimatedPrice: sp.price || budget,
        reason: `Offered by a verified GiftGenie seller, tailored to celebrate this ${occasion} with genuine personal touch.`,
        amazonSearch: sp.title,
        purchaseUrl: sp.purchaseUrl,
        brand: "GiftGenie Seller",
      });
    }
  }

  // 2. Add curated fallback gifts to make up 6 total
  const defaultIdeas = [
    {
      name: `Customized Engraved Wooden Keepsake for ${recipient}`,
      category: "Personalized Keepsakes",
      estimatedPrice: budget || "₹800–₹1,500",
      reason: `A handcrafted, personalized keepsake tailored to commemorate their ${occasion} with warm memories.`,
      amazonSearch: `personalized wooden keepsake gift for ${recipient}`,
      brand: "Amazon",
    },
    {
      name: `Premium Gourmet Artisan Gift Hamper`,
      category: "Gourmet & Celebrations",
      estimatedPrice: budget || "₹1,200–₹2,000",
      reason: `Delightful selection of luxury chocolates, artisanal snacks, and celebration treats perfect for ${occasion}.`,
      amazonSearch: `luxury gourmet celebration gift box hamper`,
      brand: "Amazon",
    },
    {
      name: `Curated ${interestList} Inspired Lifestyle Set`,
      category: "Lifestyle & Hobbies",
      estimatedPrice: budget || "₹1,500–₹2,500",
      reason: `Directly matches their passion for ${interestList}, giving them something practical and memorable.`,
      amazonSearch: `${interestList} gift set for ${recipient}`,
      brand: "Amazon",
    },
    {
      name: `Smart Ambient Desk Lamp & Organizer`,
      category: "Home & Tech",
      estimatedPrice: budget || "₹1,200–₹2,200",
      reason: `Modern, minimalist aesthetics that elevate any living or working space with warm ambient vibes.`,
      amazonSearch: `smart touch warm light ambient desk lamp`,
      brand: "Amazon",
    },
    {
      name: `Aroma Scented Candle & Relaxation Wellness Kit`,
      category: "Wellness & Spa",
      estimatedPrice: budget || "₹999–₹1,699",
      reason: `Designed to create a soothing, calm atmosphere to relax and unwind after a busy day.`,
      amazonSearch: `luxury scented soy wax candle aromatherapy gift set`,
      brand: "Amazon",
    },
    {
      name: `Customized Photo Memory Lamp / Crystal`,
      category: "Personalized Photo Gifts",
      estimatedPrice: budget || "₹1,100–₹1,800",
      reason: `Brings your favorite shared moments to life with an illuminating photo display.`,
      amazonSearch: `personalized 3D illusion photo lamp`,
      brand: "Amazon",
    },
  ];

  for (const idea of defaultIdeas) {
    if (results.length >= 6) break;
    results.push(idea);
  }

  return results.slice(0, 6);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      recipient,
      occasion,
      budget,
      interests,
      personality,
      smartMode,
    } = body;

    if (!recipient || !occasion || !budget) {
      return NextResponse.json(
        {
          success: false,
          message: "Recipient, occasion, and budget are required.",
        },
        { status: 400 }
      );
    }

    // Retrieve active seller products from database
    const sellerProducts = await getProducts();
    const sellerContext = sellerProducts.length > 0 ? `
VERIFIED PRODUCTS FROM GIFTGENIE PARTNER SELLERS:
${JSON.stringify(
  sellerProducts.slice(0, 10).map((p) => ({
    name: p.title,
    category: p.category,
    price: p.price,
    purchaseUrl: p.purchaseUrl,
    tags: p.tags,
    description: p.description,
  })),
  null,
  2
)}

SPECIAL INSTRUCTION FOR PARTNER SELLER PRODUCTS:
GiftGenie has real seller partners offering the verified items above.
If any of these verified seller products match the recipient's interests, occasion, personality, or budget, PRIORITIZE including them among your 6 recommendations!
When recommending a partner seller product:
- Set "name" to the exact product title
- Set "category" to its category
- Set "estimatedPrice" to its price
- Set "purchaseUrl" to the exact purchaseUrl
- Set "brand" to "GiftGenie Seller"
- Set "reason" explaining why this partner item is great for the recipient.
` : "";

    const prompt = `
You are an expert personalized gift recommendation assistant for an Indian gifting platform named GiftGenie.

Generate exactly 6 personalized gift recommendations based on the user's inputs.

User requirements:
Recipient: ${recipient}
Occasion: ${occasion}
Budget: ${budget}
Interests: ${interests || "Not specified"}
Personality: ${personality || "Not specified"}
Smart mode: ${smartMode || "Smart Pick"}
${sellerContext}

Rules:
1. Recommend gifts suitable for customers in India.
2. Every recommendation must fit within the selected budget (${budget}).
3. Make all six recommendations meaningfully different across categories (keepsakes, tech, gourmet, lifestyle, personalized).
4. Do not claim exact live prices or availability.
5. Provide a realistic estimated price range in Indian Rupees (e.g., "₹1,200–₹1,800").
6. Provide a concise Amazon India search query for each gift.
7. Keep each reason concise, genuine, and tailored to the recipient.
8. If a verified partner seller product matches, include it with its purchaseUrl and brand: "GiftGenie Seller".
9. Return valid JSON only without markdown or code fences.

Return exactly this JSON structure:
{
  "recommendations": [
    {
      "name": "Gift name",
      "category": "Gift category",
      "estimatedPrice": "₹1,000–₹1,500",
      "reason": "Why this gift matches the selected requirements",
      "amazonSearch": "short Amazon search keyword phrase",
      "purchaseUrl": "optional link if from verified seller, otherwise null",
      "brand": "GiftGenie Seller or Amazon"
    }
  ]
}
`;

    let recommendations = null;
    let provider = "gemini";
    const primaryGeminiModel = process.env.GEMINI_MODEL || "gemini-1.5-flash";

    // 1. Try Primary Google Gemini Flash
    try {
      recommendations = await generateWithGemini(prompt, primaryGeminiModel, sellerProducts);
    } catch (geminiError) {
      console.warn(`Primary Gemini (${primaryGeminiModel}) error:`, geminiError.message);

      // 1b. Try Secondary Gemini Model fallback (e.g. gemini-2.0-flash)
      const secondaryModel = primaryGeminiModel === "gemini-1.5-flash" ? "gemini-2.0-flash" : "gemini-1.5-flash";
      try {
        console.log(`Trying secondary Gemini model: ${secondaryModel}`);
        recommendations = await generateWithGemini(prompt, secondaryModel, sellerProducts);
        provider = `gemini (${secondaryModel})`;
      } catch (secondaryGeminiError) {
        console.warn(`Secondary Gemini (${secondaryModel}) error:`, secondaryGeminiError.message);

        // 2. Try Groq as secondary provider if configured
        if (process.env.GROQ_API_KEY) {
          try {
            console.log("Trying Groq fallback provider...");
            recommendations = await generateWithGroq(prompt, sellerProducts);
            provider = "groq";
          } catch (groqError) {
            console.warn("Groq provider error:", groqError.message);
          }
        }
      }
    }

    // 3. If AI providers succeeded, return recommendations
    if (recommendations && recommendations.length > 0) {
      console.log(`[GiftGenie AI] Recommendations generated successfully via ${provider}`);
      return NextResponse.json(
        {
          success: true,
          provider,
          recommendations,
        },
        { status: 200 }
      );
    }

    // 4. Safe fallback if API keys are missing or rate limits are reached
    console.warn("[GiftGenie AI] All AI APIs unavailable. Serving smart contextual fallback.");
    const fallbackRecommendations = generateContextualFallback({
      recipient,
      occasion,
      budget,
      interests,
      sellerProducts,
    });

    return NextResponse.json(
      {
        success: true,
        provider: "contextual-fallback",
        isFallback: true,
        message: "Generated using GiftGenie Smart Catalog (AI rate limit reached or offline).",
        recommendations: fallbackRecommendations,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fatal recommendation error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "GiftGenie AI is temporarily unavailable. Please try again.",
      },
      { status: 500 }
    );
  }
}
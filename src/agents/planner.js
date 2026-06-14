import { GoogleGenerativeAI } from "@google/generative-ai";

export async function getGeminiPlan(query) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey || apiKey.length < 10) {
    console.warn("[Orchid Planner] Missing Gemini API Key. Use VITE_GEMINI_API_KEY in .env.");
    return fallbackPlan();
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = `You are a research planner. For the query "${query}", provide a JSON plan with fields: intent, source_priority (GNews, YFinance, or Moneycontrol), and reasoning_steps (array). Output ONLY JSON.`;
  
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return JSON.parse(text.replace(/```json|```/g, ""));
  } catch (error) {
    if (error.message?.includes("API_KEY_SERVICE_BLOCKED")) {
      console.error("[Orchid Planner] Error 403: Gemini API is blocked for this key. Ensure 'Generative Language API' is enabled in Google Cloud Console.");
    } else {
      console.error("[Orchid Planner] Planning Error:", error);
    }
    return fallbackPlan();
  }
}

function fallbackPlan() {
  return {
    intent: "general_research",
    source_priority: "GNews",
    reasoning_steps: ["Activate signal retrieval", "Validate source provenance", "Synthesize brief"]
  };
}

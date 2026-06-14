import { GoogleGenerativeAI } from "@google/generative-ai";

export async function getGeminiPlan(query) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey || apiKey.length < 10) {
    console.warn("[Orchid Planner] Missing Gemini API Key. Use VITE_GEMINI_API_KEY in .env.");
    return fallbackPlan();
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  // Use gemini-1.5-flash which is widely compatible
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = `You are an expert research planner. For the query "${query}", provide a JSON plan with fields: intent, source_priority (GNews, YFinance, or Moneycontrol), and reasoning_steps (array). Output ONLY valid JSON.`;
  
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    // Aggressive JSON extraction in case of markdown or prefixing
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid JSON response from Gemini");
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    if (error.message?.includes("404")) {
      console.error("[Orchid Planner] Error 404: Model not found. Falling back to broad search strategy.");
    } else if (error.message?.includes("API_KEY_SERVICE_BLOCKED")) {
      console.error("[Orchid Planner] Error 403: API key restricted. Enable 'Generative Language API'.");
    } else {
      console.error("[Orchid Planner] Execution Error:", error.message);
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

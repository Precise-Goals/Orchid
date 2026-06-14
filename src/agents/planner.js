import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function getGeminiPlan(query) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = `You are a research planner. For the query "${query}", provide a JSON plan with fields: intent, source_priority (GNews, YFinance, or Moneycontrol), and reasoning_steps (array). Output ONLY JSON.`;
  
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return JSON.parse(text.replace(/```json|```/g, ""));
  } catch (error) {
    console.error("Gemini Planning Error:", error);
    return {
      intent: "general_research",
      source_priority: "GNews",
      reasoning_steps: ["Decompose query", "Search sources", "Synthesize results"]
    };
  }
}

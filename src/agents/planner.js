/**
 * Orchid Planner — OpenRouter DeepSeek R1 (free tier)
 * Replaces Gemini which had quota = 0 on free tier.
 */

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const OPENROUTER_BASE = "https://openrouter.ai/api/v1/chat/completions";
// Auto-router: OpenRouter picks the best currently available free model
const PLANNER_MODEL = "openrouter/auto";

export async function getGeminiPlan(query) {
  try {
    const response = await fetch(OPENROUTER_BASE, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": window.location.origin,
        "X-Title": "Orchid Intelligence",
      },
      body: JSON.stringify({
        model: PLANNER_MODEL,
        messages: [
          {
            role: "system",
            content:
              "You are an expert financial research planner. Respond ONLY with valid JSON — no markdown, no explanation.",
          },
          {
            role: "user",
            content: `For the query: "${query}", produce a JSON object with exactly these fields:
{
  "intent": "short description of the research intent",
  "source_priority": "YFinance" or "Moneycontrol",
  "reasoning_steps": ["step 1", "step 2", "step 3"]
}`,
          },
        ],
        temperature: 0.3,
        max_tokens: 512,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`OpenRouter ${response.status}: ${err}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content ?? "";
    // Strip reasoning tags (DeepSeek R1 wraps in <think>…</think>)
    const clean = text.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
    const jsonMatch = clean.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in planner response");
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.warn("[Orchid Planner] Error:", error.message, "— using fallback strategy.");
    return fallbackPlan();
  }
}

function fallbackPlan() {
  return {
    intent: "general_research",
    source_priority: "Moneycontrol",
    reasoning_steps: ["Activate signal retrieval", "Validate source provenance", "Synthesize brief"],
  };
}

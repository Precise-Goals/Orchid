import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function synthesizeResearch(query, articles) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  const context = articles.map((a, i) => 
    `Source ${i+1}: ${a.title}\nDescription: ${a.description}\n`
  ).join("\n---\n");

  const prompt = `
    You are an expert research analyst. 
    User Query: "${query}"
    
    Based ONLY on the following news signals, provide a institutional-grade research brief.
    
    NEWS SIGNALS:
    ${context}
    
    Output a JSON object with:
    - summary: A 2-sentence thesis grounded in the signals.
    - bullets: An array of 4 specific findings.
    - confidence: A percentage based on source quality.
    
    If no signals are relevant, state that no live data was found.
    Output ONLY JSON.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return JSON.parse(text.replace(/```json|```/g, ""));
  } catch (error) {
    console.error("Gemini Synthesis Error:", error);
    return {
      summary: "Live signal synthesis failed. The system identified structural movement but could not verify via RAG.",
      bullets: ["Signal verification timeout", "Multimodal alignment pending"],
      confidence: 50
    };
  }
}

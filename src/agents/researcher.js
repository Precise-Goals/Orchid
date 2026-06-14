export async function fetchLiveSignals(query, sourcePriority) {
  const apiKey = import.meta.env.VITE_GNEWS_API_KEY;
  
  // Advanced query processing:
  // 1. Remove common conversational fluff
  // 2. Extract key topical nouns/phrases
  // 3. Limit to the most significant 5 words to keep search broad enough for GNews
  let simplified = query.toLowerCase()
    .replace(/(what|is|are|the|current|market|trends|for|prices|price|of|how|to|compare|vs|and)/g, "")
    .replace(/[?]/g, "")
    .trim()
    .split(/\s+/)
    .filter(word => word.length > 2)
    .slice(0, 5)
    .join(" ");

  // Fallback to original if simplification was too aggressive
  if (!simplified || simplified.length < 3) {
    simplified = query.slice(0, 50).replace(/[?]/g, "");
  }

  let searchQuery = simplified;

  if (sourcePriority === 'YFinance') {
    searchQuery = `${simplified} site:finance.yahoo.com`;
  } else if (sourcePriority === 'Moneycontrol') {
    searchQuery = `${simplified} site:moneycontrol.com`;
  }

  console.log(`[Signal Retrieval] Refined Search: "${searchQuery}"`);

  try {
    // GNews v4 uses 'apikey' as the standard parameter
    const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(searchQuery)}&apikey=${apiKey}&lang=en&max=5`;
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("[Signal Retrieval] API Error Response:", errorData);
      throw new Error(`Signal retrieval failed: ${response.status} ${errorData.errors?.[0] || ""}`);
    }

    const data = await response.json();
    
    if (!data.articles || data.articles.length === 0) {
      console.warn(`[Signal Retrieval] No live signals found for "${searchQuery}".`);
      return [];
    }

    return data.articles.map(article => ({
      title: article.title,
      description: article.description,
      source: article.source.name,
      url: article.url
    }));
  } catch (error) {
    console.error("[Signal Retrieval] Critical Error:", error);
    return [];
  }
}

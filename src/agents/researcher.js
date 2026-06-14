export async function fetchLiveSignals(query, sourcePriority) {
  const apiKey = import.meta.env.VITE_GNEWS_API_KEY;
  
  // Clean query: remove special chars and limit length to avoid 400 errors
  let cleanQuery = query.replace(/[?]/g, "").slice(0, 100);
  let searchQuery = cleanQuery;

  if (sourcePriority === 'YFinance') {
    searchQuery = `"${cleanQuery}" site:finance.yahoo.com`;
  } else if (sourcePriority === 'Moneycontrol') {
    searchQuery = `"${cleanQuery}" site:moneycontrol.com`;
  }

  console.log(`[Signal Retrieval] Searching for: "${searchQuery}"`);

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

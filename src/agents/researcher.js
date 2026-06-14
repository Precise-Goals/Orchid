export async function fetchLiveSignals(query, sourcePriority) {
  const apiKey = import.meta.env.VITE_GNEWS_API_KEY;
  let searchQuery = query;

  // Simulate source-specific searches using domain filtering
  if (sourcePriority === 'YFinance') {
    searchQuery = `${query} site:finance.yahoo.com`;
  } else if (sourcePriority === 'Moneycontrol') {
    searchQuery = `${query} site:moneycontrol.com`;
  }

  console.log(`[Researcher] Fetching live signals for: "${searchQuery}"`);

  try {
    const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(searchQuery)}&token=${apiKey}&lang=en&max=5`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`GNews API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.articles || data.articles.length === 0) {
      console.warn(`[Researcher] No live articles found for "${searchQuery}".`);
      return [];
    }

    return data.articles.map(article => ({
      title: article.title,
      description: article.description,
      content: article.content,
      source: article.source.name,
      url: article.url,
      publishedAt: article.publishedAt
    }));
  } catch (error) {
    console.error("[Researcher] Fetch Error:", error);
    return [];
  }
}

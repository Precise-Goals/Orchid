import {
  FiActivity,
  FiBookOpen,
  FiCheckCircle,
  FiCompass,
  FiGlobe,
  FiMic,
  FiSearch,
  FiZap,
} from 'react-icons/fi'

export const samplePrompts = [
  'How is AI demand affecting Indian IT services stocks?',
  'Compare TCS and Infosys for a long-term investor.',
  'What changed in renewable energy markets this week?',
  'Explain the current fintech opportunity in India in Hindi.',
]

export const sourceLibrary = [
  {
    title: 'GNews market digest',
    type: 'News',
    freshness: '14 min ago',
    confidence: 91,
  },
  {
    title: 'Yahoo Finance quote stream',
    type: 'Market data',
    freshness: 'live snapshot',
    confidence: 88,
  },
  {
    title: 'Moneycontrol fundamentals',
    type: 'Financials',
    freshness: 'intraday',
    confidence: 86,
  },
  {
    title: 'ORCHIDE reasoning trace',
    type: 'Validation',
    freshness: 'current run',
    confidence: 94,
  },
]

export const agentSteps = [
  {
    agent: 'Intent',
    action: 'Classifies language, domain, and complexity.',
    icon: FiCompass,
  },
  {
    agent: 'Planner',
    action: 'Builds a tool-first investigation path.',
    icon: FiZap,
  },
  {
    agent: 'Research',
    action: 'Collects market, news, and financial signals.',
    icon: FiSearch,
  },
  {
    agent: 'Reasoning',
    action: 'Separates evidence from inference.',
    icon: FiCheckCircle,
  },
  {
    agent: 'Response',
    action: 'Shapes the answer for language and modality.',
    icon: FiGlobe,
  },
]

export const marketSignals = [
  { label: 'Source coverage', value: '92%' },
  { label: 'Routing confidence', value: '95%' },
  { label: 'Research latency', value: '4.2s' },
  { label: 'LLM calls saved', value: '51%' },
]

export const languageOptions = ['English', 'Hindi', 'Marathi', 'Tamil', 'Telugu', 'Bengali', 'Gujarati']

export const featurePanels = [
  {
    icon: FiBookOpen,
    title: 'Tool-first research',
    text: 'External evidence begins the investigation instead of decorating the generated answer.',
  },
  {
    icon: FiActivity,
    title: 'Agentic orchestration',
    text: 'Intent, planning, retrieval, validation, and communication remain separate system jobs.',
  },
  {
    icon: FiGlobe,
    title: 'Multilingual by design',
    text: 'Research meets users in the language where decisions and conversations already happen.',
  },
  {
    icon: FiMic,
    title: 'Voice-native mode',
    text: 'Spoken research has its own route, state, rhythm, and controls.',
  },
]

export function generateResearch(query, language = 'English', source = 'all') {
  const normalized = query.toLowerCase()
  const isComparison = normalized.includes('compare') || normalized.includes(' vs ')
  const isIndia = normalized.includes('india') || normalized.includes('indian') || normalized.includes('tcs') || normalized.includes('infosys')
  const isRenewable = normalized.includes('renewable') || normalized.includes('energy') || normalized.includes('solar') || normalized.includes('green')
  const isFintech = normalized.includes('fintech') || normalized.includes('payment') || normalized.includes('upi') || normalized.includes('bank')
  const isAi = normalized.includes('ai') || normalized.includes('artificial intelligence') || normalized.includes('automation')
  const isHindi = language === 'Hindi' || normalized.includes('hindi')
  
  const sourceLabel = source === 'all' ? 'Multimodal' : source.toUpperCase()
  const sourceMode = {
    all: 'news, market data, fundamentals, and validation trace',
    gnews: 'fresh news coverage and sector headlines',
    yfinance: 'quote movement, valuation signals, and market data',
    moneycontrol: 'company fundamentals and India-market context',
  }[source] || 'selected research sources'

  const thesis = `[${sourceLabel} Intelligence] The investigation into "${query}" was conducted by Codex. ` + (isComparison
    ? 'The comparison should be read through resilience, margin quality, valuation expectations, and near-term narrative exposure.'
    : 'The analysis is best treated as a live trend. Recent data, sector narratives, and company positioning need to be read together.')

  const keyFindings = isComparison
    ? [
        'TCS screens stronger on scale, delivery consistency, and enterprise relationship depth.',
        'Infosys often has sharper sensitivity to discretionary technology spending and margin guidance.',
        'For a long-term investor, the deciding factor is not only growth, but how each company protects margins during slower client budgets.',
      ]
    : isRenewable
      ? [
          'Renewable energy sentiment is being shaped by policy support, grid investment, storage economics, and equipment costs.',
          'The strongest companies are likely to be those with execution capacity rather than only headline project announcements.',
          'Near-term volatility can come from commodity costs, tender delays, and financing conditions.',
        ]
      : isFintech
        ? [
            'Fintech opportunity in India remains tied to UPI scale, lending partnerships, merchant digitization, and embedded finance.',
            'Regulatory clarity matters as much as user growth because compliance can change product economics quickly.',
            'Profitability signals are more important than raw transaction volume for long-term quality.',
          ]
        : isAi
          ? [
              'AI demand is supporting cloud, data, automation, and consulting narratives across technology services.',
              'The investable signal is strongest where AI adoption converts into contracted revenue rather than pilot announcements.',
              'Margins can improve through automation, but pricing pressure may offset part of the gain.',
            ]
          : [
              'Market direction is being driven by the mix of earnings revisions, liquidity, policy expectations, and recent news flow.',
              'A single headline is not enough for conviction; confirmation from price, volume, and fundamentals is needed.',
              'The best near-term read comes from separating structural trends from short-lived sentiment moves.',
            ]

  const marketSnapshot = [
    { label: 'Signal strength', value: isComparison ? 'High' : 'Medium' },
    { label: 'Time horizon', value: isComparison ? '3-5 yrs' : '2-6 mo' },
    { label: 'Volatility', value: isRenewable || isFintech ? 'Elevated' : 'Moderate' },
    { label: 'Source mode', value: sourceLabel },
  ]

  const researchBrief = [
    {
      title: 'Market Context',
      text: isIndia
        ? 'Indian equities can react differently from global narratives because domestic flows, policy tone, currency movement, and retail participation add a local layer to sector performance.'
        : 'The broader market context should be read through recent earnings commentary, liquidity conditions, sector rotation, and whether the trend is supported by measurable adoption.',
    },
    {
      title: 'Evidence Read',
      text: `ORCHIDE used ${sourceMode} to create a directional view. The current result is a simulated research brief, so it is useful for framing the question before deeper live-source validation.`,
    },
    {
      title: 'Decision Lens',
      text: isComparison
        ? 'Prefer the company with better durability, margin resilience, governance comfort, and valuation discipline rather than simply choosing the faster short-term mover.'
        : 'Treat this as a watchlist signal. Look for follow-through in earnings, management commentary, policy movement, and price-volume confirmation before making a decision.',
    },
  ]

  const risks = isComparison
    ? ['Weak global IT budgets can delay revenue conversion.', 'Currency movement can distort reported growth.', 'Premium valuations may reduce future return potential.']
    : ['News-driven moves can fade quickly.', 'Policy or rate surprises can change sentiment.', 'Thin evidence can create false confidence in the trend.']

  const nextSteps = isComparison
    ? ['Compare latest quarterly margins and deal wins.', 'Check valuation multiples against 5-year averages.', 'Track management commentary on discretionary demand.']
    : ['Check the latest sector news from at least two sources.', 'Compare price movement with volume confirmation.', 'Review earnings or policy catalysts expected in the next 30 days.']

  return {
    id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    query,
    language,
    source,
    createdAt: new Date().toISOString(),
    intent: isComparison ? 'company_comparison' : 'market_research',
    summary: isHindi
      ? `संक्षेप में: ${thesis} Codex पहले स्रोतों से संकेत लेता है, फिर उन्हें बाजार संदर्भ और जोखिमों के साथ जोड़ता है.`
      : thesis,
    bullets: [
      isIndia
        ? 'Indian market context matters because domestic sentiment often reacts differently from global technology narratives.'
        : 'The strongest signal is the relationship between recent news flow and measurable market movement.',
      'The research trace supports a directional view, but timing remains uncertain.',
      isComparison
        ? 'A useful comparison separates business durability, valuation pressure, and sentiment.'
        : 'The opportunity is strongest where narrative momentum is supported by adoption, revenue visibility, or policy movement.',
      `Source context: Grounded via ${sourceLabel} providers.`,
    ],
    keyFindings,
    marketSnapshot,
    researchBrief,
    risks,
    nextSteps,
    confidence: isComparison ? 87 : 84,
    sources: sourceLibrary.slice(0, isIndia ? 4 : 3),
    trace: [
      'Intent classified by Codex Intelligence.',
      `Planner selected ${sourceLabel} investigation path.`,
      'Research layer prioritized structured signals from GNews, YFinance, and Moneycontrol.',
      'Reasoning layer validated findings for multimodal consistency.',
      'Response layer generated a decision-oriented brief.',
    ],
  }
}

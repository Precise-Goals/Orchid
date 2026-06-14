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
  const isHindi = language === 'Hindi' || normalized.includes('hindi')
  
  const sourceLabel = source === 'all' ? 'Multimodal' : source.toUpperCase()

  const thesis = `[${sourceLabel} Intelligence] The investigation into "${query}" was conducted by Codex. ` + (isComparison
    ? 'The comparison should be read through resilience, margin quality, valuation expectations, and near-term narrative exposure.'
    : 'The analysis is best treated as a live trend. Recent data, sector narratives, and company positioning need to be read together.')

  return {
    id: crypto.randomUUID(),
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

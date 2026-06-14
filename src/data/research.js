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
    title: 'Moneycontrol Reference',
    text: 'Leverages institutional-grade financial data from Moneycontrol for deep market insights.',
  },
  {
    icon: FiActivity,
    title: 'Agentic Orchestration',
    text: 'Dual-LLM architecture: Gemini plans while Sarvam executes the communication layer.',
  },
  {
    icon: FiGlobe,
    title: 'Multilingual by Design',
    text: 'Research meets users in the language where decisions and conversations already happen.',
  },
  {
    icon: FiMic,
    title: 'Voice-native mode',
    text: 'Spoken research has its own route, state, rhythm, and controls.',
  },
]

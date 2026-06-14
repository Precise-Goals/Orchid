import { useCallback, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { FiBarChart2, FiAlertCircle } from 'react-icons/fi'
import { AgentRail } from '../components/research/AgentRail'
import { ResearchHero } from '../components/research/ResearchHero'
import { ResearchInput } from '../components/research/ResearchInput'
import { ResearchChips } from '../components/research/ResearchChips'
import { NewResearch } from '../components/research/NewResearch'
import { agentSteps } from '../data/research'
import { useAuth } from '../hooks/useAuth'
import { getGeminiPlan } from '../agents/planner'
import { fetchLiveSignals } from '../agents/researcher'
import { synthesizeResearch } from '../agents/synthesizer'

export function ResearchPage() {
  const location = useLocation()
  const { profile } = useAuth()
  const locationPrompt = location.state?.prompt
  const [input, setInput] = useState(locationPrompt || '')
  const [language, setLanguage] = useState(profile?.language || 'English')
  const [isRunning, setIsRunning] = useState(false)
  const [error, setError] = useState(null)
  const [activeStep, setActiveStep] = useState(0)
  const [showNew, setShowNew] = useState(!locationPrompt)

  const runResearch = useCallback(async (query = input, source = 'all') => {
    const trimmed = query.trim()
    if (!trimmed || isRunning) return

    setInput(trimmed)
    setIsRunning(true)
    setError(null)
    setActiveStep(0)
    setShowNew(false)

    try {
      // Step 1: Gemini Planner
      console.log('[Dual-LLM] Phase 1: Planning...')
      const plan = await getGeminiPlan(trimmed)
      setActiveStep(1)

      // Step 2: Live Signal Retrieval
      console.log('[Dual-LLM] Phase 2: Signal Retrieval...')
      const articles = await fetchLiveSignals(trimmed, plan.source_priority)
      setActiveStep(2)

      if (articles.length === 0) {
        throw new Error('No live signals could be retrieved for this query.')
      }

      // Step 3: Synthesis
      console.log('[Dual-LLM] Phase 3: Reasoning & Synthesis...')
      const result = await synthesizeResearch(trimmed, articles)
      setActiveStep(3)

      // Step 4: Final Output
      console.log('%c[CODEX SYSTEM RESULT]', 'color: #c15f3c; font-weight: bold; font-size: 14px;')
      console.log('%cQuery:', 'font-weight: bold', trimmed)
      console.log('%cStrategy:', 'font-weight: bold', plan.source_priority)
      console.log('%cThesis:', 'font-weight: bold', result.summary)
      console.log('%cFindings:', 'font-weight: bold')
      result.bullets.forEach(b => console.log(' •', b))
      console.log('%cLive Sources:', 'font-weight: bold')
      articles.forEach(a => console.log(` [${a.source}] ${a.title}`))
      console.log('%cConfidence:', 'color: #6f8d79; font-weight: bold', `${result.confidence}%`)
      console.log('%c---------------------------------------', 'color: #ded9ce')

      setIsRunning(false)
      setActiveStep(4)
    } catch (err) {
      console.error('[System Error]:', err)
      setError(err.message || 'Investigation failed. Check console.')
      setIsRunning(false)
    }
  }, [input, isRunning, language])

  if (showNew) {
    return <NewResearch onStart={runResearch} />
  }

  return (
    <section className="research-page">
      <ResearchHero language={language} onLanguageChange={setLanguage} />
      
      <ResearchInput 
        input={input} 
        setInput={setInput} 
        isRunning={isRunning} 
        onSubmit={runResearch} 
      />

      {error && (
        <div className="error-banner">
          <FiAlertCircle /> {error}
        </div>
      )}

      <ResearchChips onSelect={(item) => {
        setInput(item)
        runResearch(item)
      }} />

      <AgentRail activeStep={activeStep} isRunning={isRunning} />
      
      {isRunning && (
        <div className="running-indicator">
          <p>Codex Agentic IDE is investigating... check console for multimodal signals.</p>
        </div>
      )}
    </section>
  )
}

function EmptyResearch() {
  return (
    <div className="empty-research">
      <FiBarChart2 aria-hidden="true" />
      <h2>No active run</h2>
      <p>Start an investigation to see the answer, citations, confidence, and reasoning trace.</p>
    </div>
  )
}

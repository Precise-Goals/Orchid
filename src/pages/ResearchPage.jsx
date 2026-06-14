import { useCallback, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { FiBarChart2, FiAlertCircle } from 'react-icons/fi'
import { AgentRail } from '../components/research/AgentRail'
import { ResearchHero } from '../components/research/ResearchHero'
import { ResearchInput } from '../components/research/ResearchInput'
import { ResearchChips } from '../components/research/ResearchChips'
import { NewResearch } from '../components/research/NewResearch'
import { agentSteps, generateResearch } from '../data/research'
import { useAuth } from '../hooks/useAuth'
import { getGeminiPlan } from '../agents/planner'

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
      // Step 1: Gemini Planner (The Thinker)
      console.log('[Dual-LLM] Phase 1: Gemini Planning...')
      const plan = await getGeminiPlan(trimmed)
      console.log('[Gemini Plan]:', plan)
      setActiveStep(1)

      // Step 2: Agent Execution
      console.log('[Dual-LLM] Phase 2: Agent Execution & Signal Collection...')
      const timer = window.setInterval(() => {
        setActiveStep((step) => Math.min(step + 1, agentSteps.length - 1))
      }, 500)

      window.setTimeout(() => {
        window.clearInterval(timer)
        const run = generateResearch(trimmed, language, source)
        
        // Log to console only as requested
        console.log('%c[CODEX SYSTEM RESULT]', 'color: #c15f3c; font-weight: bold; font-size: 14px;')
        console.log('%cQuery:', 'font-weight: bold', run.query)
        console.log('%cPlan Strategy:', 'font-weight: bold', plan.source_priority)
        console.log('%cSummary:', 'font-weight: bold', run.summary)
        console.log('%cTrace:', 'font-weight: bold')
        run.trace.forEach((t, i) => console.log(` ${i + 1}. ${t}`))
        
        setIsRunning(false)
        setActiveStep(agentSteps.length - 1)
      }, 2000)
    } catch (err) {
      console.error('[System Error]:', err)
      setError('Investigation failed. Check console for debug traces.')
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

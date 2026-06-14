import { useCallback, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiAlertCircle } from 'react-icons/fi'
import { AgentRail } from '../components/research/AgentRail'
import { ResearchHero } from '../components/research/ResearchHero'
import { ResearchInput } from '../components/research/ResearchInput'
import { ResearchChips } from '../components/research/ResearchChips'
import { ResearchResult } from '../components/research/ResearchResult'
import { NewResearch } from '../components/research/NewResearch'
import { useAuth } from '../hooks/useAuth'
import { getGeminiPlan } from '../agents/planner'
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
  const [result, setResult] = useState(null)
  const [plan, setPlan] = useState(null)

  const runResearch = useCallback(async (query = input, source = 'all') => {
    const trimmed = query.trim()
    if (!trimmed || isRunning) return

    setInput(trimmed)
    setIsRunning(true)
    setError(null)
    setResult(null)
    setActiveStep(0)
    setShowNew(false)

    try {
      // Phase 1: Planning
      const resolvedPlan = await getGeminiPlan(trimmed)
      setPlan(resolvedPlan)
      setActiveStep(1)

      // Phase 2: Synthesis
      setActiveStep(2)
      const resolved = await synthesizeResearch(trimmed, resolvedPlan.source_priority)
      setActiveStep(4)

      setResult({
        query: trimmed,
        intent: resolvedPlan.intent ?? 'general research',
        summary: resolved.summary,
        bullets: resolved.bullets,
        confidence: resolved.confidence,
        sources: resolved.sources ?? [],
        trace: resolved.trace ?? resolvedPlan.reasoning_steps ?? [],
      })

      setIsRunning(false)
    } catch (err) {
      console.error('[System Error]:', err)
      setError(err.message || 'Investigation failed.')
      setIsRunning(false)
    }
  }, [input, isRunning])

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

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="error-banner"
          >
            <FiAlertCircle /> <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <ResearchChips onSelect={(item) => {
        setInput(item)
        runResearch(item)
      }} />

      <AgentRail activeStep={activeStep} isRunning={isRunning} />

      {isRunning && (
        <motion.div
          className="running-indicator"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="running-dots">
            <span /><span /><span />
          </div>
          <p>Orchid Intelligence is reasoning with DeepSeek R1...</p>
        </motion.div>
      )}

      <AnimatePresence>
        {result && !isRunning && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <ResearchResult run={result} />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

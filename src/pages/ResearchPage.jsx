import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { FiBarChart2, FiLoader } from 'react-icons/fi'
import { AgentRail } from '../components/research/AgentRail'
import { ResearchResult } from '../components/research/ResearchResult'
import { ResearchHero } from '../components/research/ResearchHero'
import { ResearchInput } from '../components/research/ResearchInput'
import { ResearchChips } from '../components/research/ResearchChips'
import { NewResearch } from '../components/research/NewResearch'
import { agentSteps, generateResearch } from '../data/research'
import { useAuth } from '../hooks/useAuth'

export function ResearchPage() {
  const location = useLocation()
  const { profile } = useAuth()
  const locationPrompt = location.state?.prompt
  const resultRef = useRef(null)
  const intervalRef = useRef(null)
  const timeoutRef = useRef(null)
  const [input, setInput] = useState(locationPrompt || '')
  const [language, setLanguage] = useState(profile?.language || 'English')
  const [isRunning, setIsRunning] = useState(false)
  const [activeRun, setActiveRun] = useState(null)
  const [activeStep, setActiveStep] = useState(0)
  const [showNew, setShowNew] = useState(!locationPrompt)

  const clearRunTimers = useCallback(() => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  useEffect(() => clearRunTimers, [clearRunTimers])

  useEffect(() => {
    if (!activeRun) return
    window.requestAnimationFrame(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }, [activeRun])

  const runResearch = useCallback((query = input, source = 'all') => {
    const trimmed = query.trim()
    if (!trimmed || isRunning) return

    clearRunTimers()
    setInput(trimmed)
    setIsRunning(true)
    setActiveStep(0)
    setActiveRun(null)
    setShowNew(false)

    intervalRef.current = window.setInterval(() => {
      setActiveStep((step) => Math.min(step + 1, agentSteps.length - 1))
    }, 380)

    timeoutRef.current = window.setTimeout(() => {
      clearRunTimers()
      setActiveRun(generateResearch(trimmed, language, source))
      setIsRunning(false)
      setActiveStep(agentSteps.length - 1)
    }, 2100)
  }, [clearRunTimers, input, isRunning, language])

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

      <ResearchChips onSelect={(item) => {
        setInput(item)
        runResearch(item)
      }} />

      <AgentRail activeStep={activeStep} isRunning={isRunning} />
      <div ref={resultRef}>
        {isRunning ? <RunningResearch query={input} /> : activeRun ? <ResearchResult run={activeRun} /> : <EmptyResearch />}
      </div>
    </section>
  )
}

function RunningResearch({ query }) {
  return (
    <div className="empty-research running-research" aria-live="polite">
      <FiLoader aria-hidden="true" />
      <h2>Researching "{query}"</h2>
      <p>ORCHIDE is planning the query, collecting signals, validating sources, and shaping the answer.</p>
    </div>
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

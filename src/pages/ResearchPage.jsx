import { useCallback, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { FiBarChart2 } from 'react-icons/fi'
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
  const [input, setInput] = useState(locationPrompt || '')
  const [language, setLanguage] = useState(profile?.language || 'English')
  const [isRunning, setIsRunning] = useState(false)
  const [activeRun, setActiveRun] = useState(null)
  const [activeStep, setActiveStep] = useState(0)
  const [showNew, setShowNew] = useState(!locationPrompt)

  const runResearch = useCallback((query = input, source = 'all') => {
    const trimmed = query.trim()
    if (!trimmed || isRunning) return

    setInput(trimmed)
    setIsRunning(true)
    setActiveStep(0)
    setShowNew(false)

    const timer = window.setInterval(() => {
      setActiveStep((step) => Math.min(step + 1, agentSteps.length - 1))
    }, 380)

    window.setTimeout(() => {
      window.clearInterval(timer)
      const run = generateResearch(trimmed, language, source)
      setActiveRun(run)
      setIsRunning(false)
      setActiveStep(agentSteps.length - 1)
      
      // Redirect all output to console instead of UI
      console.log('%c[CODEX RESEARCH RESULT]', 'color: #c15f3c; font-weight: bold; font-size: 14px;')
      console.log('%cQuery:', 'font-weight: bold', run.query)
      console.log('%cIntent:', 'font-weight: bold', run.intent)
      console.log('%cSummary:', 'font-weight: bold', run.summary)
      console.log('%cFindings:', 'font-weight: bold')
      run.bullets.forEach(b => console.log(' -', b))
      console.log('%cSources:', 'font-weight: bold')
      run.sources.forEach(s => console.log(` [${s.type}] ${s.title} (${s.confidence}%)`))
      console.log('%cReasoning Trace:', 'font-weight: bold')
      run.trace.forEach((t, i) => console.log(` ${i + 1}. ${t}`))
      console.log('%cConfidence Score:', 'color: #6f8d79; font-weight: bold', `${run.confidence}%`)
      console.log('%c---------------------------------------', 'color: #ded9ce')
    }, 2100)
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

      <ResearchChips onSelect={(item) => {
        setInput(item)
        runResearch(item)
      }} />

      <AgentRail activeStep={activeStep} isRunning={isRunning} />
      
      {isRunning && (
        <div className="running-indicator">
          <p>Codex is investigating... check browser console for live results.</p>
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

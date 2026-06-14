import { useCallback, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { FiBarChart2, FiGlobe, FiSend } from 'react-icons/fi'
import { AgentRail } from '../components/research/AgentRail'
import { ResearchResult } from '../components/research/ResearchResult'
import { agentSteps, generateResearch, languageOptions, samplePrompts } from '../data/research'
import { useAuth } from '../hooks/useAuth'

export function ResearchPage() {
  const location = useLocation()
  const { profile } = useAuth()
  const locationPrompt = location.state?.prompt
  const [input, setInput] = useState(locationPrompt || samplePrompts[0])
  const [language, setLanguage] = useState(profile?.language || 'English')
  const [isRunning, setIsRunning] = useState(false)
  const [activeRun, setActiveRun] = useState(null)
  const [activeStep, setActiveStep] = useState(0)

  const runResearch = useCallback((query = input) => {
    const trimmed = query.trim()
    if (!trimmed || isRunning) return

    setInput(trimmed)
    setIsRunning(true)
    setActiveStep(0)

    const timer = window.setInterval(() => {
      setActiveStep((step) => Math.min(step + 1, agentSteps.length - 1))
    }, 380)

    window.setTimeout(() => {
      window.clearInterval(timer)
      setActiveRun(generateResearch(trimmed, language))
      setIsRunning(false)
      setActiveStep(agentSteps.length - 1)
    }, 2100)
  }, [input, isRunning, language])

  return (
    <section className="research-page">
      <div className="research-hero">
        <div>
          <p className="eyebrow">Research</p>
          <h1>Investigate without the dashboard noise.</h1>
          <p>
            Ask a market question and ORCHIDE will simulate the planner, research agents,
            reasoning trace, citations, confidence, and multilingual response layer.
          </p>
        </div>
        <label className="language-select">
          <FiGlobe aria-hidden="true" />
          <select value={language} onChange={(event) => setLanguage(event.target.value)}>
            {languageOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
      </div>

      <form
        className="chat-input research-input"
        onSubmit={(event) => {
          event.preventDefault()
          runResearch()
        }}
      >
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask ORCHIDE about a sector, company, trend, or market signal..."
          rows={3}
        />
        <button type="submit" disabled={isRunning || !input.trim()}>
          <FiSend aria-hidden="true" />
          Run
        </button>
      </form>

      <div className="prompt-chips" aria-label="Example prompts">
        {samplePrompts.map((item) => (
          <button type="button" key={item} onClick={() => setInput(item)}>
            {item}
          </button>
        ))}
      </div>

      <AgentRail activeStep={activeStep} isRunning={isRunning} />
      {activeRun ? <ResearchResult run={activeRun} /> : <EmptyResearch />}
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

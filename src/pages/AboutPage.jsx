import { useNavigate } from 'react-router-dom'
import { FiSearch, FiSend } from 'react-icons/fi'
import { FeaturePanel } from '../components/ui/FeaturePanel'
import { ResearchMap } from '../components/research/ResearchMap'
import { featurePanels, marketSignals, samplePrompts } from '../data/research'
import { useState } from 'react'

export function AboutPage() {
  const navigate = useNavigate()
  const [prompt, setPrompt] = useState(samplePrompts[0])

  return (
    <section className="about-page">
      <div className="hero-band">
        <div className="hero-copy">
          <p className="eyebrow">Agentic market intelligence</p>
          <h1>Research that plans before it speaks.</h1>
          <p className="hero-text">
            ORCHIDE is a calm, source-backed research workspace for market discovery,
            financial intelligence, multilingual response, and voice-native investigation.
          </p>
          <div className="prompt-launcher" role="search">
            <FiSearch aria-hidden="true" />
            <input
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              aria-label="Research question"
            />
            <button type="button" onClick={() => navigate('/research', { state: { prompt } })}>
              <FiSend aria-hidden="true" />
              Start
            </button>
          </div>
          <div className="prompt-chips" aria-label="Example prompts">
            {samplePrompts.map((item) => (
              <button type="button" key={item} onClick={() => setPrompt(item)}>
                {item}
              </button>
            ))}
          </div>
        </div>
        <ResearchMap />
      </div>

      <section className="metrics-row" aria-label="System signals">
        {marketSignals.map((signal) => (
          <div className="metric" key={signal.label}>
            <span>{signal.label}</span>
            <strong>{signal.value}</strong>
          </div>
        ))}
      </section>

      <section className="principle-grid">
        {featurePanels.map((panel) => (
          <FeaturePanel key={panel.title} {...panel} />
        ))}
      </section>
    </section>
  )
}

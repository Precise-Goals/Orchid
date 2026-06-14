import { memo } from 'react'

export const ResearchResult = memo(function ResearchResult({ run }) {
  return (
    <article className="research-result">
      <div className="result-header">
        <div>
          <p className="eyebrow">{run.intent.replace('_', ' ')}</p>
          <h2>{run.query}</h2>
        </div>
        <div className="confidence">
          <span>{run.confidence}%</span>
          <small>confidence</small>
        </div>
      </div>
      <p className="summary">{run.summary}</p>
      <ul className="finding-list">
        {run.bullets.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>

      <section className="research-section">
        <h3>Key Findings</h3>
        <div className="insight-grid">
          {run.keyFindings.map((finding, index) => (
            <div className="insight-card" key={finding}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <p>{finding}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="snapshot-grid" aria-label="Research snapshot">
        {run.marketSnapshot.map((item) => (
          <div className="snapshot-card" key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </div>
        ))}
      </div>

      <section className="research-section">
        <h3>Research Brief</h3>
        <div className="brief-grid">
          {run.researchBrief.map((section) => (
            <article className="brief-card" key={section.title}>
              <h4>{section.title}</h4>
              <p>{section.text}</p>
            </article>
          ))}
        </div>
      </section>

      <div className="decision-grid">
        <section className="sources-panel compact-panel">
          <h3>Risks to Watch</h3>
          {run.risks.map((risk) => (
            <p className="check-row" key={risk}>{risk}</p>
          ))}
        </section>
        <section className="trace-panel compact-panel">
          <h3>Next Checks</h3>
          {run.nextSteps.map((step) => (
            <p className="check-row" key={step}>{step}</p>
          ))}
        </section>
      </div>

      <div className="result-grid">
        <section className="sources-panel">
          <h3>Sources</h3>
          {run.sources.map((source) => (
            <div className="source-row" key={source.title}>
              <div>
                <strong>{source.title}</strong>
                <small>{source.type} - {source.freshness}</small>
              </div>
              <span>{source.confidence}%</span>
            </div>
          ))}
        </section>
        <section className="trace-panel">
          <h3>Reasoning trace</h3>
          {run.trace.map((item, index) => (
            <div className="trace-row" key={item}>
              <span>{index + 1}</span>
              <p>{item}</p>
            </div>
          ))}
        </section>
      </div>
    </article>
  )
})

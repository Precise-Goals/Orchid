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

import { memo } from 'react'
import { FiGlobe } from 'react-icons/fi'
import { languageOptions } from '../../data/research'

export const ResearchHero = memo(function ResearchHero({ language, onLanguageChange }) {
  return (
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
        <select value={language} onChange={(event) => onLanguageChange(event.target.value)}>
          {languageOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </label>
    </div>
  )
})

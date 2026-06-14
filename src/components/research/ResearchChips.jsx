import { memo } from 'react'
import { samplePrompts } from '../../data/research'

export const ResearchChips = memo(function ResearchChips({ onSelect }) {
  return (
    <div className="prompt-chips" aria-label="Example prompts">
      {samplePrompts.map((item) => (
        <button type="button" key={item} onClick={() => onSelect(item)}>
          {item}
        </button>
      ))}
    </div>
  )
})

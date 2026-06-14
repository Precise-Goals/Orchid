import { memo } from 'react'
import { FiSend } from 'react-icons/fi'

export const ResearchInput = memo(function ResearchInput({ input, setInput, isRunning, onSubmit }) {
  return (
    <form
      className="chat-input research-input"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit()
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
        {isRunning ? 'Running' : 'Run'}
      </button>
    </form>
  )
})

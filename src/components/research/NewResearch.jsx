import { memo, useMemo, useState } from 'react'
import { FiSearch, FiGlobe, FiTrendingUp, FiBook } from 'react-icons/fi'
import { useAuth } from '../../hooks/useAuth'

export const NewResearch = memo(function NewResearch({ onStart }) {
  const { profile } = useAuth()
  const [input, setInput] = useState('')
  const [source, setSource] = useState('all')

  const greeting = useMemo(() => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (input.trim()) {
      onStart(input, source)
    }
  }

  return (
    <div className="new-research-container">
      <div className="new-research-content">
        <p className="eyebrow">Codex Research</p>
        <h1>{greeting}, {profile?.name?.split(' ')[0] || 'Researcher'}.</h1>
        <p className="sub-h1">What would you like to investigate today?</p>
        
        <form onSubmit={handleSubmit} className="new-research-input-wrapper">
          <div className="source-selector">
            <button 
              type="button" 
              className={source === 'all' ? 'active' : ''} 
              onClick={() => setSource('all')}
            >
              <FiGlobe /> All
            </button>
            <button 
              type="button" 
              className={source === 'gnews' ? 'active' : ''} 
              onClick={() => setSource('gnews')}
            >
              <FiBook /> GNews
            </button>
            <button 
              type="button" 
              className={source === 'yfinance' ? 'active' : ''} 
              onClick={() => setSource('yfinance')}
            >
              <FiTrendingUp /> YFinance
            </button>
            <button 
              type="button" 
              className={source === 'moneycontrol' ? 'active' : ''} 
              onClick={() => setSource('moneycontrol')}
            >
              <FiActivity /> Moneycontrol
            </button>
          </div>
          
          <div className="chat-input-large">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about markets, sectors, or trends..."
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e)
                }
              }}
            />
            <button type="submit" className="send-btn" disabled={!input.trim()}>
              <FiSearch />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
})

function FiActivity() {
  return (
    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
  )
}

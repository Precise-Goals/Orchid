import { useEffect, useRef, useState, Suspense, lazy } from 'react'
import { FiMic, FiX } from 'react-icons/fi'
import { generateResearch } from '../data/research'
import { useAuth } from '../hooks/useAuth'

const Spline = lazy(() => import('@splinetool/react-spline'))

export function VoicePage() {
  const recognitionRef = useRef(null)
  const { profile } = useAuth()
  const [voiceState, setVoiceState] = useState('idle')
  const supportsSpeech = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop?.()
      window.speechSynthesis?.cancel?.()
    }
  }, [])

  function startVoice() {
    if (!supportsSpeech) {
      setVoiceState('unsupported')
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.lang = profile?.language === 'Hindi' ? 'hi-IN' : 'en-IN'
    recognition.continuous = false
    recognition.interimResults = false
    recognition.onstart = () => setVoiceState('listening')
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      setVoiceState('thinking')
      window.setTimeout(() => {
        const run = generateResearch(transcript, profile?.language || 'English')
        speak(run.summary)
      }, 900)
    }
    recognition.onend = () => {
      setVoiceState((state) => (state === 'listening' ? 'idle' : state))
    }
    recognitionRef.current = recognition
    recognition.start()
  }

  function speak(text) {
    if (!('speechSynthesis' in window)) {
      setVoiceState('idle')
      return
    }
    window.speechSynthesis.cancel()
    const utterance = new SynthesisUtterance(text)
    utterance.lang = profile?.language === 'Hindi' ? 'hi-IN' : 'en-IN'
    utterance.rate = 0.95
    utterance.onstart = () => setVoiceState('speaking')
    utterance.onend = () => setVoiceState('idle')
    window.speechSynthesis.speak(utterance)
  }

  function cancelVoice() {
    recognitionRef.current?.stop?.()
    window.speechSynthesis?.cancel?.()
    setVoiceState('idle')
  }

  return (
    <section className="voice-minimal-page" aria-label="Voice research">
      <div className="voice-3d-container">
        <Suspense fallback={<div className="voice-loading">Loading Orb...</div>}>
          <Spline scene="/voice.splinecode" />
        </Suspense>
      </div>
      
      <div className="voice-minimal-actions">
        <button 
          type="button" 
          className={`voice-primary ${voiceState === 'listening' ? 'active' : ''}`} 
          onClick={startVoice} 
          aria-label="Start voice research"
        >
          <FiMic aria-hidden="true" />
        </button>
        <button 
          type="button" 
          className="voice-cancel" 
          onClick={cancelVoice} 
          aria-label="Cancel voice research"
        >
          <FiX aria-hidden="true" />
        </button>
      </div>

      <p className="voice-state-label">
        {voiceState === 'listening' && 'Listening...'}
        {voiceState === 'thinking' && 'Thinking...'}
        {voiceState === 'speaking' && 'Speaking...'}
        {voiceState === 'idle' && 'Tap to speak'}
        {voiceState === 'unsupported' && 'Voice not supported'}
      </p>
    </section>
  )
}

// Fallback for missing SpeechSynthesisUtterance in some environments during SSR/Testing
const SynthesisUtterance = typeof window !== 'undefined' ? window.SpeechSynthesisUtterance : class {}

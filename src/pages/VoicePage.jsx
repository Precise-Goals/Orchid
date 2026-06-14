import { useEffect, useRef, useState } from 'react'
import { FiMic, FiX } from 'react-icons/fi'
import { generateResearch } from '../data/research'
import { useAuth } from '../hooks/useAuth'

export function VoicePage() {
  const recognitionRef = useRef(null)
  const { profile } = useAuth()
  const [voiceState, setVoiceState] = useState('idle')
  const [lastAnswer, setLastAnswer] = useState('')
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
      setLastAnswer('Speech recognition is not available in this browser.')
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
        setLastAnswer(run.summary)
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
    const utterance = new SpeechSynthesisUtterance(text)
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
      <div className={`voice-model ${voiceState}`}>
        <div className="voice-ring ring-one"></div>
        <div className="voice-ring ring-two"></div>
        <div className="voice-ring ring-three"></div>
        <div className="voice-core">
          <FiMic aria-hidden="true" />
        </div>
      </div>
      <div className="voice-minimal-actions">
        <button type="button" className="voice-primary" onClick={startVoice} aria-label="Start voice research">
          <FiMic aria-hidden="true" />
        </button>
        <button type="button" className="voice-cancel" onClick={cancelVoice} aria-label="Cancel voice research">
          <FiX aria-hidden="true" />
        </button>
      </div>
      <p className="voice-state">
        {voiceState === 'unsupported'
          ? lastAnswer
          : voiceState === 'listening'
            ? 'Listening'
            : voiceState === 'thinking'
              ? 'Thinking'
              : voiceState === 'speaking'
                ? 'Speaking'
                : 'Ready'}
      </p>
    </section>
  )
}

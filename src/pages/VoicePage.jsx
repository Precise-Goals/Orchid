import { useEffect, useRef, useState, Suspense, lazy } from 'react'
import { FiMic } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { getGeminiPlan } from '../agents/planner'
import { synthesizeResearch } from '../agents/synthesizer'

const Spline = lazy(() => import('@splinetool/react-spline'))

export function VoicePage() {
  const recognitionRef = useRef(null)
  const { profile } = useAuth()
  const [voiceState, setVoiceState] = useState('idle')
  const [transcript, setTranscript] = useState('')
  const supportsSpeech = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop?.()
      window.speechSynthesis?.cancel?.()
    }
  }, [])

  // Greet the user when the page loads
  useEffect(() => {
    const firstName = profile?.name?.split(' ')[0] || 'there'
    const greeting = `Hello ${firstName}, hope you are doing well, how may I assist you today?`
    const timer = setTimeout(() => sarvamTTS(greeting), 600)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function sarvamTTS(text) {
    console.log('[Sarvam AI] Requesting synthesis (Shubh) for institutional brief...')
    
    try {
      const response = await fetch('https://api.sarvam.ai/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-subscription-key': import.meta.env.VITE_SARVAM_API_KEY
        },
        body: JSON.stringify({
          text: text,
          target_language_code: profile?.language === 'Hindi' ? 'hi-IN' : 'en-IN',
          speaker: 'shubh', 
          model: 'bulbul:v3',
          speech_sample_rate: 16000,
          enable_preprocessing: true,
          audio_format: 'mp3'
        })
      })

      if (response.ok) {
        const data = await response.json()
        const audio = new Audio(`data:audio/mpeg;base64,${data.audios[0]}`)
        audio.onplay = () => setVoiceState('speaking')
        audio.onended = () => setVoiceState('idle')
        await audio.play()
      } else {
        const errorData = await response.json()
        throw new Error(`TTS failed: ${errorData.message}`)
      }
    } catch (error) {
      console.error('[Sarvam AI] Error:', error)
      fallbackTTS(text)
    }
  }

  function fallbackTTS(text) {
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = profile?.language === 'Hindi' ? 'hi-IN' : 'en-IN'
    utterance.onstart = () => setVoiceState('speaking')
    utterance.onend = () => setVoiceState('idle')
    window.speechSynthesis.speak(utterance)
  }

  async function processQuery(text) {
    if (!text.trim()) return
    setVoiceState('thinking')
    try {
      console.log('[Orchid Intelligence] Starting Voice RAG Pipeline...')
      const plan = await getGeminiPlan(text)
      const result = await synthesizeResearch(text, plan.source_priority)
      console.log('%c[ORCHID VOICE RESULT]', 'color: #347c83; font-weight: bold;')
      console.log('Query:', text)
      console.log('Synthesis:', result.summary)
      sarvamTTS(result.summary)
    } catch (err) {
      console.error('[Orchid Error]:', err)
      sarvamTTS('An internal error occurred while processing your request.')
    }
  }

  function startVoice() {
    if (!supportsSpeech) {
      setVoiceState('unsupported')
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.lang = profile?.language === 'Hindi' ? 'hi-IN' : 'en-IN'
    recognition.continuous = false
    recognition.interimResults = true

    recognition.onstart = () => {
      setVoiceState('listening')
      setTranscript('')
    }

    recognition.onresult = (event) => {
      const current = event.results[0][0].transcript
      setTranscript(current)

      if (event.results[0].isFinal) {
        // Auto-triggered final result — process immediately
        processQuery(current)
      }
    }

    recognition.onend = () => {
      // Only reset to idle if we didn't move to thinking/speaking
      setVoiceState((state) => (state === 'listening' ? 'idle' : state))
    }

    recognitionRef.current = recognition
    recognition.start()
  }

  function handleMicClick() {
    if (voiceState === 'listening') {
      // User taps mic while listening → stop and process whatever was captured
      recognitionRef.current?.stop?.()
      if (transcript.trim()) {
        processQuery(transcript)
      } else {
        setVoiceState('idle')
      }
    } else if (voiceState === 'idle' || voiceState === 'unsupported') {
      startVoice()
    }
  }


  return (
    <motion.section 
      className="voice-minimal-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="voice-3d-container">
        <Suspense fallback={<div className="voice-loading">Loading Orb...</div>}>
          <Spline scene="/voice.splinecode" />
        </Suspense>
        
        <AnimatePresence>
          {transcript && (
            <motion.div 
              className="live-transcript"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {transcript}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="voice-minimal-actions">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          type="button"
          className={`voice-primary ${voiceState === 'listening' ? 'active' : ''}`}
          onClick={handleMicClick}
          aria-label={voiceState === 'listening' ? 'Stop and process' : 'Start listening'}
        >
          <FiMic aria-hidden="true" />
        </motion.button>
      </div>

      <motion.p 
        key={voiceState}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="voice-state-label"
      >
        {voiceState === 'listening' && 'Listening...'}
        {voiceState === 'thinking' && 'Analyzing...'}
        {voiceState === 'speaking' && 'Codex speaking (Shubh)'}
        {voiceState === 'idle' && 'Orchid Agent Ready'}
        {voiceState === 'unsupported' && 'Voice not supported'}
      </motion.p>
    </motion.section>
  )
}


import { useEffect, useRef, useState, Suspense, lazy } from 'react'
import { FiMic, FiX } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { getGeminiPlan } from '../agents/planner'
import { fetchLiveSignals } from '../agents/researcher'
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
    const utterance = new SynthesisUtterance(text)
    utterance.lang = profile?.language === 'Hindi' ? 'hi-IN' : 'en-IN'
    utterance.onstart = () => setVoiceState('speaking')
    utterance.onend = () => setVoiceState('idle')
    window.speechSynthesis.speak(utterance)
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

    recognition.onresult = async (event) => {
      const current = event.results[0][0].transcript
      setTranscript(current)
      
      if (event.results[0].isFinal) {
        setVoiceState('thinking')
        try {
          console.log('[Dual-LLM] Starting Voice RAG Pipeline...')
          const plan = await getGeminiPlan(current)
          const articles = await fetchLiveSignals(current, plan.source_priority)
          
          if (articles.length === 0) {
            sarvamTTS("I couldn't find any live signals for that request. Please try another query.")
            return
          }

          const result = await synthesizeResearch(current, articles)
          
          // Log results to console as requested
          console.log('%c[ORCHID VOICE RESULT]', 'color: #347c83; font-weight: bold;')
          console.log('Query:', current)
          console.log('Synthesis:', result.summary)
          
          sarvamTTS(result.summary)
        } catch (err) {
          console.error('[Orchid Error]:', err)
          sarvamTTS("An internal error occurred while processing your request.")
        }
      }
    }

    recognition.onend = () => {
      setVoiceState((state) => (state === 'listening' ? 'idle' : state))
    }
    
    recognitionRef.current = recognition
    recognition.start()
  }

  function cancelVoice() {
    recognitionRef.current?.stop?.()
    window.speechSynthesis?.cancel?.()
    setVoiceState('idle')
    setTranscript('')
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
          onClick={startVoice} 
        >
          <FiMic aria-hidden="true" />
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          type="button" 
          className="voice-cancel" 
          onClick={cancelVoice} 
        >
          <FiX aria-hidden="true" />
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

const SynthesisUtterance = typeof window !== 'undefined' ? window.SpeechSynthesisUtterance : class {}

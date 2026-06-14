import { useEffect, useRef, useState, Suspense, lazy } from 'react'
import { FiMic, FiX, FiVolume2 } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { generateResearch } from '../data/research'
import { useAuth } from '../hooks/useAuth'

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
    console.log('[Sarvam AI] Requesting synthesis for text:', text)
    console.log('[Sarvam AI] Using voice model: Shubh (Hindi/Multilingual)')
    
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
        console.log('[Sarvam AI] Synthesis successful, playing audio.')
      } else {
        const errorData = await response.json()
        console.error('[Sarvam AI] Error Response:', errorData)
        throw new Error(`Sarvam AI synthesis failed: ${errorData.message || response.statusText}`)
      }
    } catch (error) {
      console.error('[Sarvam AI] TTS Error:', error)
      fallbackTTS(text)
    }
  }

  function fallbackTTS(text) {
    console.log('[Codex] Falling back to Web Speech API for synthesis.')
    window.speechSynthesis.cancel()
    const utterance = new SynthesisUtterance(text)
    utterance.lang = profile?.language === 'Hindi' ? 'hi-IN' : 'en-IN'
    utterance.rate = 0.95
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

    recognition.onresult = (event) => {
      const current = event.results[0][0].transcript
      setTranscript(current)
      if (event.results[0].isFinal) {
        setVoiceState('thinking')
        const run = generateResearch(current, profile?.language || 'English')
        sarvamTTS(run.summary)
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

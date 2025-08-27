import React, { useState, useRef, useEffect } from 'react'
import { Word } from '@/types'
import { useApp } from '@/context/AppContext'
import './PronunciationPractice.css'

interface PronunciationExercise {
  id: string
  word: string
  pronunciation: string
  audioUrl?: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  tips: string[]
}

const pronunciationExercises: PronunciationExercise[] = [
  {
    id: 'pron-1',
    word: 'thought',
    pronunciation: '/θɔːt/',
    difficulty: 'intermediate',
    tips: [
      'Place your tongue between your teeth for the "th" sound',
      'The "ought" sound is like "aw" in "saw"',
      'Keep the sound short and crisp'
    ]
  },
  {
    id: 'pron-2',
    word: 'thoroughly',
    pronunciation: '/ˈθʌrəli/',
    difficulty: 'advanced',
    tips: [
      'Start with the "th" sound - tongue between teeth',
      'The middle syllable is unstressed',
      'End with a clear "lee" sound'
    ]
  },
  {
    id: 'pron-3',
    word: 'comfortable',
    pronunciation: '/ˈkʌmftəbəl/',
    difficulty: 'intermediate',
    tips: [
      'Often pronounced as three syllables: COM-fort-able',
      'The "t" in the middle can be silent',
      'Stress on the first syllable'
    ]
  },
  {
    id: 'pron-4',
    word: 'pronunciation',
    pronunciation: '/prəˌnʌnsiˈeɪʃən/',
    difficulty: 'advanced',
    tips: [
      'Four syllables: pro-nun-ci-a-tion',
      'Primary stress on "a" (4th syllable)',
      'Secondary stress on "nun" (2nd syllable)'
    ]
  },
  {
    id: 'pron-5',
    word: 'world',
    pronunciation: '/wɜːld/',
    difficulty: 'beginner',
    tips: [
      'The "or" sound is like "ur" in "burn"',
      'Don\'t pronounce it as "wor-ld" - it\'s one syllable',
      'End with a clear "d" sound'
    ]
  }
]

export const PronunciationPractice: React.FC = () => {
  const { addPoints } = useApp()
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [userRecording, setUserRecording] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [showTips, setShowTips] = useState(false)
  const [practiceMode, setPracticeMode] = useState<'listen' | 'record' | 'compare'>('listen')
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const synthRef = useRef<SpeechSynthesis | null>(null)

  const currentExercise = pronunciationExercises[currentExerciseIndex]

  useEffect(() => {
    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis
    }

    // Request microphone permission
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => {
          console.log('Microphone access granted')
        })
        .catch((error) => {
          console.warn('Microphone access denied:', error)
        })
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel()
      }
    }
  }, [])

  const playTargetPronunciation = () => {
    if (!synthRef.current) {
      console.warn('Speech synthesis not supported')
      return
    }

    setIsPlaying(true)
    synthRef.current.cancel() // Cancel any ongoing speech

    const utterance = new SpeechSynthesisUtterance(currentExercise.word)
    utterance.rate = 0.7 // Slower for learning
    utterance.pitch = 1
    utterance.volume = 1

    // Try to use a native English voice
    const voices = synthRef.current.getVoices()
    const englishVoice = voices.find(voice => 
      voice.lang.startsWith('en') && voice.localService
    )
    if (englishVoice) {
      utterance.voice = englishVoice
    }

    utterance.onend = () => {
      setIsPlaying(false)
    }

    utterance.onerror = () => {
      setIsPlaying(false)
      console.error('Speech synthesis error')
    }

    synthRef.current.speak(utterance)
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      audioChunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
        const audioUrl = URL.createObjectURL(audioBlob)
        setUserRecording(audioUrl)
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop())
        
        // Provide simple feedback
        provideFeedback()
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Error starting recording:', error)
      setFeedback('Unable to access microphone. Please check permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const playUserRecording = () => {
    if (userRecording) {
      const audio = new Audio(userRecording)
      audio.play()
    }
  }

  const provideFeedback = () => {
    // Simple encouraging feedback (in a real app, you'd use speech recognition)
    const feedbacks = [
      'Great effort! Keep practicing to improve your pronunciation.',
      'Good try! Listen to the target pronunciation again and compare.',
      'Nice work! Focus on the stress patterns and rhythm.',
      'Well done! Remember to practice the difficult sounds.',
      'Excellent attempt! Keep working on clarity and flow.'
    ]
    
    const randomFeedback = feedbacks[Math.floor(Math.random() * feedbacks.length)]
    setFeedback(randomFeedback)
    addPoints(5) // Give points for attempting
  }

  const nextExercise = () => {
    if (currentExerciseIndex < pronunciationExercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1)
    } else {
      setCurrentExerciseIndex(0)
    }
    
    // Reset state
    setUserRecording(null)
    setFeedback(null)
    setShowTips(false)
    setPracticeMode('listen')
  }

  const previousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(currentExerciseIndex - 1)
    } else {
      setCurrentExerciseIndex(pronunciationExercises.length - 1)
    }
    
    // Reset state
    setUserRecording(null)
    setFeedback(null)
    setShowTips(false)
    setPracticeMode('listen')
  }

  return (
    <div className="pronunciation-practice">
      <header className="practice-header">
        <h1>Pronunciation Practice</h1>
        <p>Improve your English pronunciation with guided exercises</p>
      </header>

      <div className="practice-container">
        <div className="exercise-navigation">
          <button onClick={previousExercise} className="nav-button">
            ⬅️ Previous
          </button>
          <span className="exercise-counter">
            {currentExerciseIndex + 1} of {pronunciationExercises.length}
          </span>
          <button onClick={nextExercise} className="nav-button">
            Next ➡️
          </button>
        </div>

        <div className="word-display">
          <h2 className="target-word">{currentExercise.word}</h2>
          <p className="phonetic-notation">{currentExercise.pronunciation}</p>
          <span className={`difficulty-badge ${currentExercise.difficulty}`}>
            {currentExercise.difficulty}
          </span>
        </div>

        <div className="practice-modes">
          <button
            className={`mode-btn ${practiceMode === 'listen' ? 'active' : ''}`}
            onClick={() => setPracticeMode('listen')}
          >
            👂 Listen
          </button>
          <button
            className={`mode-btn ${practiceMode === 'record' ? 'active' : ''}`}
            onClick={() => setPracticeMode('record')}
          >
            🎤 Record
          </button>
          <button
            className={`mode-btn ${practiceMode === 'compare' ? 'active' : ''}`}
            onClick={() => setPracticeMode('compare')}
            disabled={!userRecording}
          >
            🔄 Compare
          </button>
        </div>

        {practiceMode === 'listen' && (
          <div className="listen-mode">
            <div className="audio-controls">
              <button
                className={`play-button ${isPlaying ? 'playing' : ''}`}
                onClick={playTargetPronunciation}
                disabled={isPlaying}
              >
                {isPlaying ? '🔊 Playing...' : '🔊 Play Target'}
              </button>
            </div>
            <div className="instructions">
              <p>Listen carefully to the correct pronunciation</p>
              <p>Pay attention to stress patterns and individual sounds</p>
            </div>
          </div>
        )}

        {practiceMode === 'record' && (
          <div className="record-mode">
            <div className="recording-controls">
              {!isRecording ? (
                <button
                  className="record-button"
                  onClick={startRecording}
                >
                  🎤 Start Recording
                </button>
              ) : (
                <button
                  className="stop-button recording"
                  onClick={stopRecording}
                >
                  ⏹️ Stop Recording
                </button>
              )}
            </div>
            
            {isRecording && (
              <div className="recording-indicator">
                <div className="pulse-dot"></div>
                <span>Recording... Speak clearly!</span>
              </div>
            )}
            
            {userRecording && (
              <div className="user-recording">
                <button
                  className="play-recording-button"
                  onClick={playUserRecording}
                >
                  ▶️ Play My Recording
                </button>
              </div>
            )}
            
            <div className="instructions">
              <p>Click record and say the word clearly</p>
              <p>Try to match the rhythm and stress of the target</p>
            </div>
          </div>
        )}

        {practiceMode === 'compare' && userRecording && (
          <div className="compare-mode">
            <div className="comparison-controls">
              <button
                className="compare-button target"
                onClick={playTargetPronunciation}
              >
                🎯 Target Pronunciation
              </button>
              <button
                className="compare-button user"
                onClick={playUserRecording}
              >
                🎤 Your Pronunciation
              </button>
            </div>
            <div className="instructions">
              <p>Compare your pronunciation with the target</p>
              <p>Listen for differences in sounds, stress, and rhythm</p>
            </div>
          </div>
        )}

        {feedback && (
          <div className="feedback-section">
            <h3>Feedback</h3>
            <p>{feedback}</p>
            <button 
              className="try-again-button"
              onClick={() => {
                setFeedback(null)
                setUserRecording(null)
                setPracticeMode('listen')
              }}
            >
              Try Again
            </button>
          </div>
        )}

        <div className="tips-section">
          <button
            className="tips-toggle"
            onClick={() => setShowTips(!showTips)}
          >
            💡 {showTips ? 'Hide' : 'Show'} Pronunciation Tips
          </button>
          
          {showTips && (
            <div className="tips-content">
              <h4>Pronunciation Tips:</h4>
              <ul>
                {currentExercise.tips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="progress-actions">
          <button
            className="next-word-button"
            onClick={nextExercise}
          >
            Next Word →
          </button>
        </div>
      </div>
    </div>
  )
}
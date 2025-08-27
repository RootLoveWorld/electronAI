import React, { useState } from 'react'
import { GrammarRule, Exercise } from '@/types'
import { useApp } from '@/context/AppContext'
import { GrammarQuiz } from './GrammarQuiz'
import './GrammarModule.css'

// Sample grammar data
const sampleGrammarRules: GrammarRule[] = [
  {
    id: 'grammar-1',
    title: 'Present Simple Tense',
    description: 'Used for habits, general truths, and scheduled events.',
    examples: [
      'I work every day.',
      'She speaks English fluently.',
      'The sun rises in the east.',
      'The train leaves at 8 AM.'
    ],
    difficulty: 'beginner',
    exercises: [
      {
        id: 'ex-1',
        type: 'multiple-choice',
        question: 'Choose the correct form: She _____ to work by bus.',
        options: ['go', 'goes', 'going', 'went'],
        correctAnswer: 'goes',
        explanation: 'Use "goes" for third person singular in present simple.',
        points: 5
      },
      {
        id: 'ex-2',
        type: 'fill-blank',
        question: 'Fill in the blank: They _____ football every weekend.',
        correctAnswer: 'play',
        explanation: 'Use the base form "play" for plural subjects in present simple.',
        points: 5
      }
    ]
  },
  {
    id: 'grammar-2',
    title: 'Past Perfect Tense',
    description: 'Used to show that one action happened before another action in the past.',
    examples: [
      'I had finished my homework before dinner.',
      'She had already left when I arrived.',
      'They had lived there for 10 years before moving.',
      'Had you seen the movie before?'
    ],
    difficulty: 'intermediate',
    exercises: [
      {
        id: 'ex-3',
        type: 'multiple-choice',
        question: 'Choose the correct form: By the time I arrived, she _____ already.',
        options: ['left', 'had left', 'has left', 'was leaving'],
        correctAnswer: 'had left',
        explanation: 'Use past perfect "had left" for an action completed before another past action.',
        points: 8
      }
    ]
  }
]

export const GrammarModule: React.FC = () => {
  const { addPoints } = useApp()
  const [selectedRule, setSelectedRule] = useState<GrammarRule | null>(null)
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all')
  const [grammarMode, setGrammarMode] = useState<'lessons' | 'quizzes'>('lessons')

  const filteredRules = sampleGrammarRules.filter(rule => 
    selectedDifficulty === 'all' || rule.difficulty === selectedDifficulty
  )

  const startExercise = (exercise: Exercise) => {
    setCurrentExercise(exercise)
    setUserAnswer('')
    setShowResult(false)
    setIsCorrect(false)
  }

  const submitAnswer = () => {
    if (!currentExercise) return

    const correct = userAnswer.toLowerCase().trim() === currentExercise.correctAnswer.toLowerCase().trim()
    setIsCorrect(correct)
    setShowResult(true)
    
    if (correct) {
      addPoints(currentExercise.points)
    }
  }

  const nextExercise = () => {
    if (!selectedRule) return
    
    const currentIndex = selectedRule.exercises.findIndex(ex => ex.id === currentExercise?.id)
    const nextIndex = currentIndex + 1
    
    if (nextIndex < selectedRule.exercises.length) {
      startExercise(selectedRule.exercises[nextIndex])
    } else {
      setCurrentExercise(null)
    }
  }

  const renderRulesList = () => (
    <div className="grammar-rules-list">
      <div className="rules-header">
        <h2>Grammar Rules</h2>
        <select 
          value={selectedDifficulty}
          onChange={(e) => setSelectedDifficulty(e.target.value as any)}
          className="difficulty-filter"
        >
          <option value="all">All Levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>
      
      {filteredRules.map(rule => (
        <div key={rule.id} className="rule-card" onClick={() => setSelectedRule(rule)}>
          <h3>{rule.title}</h3>
          <p>{rule.description}</p>
          <div className="rule-meta">
            <span className={`difficulty-badge ${rule.difficulty}`}>
              {rule.difficulty}
            </span>
            <span className="exercises-count">
              {rule.exercises.length} exercises
            </span>
          </div>
        </div>
      ))}
    </div>
  )

  const renderRuleDetail = () => {
    if (!selectedRule) return null

    return (
      <div className="rule-detail">
        <button className="back-button" onClick={() => setSelectedRule(null)}>
          ← Back to Rules
        </button>
        
        <h2>{selectedRule.title}</h2>
        <p className="rule-description">{selectedRule.description}</p>
        
        <div className="examples-section">
          <h3>Examples</h3>
          <ul className="examples-list">
            {selectedRule.examples.map((example, index) => (
              <li key={index} className="example-item">{example}</li>
            ))}
          </ul>
        </div>
        
        <div className="exercises-section">
          <h3>Practice Exercises</h3>
          <div className="exercises-grid">
            {selectedRule.exercises.map((exercise, index) => (
              <div key={exercise.id} className="exercise-card">
                <h4>Exercise {index + 1}</h4>
                <p>{exercise.type.replace('-', ' ')}</p>
                <button 
                  className="start-exercise-button"
                  onClick={() => startExercise(exercise)}
                >
                  Start Exercise
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const renderExercise = () => {
    if (!currentExercise) return null

    return (
      <div className="exercise-modal">
        <div className="exercise-content">
          <button 
            className="close-exercise"
            onClick={() => setCurrentExercise(null)}
          >
            ✕
          </button>
          
          <h3>{currentExercise.type.replace('-', ' ')} Exercise</h3>
          <p className="exercise-question">{currentExercise.question}</p>
          
          {currentExercise.type === 'multiple-choice' && currentExercise.options && (
            <div className="multiple-choice-options">
              {currentExercise.options.map((option, index) => (
                <button
                  key={index}
                  className={`option-button ${userAnswer === option ? 'selected' : ''}`}
                  onClick={() => setUserAnswer(option)}
                  disabled={showResult}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
          
          {currentExercise.type === 'fill-blank' && (
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Type your answer here..."
              className="answer-input"
              disabled={showResult}
            />
          )}
          
          {!showResult && (
            <button 
              className="submit-button"
              onClick={submitAnswer}
              disabled={!userAnswer}
            >
              Submit Answer
            </button>
          )}
          
          {showResult && (
            <div className={`result ${isCorrect ? 'correct' : 'incorrect'}`}>
              <h4>{isCorrect ? '✅ Correct!' : '❌ Incorrect'}</h4>
              {!isCorrect && (
                <p>Correct answer: <strong>{currentExercise.correctAnswer}</strong></p>
              )}
              <p className="explanation">{currentExercise.explanation}</p>
              {isCorrect && (
                <p className="points">+{currentExercise.points} points!</p>
              )}
              <button className="next-button" onClick={nextExercise}>
                {selectedRule?.exercises.findIndex(ex => ex.id === currentExercise.id) === selectedRule?.exercises.length - 1 
                  ? 'Finish' 
                  : 'Next Exercise'
                }
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="grammar-module">
      <header className="module-header">
        <h1>Grammar Learning</h1>
        <p>Master English grammar with interactive lessons and quizzes</p>
      </header>

      <div className="grammar-mode-selector">
        <button
          className={`mode-btn ${grammarMode === 'lessons' ? 'active' : ''}`}
          onClick={() => setGrammarMode('lessons')}
        >
          📚 Lessons
        </button>
        <button
          className={`mode-btn ${grammarMode === 'quizzes' ? 'active' : ''}`}
          onClick={() => setGrammarMode('quizzes')}
        >
          🎯 Quizzes
        </button>
      </div>

      <div className="module-content">
        {grammarMode === 'lessons' ? (
          !selectedRule ? renderRulesList() : renderRuleDetail()
        ) : (
          <GrammarQuiz />
        )}
      </div>

      {currentExercise && renderExercise()}
    </div>
  )
}
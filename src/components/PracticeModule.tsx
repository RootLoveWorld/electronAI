import React, { useState } from 'react'
import { Exercise } from '@/types'
import { useApp } from '@/context/AppContext'
import './PracticeModule.css'

const practiceExercises: Exercise[] = [
  {
    id: 'practice-1',
    type: 'multiple-choice',
    question: 'What is the past tense of "go"?',
    options: ['goed', 'went', 'gone', 'going'],
    correctAnswer: 'went',
    explanation: 'The past tense of "go" is irregular and becomes "went".',
    points: 5
  },
  {
    id: 'practice-2',
    type: 'fill-blank',
    question: 'Complete the sentence: She _____ been working here for five years.',
    correctAnswer: 'has',
    explanation: 'Use "has" with present perfect tense for third person singular.',
    points: 6
  },
  {
    id: 'practice-3',
    type: 'translation',
    question: 'Translate to English: 我每天学习英语。',
    correctAnswer: 'I study English every day',
    explanation: 'This sentence uses present simple tense to express a daily habit.',
    points: 8
  },
  {
    id: 'practice-4',
    type: 'multiple-choice',
    question: 'Choose the correct word: The weather is _____ today.',
    options: ['beautifuly', 'beautiful', 'beauty', 'beautifully'],
    correctAnswer: 'beautiful',
    explanation: 'Use the adjective "beautiful" after the linking verb "is".',
    points: 5
  },
  {
    id: 'practice-5',
    type: 'pronunciation',
    question: 'How do you pronounce "throughout"?',
    correctAnswer: '/θruːˈaʊt/',
    explanation: 'The word "throughout" is pronounced with stress on the second syllable.',
    points: 7
  }
]

export const PracticeModule: React.FC = () => {
  const { addPoints } = useApp()
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [score, setScore] = useState(0)
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [practiceMode, setPracticeMode] = useState<'quiz' | 'review' | 'mixed'>('quiz')
  const [isQuizStarted, setIsQuizStarted] = useState(false)

  const currentExercise = practiceExercises[currentExerciseIndex]

  const startQuiz = () => {
    setIsQuizStarted(true)
    setCurrentExerciseIndex(0)
    setScore(0)
    setTotalQuestions(0)
    setUserAnswer('')
    setShowResult(false)
  }

  const submitAnswer = () => {
    if (!currentExercise) return

    const correct = userAnswer.toLowerCase().trim() === currentExercise.correctAnswer.toLowerCase().trim()
    setIsCorrect(correct)
    setShowResult(true)
    setTotalQuestions(totalQuestions + 1)
    
    if (correct) {
      setScore(score + 1)
      addPoints(currentExercise.points)
    }
  }

  const nextQuestion = () => {
    if (currentExerciseIndex < practiceExercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1)
      setUserAnswer('')
      setShowResult(false)
    } else {
      // Quiz finished
      setIsQuizStarted(false)
    }
  }

  const restartQuiz = () => {
    setCurrentExerciseIndex(0)
    setUserAnswer('')
    setShowResult(false)
    setScore(0)
    setTotalQuestions(0)
    setIsQuizStarted(true)
  }

  const renderQuizStart = () => (
    <div className="quiz-start">
      <h2>🎯 English Practice Quiz</h2>
      <p>Test your English skills with a variety of exercises!</p>
      
      <div className="quiz-info">
        <div className="info-item">
          <span className="info-icon">📝</span>
          <span>5 Questions</span>
        </div>
        <div className="info-item">
          <span className="info-icon">⏱️</span>
          <span>No time limit</span>
        </div>
        <div className="info-item">
          <span className="info-icon">⭐</span>
          <span>Earn points for correct answers</span>
        </div>
      </div>

      <div className="practice-modes">
        <h3>Choose Practice Mode:</h3>
        <div className="mode-buttons">
          <button
            className={`mode-button ${practiceMode === 'quiz' ? 'active' : ''}`}
            onClick={() => setPracticeMode('quiz')}
          >
            🎯 Quiz Mode
          </button>
          <button
            className={`mode-button ${practiceMode === 'review' ? 'active' : ''}`}
            onClick={() => setPracticeMode('review')}
          >
            📚 Review Mode
          </button>
          <button
            className={`mode-button ${practiceMode === 'mixed' ? 'active' : ''}`}
            onClick={() => setPracticeMode('mixed')}
          >
            🔀 Mixed Practice
          </button>
        </div>
      </div>

      <button className="start-quiz-button" onClick={startQuiz}>
        Start Practice Session
      </button>
    </div>
  )

  const renderQuizEnd = () => (
    <div className="quiz-end">
      <h2>🎉 Practice Complete!</h2>
      <div className="final-score">
        <h3>Your Score: {score} / {totalQuestions}</h3>
        <div className="score-percentage">
          {Math.round((score / totalQuestions) * 100)}%
        </div>
      </div>

      <div className="performance-feedback">
        {score === totalQuestions && (
          <div className="feedback perfect">
            <span className="feedback-icon">🏆</span>
            <span>Perfect score! Excellent work!</span>
          </div>
        )}
        {score >= totalQuestions * 0.8 && score < totalQuestions && (
          <div className="feedback great">
            <span className="feedback-icon">🌟</span>
            <span>Great job! You're doing very well!</span>
          </div>
        )}
        {score >= totalQuestions * 0.6 && score < totalQuestions * 0.8 && (
          <div className="feedback good">
            <span className="feedback-icon">👍</span>
            <span>Good effort! Keep practicing!</span>
          </div>
        )}
        {score < totalQuestions * 0.6 && (
          <div className="feedback needs-work">
            <span className="feedback-icon">💪</span>
            <span>Keep practicing! You'll improve with time!</span>
          </div>
        )}
      </div>

      <div className="quiz-actions">
        <button className="restart-button" onClick={restartQuiz}>
          🔄 Try Again
        </button>
        <button className="back-button" onClick={() => setIsQuizStarted(false)}>
          📚 Back to Practice
        </button>
      </div>
    </div>
  )

  const renderQuestion = () => (
    <div className="question-container">
      <div className="question-header">
        <span className="question-number">
          Question {currentExerciseIndex + 1} of {practiceExercises.length}
        </span>
        <span className="question-type">
          {currentExercise.type.replace('-', ' ')}
        </span>
      </div>

      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${((currentExerciseIndex + 1) / practiceExercises.length) * 100}%` }}
        ></div>
      </div>

      <h3 className="question-text">{currentExercise.question}</h3>

      {currentExercise.type === 'multiple-choice' && currentExercise.options && (
        <div className="multiple-choice-options">
          {currentExercise.options.map((option, index) => (
            <button
              key={index}
              className={`option-button ${userAnswer === option ? 'selected' : ''}`}
              onClick={() => setUserAnswer(option)}
              disabled={showResult}
            >
              {String.fromCharCode(65 + index)}. {option}
            </button>
          ))}
        </div>
      )}

      {(currentExercise.type === 'fill-blank' || 
        currentExercise.type === 'translation' || 
        currentExercise.type === 'pronunciation') && (
        <div className="text-answer">
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Type your answer here..."
            className="answer-input"
            disabled={showResult}
          />
        </div>
      )}

      {!showResult && (
        <button 
          className="submit-button"
          onClick={submitAnswer}
          disabled={!userAnswer.trim()}
        >
          Submit Answer
        </button>
      )}

      {showResult && (
        <div className={`result ${isCorrect ? 'correct' : 'incorrect'}`}>
          <div className="result-header">
            <span className="result-icon">{isCorrect ? '✅' : '❌'}</span>
            <span className="result-text">{isCorrect ? 'Correct!' : 'Incorrect'}</span>
          </div>
          
          {!isCorrect && (
            <p className="correct-answer">
              Correct answer: <strong>{currentExercise.correctAnswer}</strong>
            </p>
          )}
          
          <p className="explanation">{currentExercise.explanation}</p>
          
          {isCorrect && (
            <p className="points-earned">+{currentExercise.points} points!</p>
          )}
          
          <button className="next-button" onClick={nextQuestion}>
            {currentExerciseIndex === practiceExercises.length - 1 ? 'Finish' : 'Next Question'}
          </button>
        </div>
      )}
    </div>
  )

  return (
    <div className="practice-module">
      <header className="module-header">
        <h1>Practice & Quiz</h1>
        <p>Test and improve your English skills with interactive exercises</p>
      </header>

      <div className="practice-content">
        {!isQuizStarted && totalQuestions === 0 && renderQuizStart()}
        {isQuizStarted && renderQuestion()}
        {!isQuizStarted && totalQuestions > 0 && renderQuizEnd()}
      </div>
    </div>
  )
}
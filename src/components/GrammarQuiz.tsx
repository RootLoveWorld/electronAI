import React, { useState, useEffect } from 'react'
import { Exercise } from '@/types'
import { useApp } from '@/context/AppContext'
import './GrammarQuiz.css'

interface GrammarQuizData {
  id: string
  title: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  timeLimit?: number // in seconds
  exercises: Exercise[]
}

const grammarQuizzes: GrammarQuizData[] = [
  {
    id: 'quiz-tenses-basic',
    title: 'Basic Tenses',
    description: 'Test your understanding of present, past, and future tenses',
    difficulty: 'beginner',
    timeLimit: 300, // 5 minutes
    exercises: [
      {
        id: 'ex-tense-1',
        type: 'multiple-choice',
        question: 'She _____ to school every day.',
        options: ['go', 'goes', 'going', 'went'],
        correctAnswer: 'goes',
        explanation: 'Use "goes" for third person singular in present simple tense.',
        points: 5
      },
      {
        id: 'ex-tense-2',
        type: 'fill-blank',
        question: 'Yesterday, I _____ a movie at the cinema.',
        correctAnswer: 'watched',
        explanation: 'Use past tense "watched" for actions completed in the past.',
        points: 5
      },
      {
        id: 'ex-tense-3',
        type: 'multiple-choice',
        question: 'Tomorrow, we _____ visit our grandparents.',
        options: ['will', 'would', 'were', 'are'],
        correctAnswer: 'will',
        explanation: 'Use "will" to express future plans or intentions.',
        points: 5
      },
      {
        id: 'ex-tense-4',
        type: 'translation',
        question: 'Translate: "They are studying English now."',
        correctAnswer: 'They are studying English now',
        explanation: 'Present continuous tense shows actions happening right now.',
        points: 8
      }
    ]
  },
  {
    id: 'quiz-articles',
    title: 'Articles (a, an, the)',
    description: 'Master the use of definite and indefinite articles',
    difficulty: 'intermediate',
    timeLimit: 240,
    exercises: [
      {
        id: 'ex-art-1',
        type: 'multiple-choice',
        question: 'I saw _____ elephant at the zoo.',
        options: ['a', 'an', 'the', ''],
        correctAnswer: 'an',
        explanation: 'Use "an" before words starting with vowel sounds.',
        points: 6
      },
      {
        id: 'ex-art-2',
        type: 'fill-blank',
        question: '_____ sun rises in the east.',
        correctAnswer: 'The',
        explanation: 'Use "the" with unique objects like the sun, moon, earth.',
        points: 6
      },
      {
        id: 'ex-art-3',
        type: 'multiple-choice',
        question: 'She is _____ honest person.',
        options: ['a', 'an', 'the', ''],
        correctAnswer: 'an',
        explanation: 'Use "an" before words starting with vowel sounds (honest starts with "o" sound).',
        points: 7
      }
    ]
  },
  {
    id: 'quiz-conditionals',
    title: 'Conditional Sentences',
    description: 'Practice first, second, and third conditional structures',
    difficulty: 'advanced',
    timeLimit: 420,
    exercises: [
      {
        id: 'ex-cond-1',
        type: 'multiple-choice',
        question: 'If it _____ tomorrow, we will stay home.',
        options: ['rain', 'rains', 'rained', 'would rain'],
        correctAnswer: 'rains',
        explanation: 'First conditional: If + present simple, will + base verb.',
        points: 8
      },
      {
        id: 'ex-cond-2',
        type: 'fill-blank',
        question: 'If I _____ rich, I would travel the world.',
        correctAnswer: 'were',
        explanation: 'Second conditional: If + past simple, would + base verb. Use "were" for all persons with "if".',
        points: 9
      },
      {
        id: 'ex-cond-3',
        type: 'multiple-choice',
        question: 'If she _____ earlier, she wouldn\'t have missed the train.',
        options: ['left', 'had left', 'would leave', 'leaves'],
        correctAnswer: 'had left',
        explanation: 'Third conditional: If + past perfect, would have + past participle.',
        points: 10
      }
    ]
  }
]

export const GrammarQuiz: React.FC = () => {
  const { addPoints } = useApp()
  const [selectedQuiz, setSelectedQuiz] = useState<GrammarQuizData | null>(null)
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({})
  const [showResults, setShowResults] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
  const [quizStarted, setQuizStarted] = useState(false)
  const [userAnswer, setUserAnswer] = useState('')
  const [showExplanation, setShowExplanation] = useState(false)

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null
    
    if (quizStarted && timeRemaining !== null && timeRemaining > 0) {
      timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1)
      }, 1000)
    } else if (timeRemaining === 0) {
      // Time's up - finish quiz
      finishQuiz()
    }

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [timeRemaining, quizStarted])

  const startQuiz = (quiz: GrammarQuizData) => {
    setSelectedQuiz(quiz)
    setCurrentExerciseIndex(0)
    setUserAnswers({})
    setShowResults(false)
    setQuizStarted(true)
    setUserAnswer('')
    setShowExplanation(false)
    
    if (quiz.timeLimit) {
      setTimeRemaining(quiz.timeLimit)
    }
  }

  const submitAnswer = () => {
    if (!selectedQuiz || userAnswer.trim() === '') return

    const currentExercise = selectedQuiz.exercises[currentExerciseIndex]
    const newAnswers = {
      ...userAnswers,
      [currentExercise.id]: userAnswer.trim()
    }
    setUserAnswers(newAnswers)
    setShowExplanation(true)
  }

  const nextQuestion = () => {
    if (!selectedQuiz) return

    if (currentExerciseIndex < selectedQuiz.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1)
      setUserAnswer('')
      setShowExplanation(false)
    } else {
      finishQuiz()
    }
  }

  const finishQuiz = () => {
    setQuizStarted(false)
    setTimeRemaining(null)
    calculateResults()
    setShowResults(true)
  }

  const calculateResults = () => {
    if (!selectedQuiz) return

    let totalPoints = 0
    let earnedPoints = 0

    selectedQuiz.exercises.forEach(exercise => {
      totalPoints += exercise.points
      const userAnswer = userAnswers[exercise.id]
      if (userAnswer && userAnswer.toLowerCase().trim() === exercise.correctAnswer.toLowerCase().trim()) {
        earnedPoints += exercise.points
      }
    })

    addPoints(earnedPoints)
  }

  const resetQuiz = () => {
    setSelectedQuiz(null)
    setCurrentExerciseIndex(0)
    setUserAnswers({})
    setShowResults(false)
    setQuizStarted(false)
    setTimeRemaining(null)
    setUserAnswer('')
    setShowExplanation(false)
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getQuizResults = () => {
    if (!selectedQuiz) return { correct: 0, total: 0, percentage: 0 }

    let correct = 0
    const total = selectedQuiz.exercises.length

    selectedQuiz.exercises.forEach(exercise => {
      const userAnswer = userAnswers[exercise.id]
      if (userAnswer && userAnswer.toLowerCase().trim() === exercise.correctAnswer.toLowerCase().trim()) {
        correct++
      }
    })

    const percentage = Math.round((correct / total) * 100)
    return { correct, total, percentage }
  }

  const renderQuizSelection = () => (
    <div className="quiz-selection">
      <h2>Choose a Grammar Quiz</h2>
      <div className="quiz-grid">
        {grammarQuizzes.map(quiz => (
          <div key={quiz.id} className="quiz-card">
            <h3>{quiz.title}</h3>
            <p>{quiz.description}</p>
            <div className="quiz-meta">
              <span className={`difficulty-badge ${quiz.difficulty}`}>
                {quiz.difficulty}
              </span>
              <span className="exercise-count">
                {quiz.exercises.length} questions
              </span>
              {quiz.timeLimit && (
                <span className="time-limit">
                  ⏱️ {Math.floor(quiz.timeLimit / 60)} min
                </span>
              )}
            </div>
            <button
              className="start-quiz-btn"
              onClick={() => startQuiz(quiz)}
            >
              Start Quiz
            </button>
          </div>
        ))}
      </div>
    </div>
  )

  const renderQuizQuestion = () => {
    if (!selectedQuiz) return null

    const currentExercise = selectedQuiz.exercises[currentExerciseIndex]
    const isCorrect = userAnswers[currentExercise.id]?.toLowerCase().trim() === currentExercise.correctAnswer.toLowerCase().trim()

    return (
      <div className="quiz-question">
        <div className="quiz-header">
          <div className="quiz-progress">
            <span>Question {currentExerciseIndex + 1} of {selectedQuiz.exercises.length}</span>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${((currentExerciseIndex + 1) / selectedQuiz.exercises.length) * 100}%` }}
              />
            </div>
          </div>
          {timeRemaining !== null && (
            <div className={`timer ${timeRemaining < 60 ? 'warning' : ''}`}>
              ⏱️ {formatTime(timeRemaining)}
            </div>
          )}
        </div>

        <h3 className="question-text">{currentExercise.question}</h3>

        {currentExercise.type === 'multiple-choice' && currentExercise.options && (
          <div className="options-container">
            {currentExercise.options.map((option, index) => (
              <button
                key={index}
                className={`option-btn ${userAnswer === option ? 'selected' : ''}`}
                onClick={() => setUserAnswer(option)}
                disabled={showExplanation}
              >
                {String.fromCharCode(65 + index)}. {option}
              </button>
            ))}
          </div>
        )}

        {(currentExercise.type === 'fill-blank' || currentExercise.type === 'translation') && (
          <div className="text-input-container">
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Type your answer here..."
              disabled={showExplanation}
              className="answer-input"
            />
          </div>
        )}

        {!showExplanation && (
          <button
            className="submit-btn"
            onClick={submitAnswer}
            disabled={!userAnswer.trim()}
          >
            Submit Answer
          </button>
        )}

        {showExplanation && (
          <div className={`explanation ${isCorrect ? 'correct' : 'incorrect'}`}>
            <div className="result-header">
              <span className="result-icon">{isCorrect ? '✅' : '❌'}</span>
              <span className="result-text">{isCorrect ? 'Correct!' : 'Incorrect'}</span>
            </div>
            {!isCorrect && (
              <p className="correct-answer">
                Correct answer: <strong>{currentExercise.correctAnswer}</strong>
              </p>
            )}
            <p className="explanation-text">{currentExercise.explanation}</p>
            {isCorrect && (
              <p className="points-earned">+{currentExercise.points} points!</p>
            )}
            <button className="next-btn" onClick={nextQuestion}>
              {currentExerciseIndex === selectedQuiz.exercises.length - 1 ? 'Finish Quiz' : 'Next Question'}
            </button>
          </div>
        )}
      </div>
    )
  }

  const renderResults = () => {
    if (!selectedQuiz) return null

    const results = getQuizResults()
    const passed = results.percentage >= 70

    return (
      <div className="quiz-results">
        <h2>Quiz Complete!</h2>
        <div className={`score-display ${passed ? 'passed' : 'failed'}`}>
          <div className="score-circle">
            <span className="percentage">{results.percentage}%</span>
          </div>
          <p className="score-text">
            {results.correct} out of {results.total} correct
          </p>
        </div>

        <div className={`performance-message ${passed ? 'success' : 'needs-improvement'}`}>
          {passed ? (
            <div>
              <span className="icon">🎉</span>
              <span>Excellent work! You have a good understanding of this grammar topic.</span>
            </div>
          ) : (
            <div>
              <span className="icon">📚</span>
              <span>Keep practicing! Review the explanations and try again to improve.</span>
            </div>
          )}
        </div>

        <div className="detailed-results">
          <h3>Review Your Answers</h3>
          {selectedQuiz.exercises.map((exercise, index) => {
            const userAnswer = userAnswers[exercise.id] || 'No answer'
            const isCorrect = userAnswer.toLowerCase().trim() === exercise.correctAnswer.toLowerCase().trim()
            
            return (
              <div key={exercise.id} className="result-item">
                <div className="question-review">
                  <span className="question-number">Q{index + 1}:</span>
                  <span className="question-text">{exercise.question}</span>
                </div>
                <div className={`answer-review ${isCorrect ? 'correct' : 'incorrect'}`}>
                  <span className="answer-label">Your answer:</span>
                  <span className="user-answer">{userAnswer}</span>
                  {!isCorrect && (
                    <>
                      <span className="answer-label">Correct answer:</span>
                      <span className="correct-answer">{exercise.correctAnswer}</span>
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <div className="result-actions">
          <button className="retry-btn" onClick={() => startQuiz(selectedQuiz)}>
            Retry Quiz
          </button>
          <button className="back-btn" onClick={resetQuiz}>
            Choose Another Quiz
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="grammar-quiz">
      <header className="quiz-header-main">
        <h1>Grammar Quizzes</h1>
        <p>Test your grammar knowledge with timed quizzes</p>
      </header>

      <div className="quiz-content">
        {!selectedQuiz && renderQuizSelection()}
        {selectedQuiz && !showResults && renderQuizQuestion()}
        {selectedQuiz && showResults && renderResults()}
      </div>
    </div>
  )
}
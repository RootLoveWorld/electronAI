import React, { useState } from 'react'
import { Word } from '@/types'
import './Flashcard.css'

interface FlashcardProps {
  word: Word
  onMastered: (wordId: string) => void
  onDifficult: (wordId: string) => void
  onPlayPronunciation: (word: string) => void
}

export const Flashcard: React.FC<FlashcardProps> = ({
  word,
  onMastered,
  onDifficult,
  onPlayPronunciation
}) => {
  const [isFlipped, setIsFlipped] = useState(false)
  const [showTranslation, setShowTranslation] = useState(false)

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const handleMastered = () => {
    onMastered(word.id)
    setIsFlipped(false)
    setShowTranslation(false)
  }

  const handleDifficult = () => {
    onDifficult(word.id)
    setIsFlipped(false)
    setShowTranslation(false)
  }

  return (
    <div className="flashcard-wrapper">
      <div className={`flashcard ${isFlipped ? 'flipped' : ''}`} onClick={handleFlip}>
        <div className="flashcard-front">
          <div className="word-display">
            <h2 className="word-text">{word.word}</h2>
            <button 
              className="pronunciation-button"
              onClick={(e) => {
                e.stopPropagation()
                onPlayPronunciation(word.word)
              }}
            >
              🔊
            </button>
          </div>
          <p className="pronunciation-text">{word.pronunciation}</p>
          <div className="difficulty-indicator">
            <span className={`difficulty-badge ${word.difficulty}`}>
              {word.difficulty}
            </span>
          </div>
          <p className="flip-hint">Click to see definition</p>
        </div>

        <div className="flashcard-back">
          <div className="definition-section">
            <h3>Definition</h3>
            <p className="definition-text">{word.definition}</p>
          </div>

          <div className="example-section">
            <h3>Example</h3>
            <p className="example-text">"{word.example}"</p>
          </div>

          {word.translation && (
            <div className="translation-section">
              <button 
                className="translation-toggle"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowTranslation(!showTranslation)
                }}
              >
                {showTranslation ? 'Hide Translation' : 'Show Translation'}
              </button>
              {showTranslation && (
                <p className="translation-text">{word.translation}</p>
              )}
            </div>
          )}

          <div className="category-info">
            <span className="category-badge">{word.category}</span>
          </div>
        </div>
      </div>

      <div className="flashcard-actions">
        <button 
          className="action-button difficult"
          onClick={handleDifficult}
          title="Mark as difficult - needs more practice"
        >
          😅 Difficult
        </button>
        
        <button 
          className="action-button flip"
          onClick={handleFlip}
        >
          🔄 Flip
        </button>
        
        <button 
          className="action-button mastered"
          onClick={handleMastered}
          title="Mark as mastered - I know this word"
        >
          ✅ Mastered
        </button>
      </div>

      <div className="study-tips">
        <p>💡 <strong>Study Tip:</strong> Try to recall the definition before flipping the card!</p>
      </div>
    </div>
  )
}
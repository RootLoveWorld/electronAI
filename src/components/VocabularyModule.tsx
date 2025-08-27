import React, { useState, useEffect } from 'react'
import { Word } from '@/types'
import { useApp } from '@/context/AppContext'
import { Flashcard } from './Flashcard'
import './VocabularyModule.css'

// Sample vocabulary data
const sampleWords: Word[] = [
  {
    id: 'word-1',
    word: 'abundant',
    pronunciation: '/əˈbʌndənt/',
    definition: 'Existing in large quantities; more than enough',
    example: 'The garden has abundant flowers in spring.',
    difficulty: 'intermediate',
    category: 'adjectives',
    translation: '丰富的，充足的'
  },
  {
    id: 'word-2',
    word: 'meticulous',
    pronunciation: '/məˈtɪkjələs/',
    definition: 'Showing great attention to detail; very careful and precise',
    example: 'She was meticulous in her research work.',
    difficulty: 'advanced',
    category: 'adjectives',
    translation: '细致的，一丝不苟的'
  },
  {
    id: 'word-3',
    word: 'collaborate',
    pronunciation: '/kəˈlæbəreɪt/',
    definition: 'To work jointly on an activity or project',
    example: 'Scientists from different countries collaborate on research.',
    difficulty: 'intermediate',
    category: 'verbs',
    translation: '合作，协作'
  },
  {
    id: 'word-4',
    word: 'serendipity',
    pronunciation: '/ˌserənˈdɪpəti/',
    definition: 'The occurrence of events by chance in a happy way',
    example: 'Finding that book was pure serendipity.',
    difficulty: 'advanced',
    category: 'nouns',
    translation: '意外发现，机缘巧合'
  },
  {
    id: 'word-5',
    word: 'eloquent',
    pronunciation: '/ˈeləkwənt/',
    definition: 'Fluent and persuasive in speaking or writing',
    example: 'She gave an eloquent speech about climate change.',
    difficulty: 'intermediate',
    category: 'adjectives',
    translation: '雄辩的，有说服力的'
  }
]

export const VocabularyModule: React.FC = () => {
  const { state, addMasteredWord, addWeakWord, addPoints } = useApp()
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [words, setWords] = useState<Word[]>(sampleWords)
  const [studyMode, setStudyMode] = useState<'flashcards' | 'list' | 'quiz'>('flashcards')
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const filteredWords = words.filter(word => {
    const difficultyMatch = selectedDifficulty === 'all' || word.difficulty === selectedDifficulty
    const categoryMatch = selectedCategory === 'all' || word.category === selectedCategory
    return difficultyMatch && categoryMatch
  })

  const categories = ['all', ...Array.from(new Set(words.map(word => word.category)))]

  const handleWordMastered = (wordId: string) => {
    addMasteredWord(wordId)
    addPoints(10)
    nextWord()
  }

  const handleWordDifficult = (wordId: string) => {
    addWeakWord(wordId)
    nextWord()
  }

  const nextWord = () => {
    if (currentWordIndex < filteredWords.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1)
    } else {
      setCurrentWordIndex(0)
    }
  }

  const previousWord = () => {
    if (currentWordIndex > 0) {
      setCurrentWordIndex(currentWordIndex - 1)
    } else {
      setCurrentWordIndex(filteredWords.length - 1)
    }
  }

  const playPronunciation = async (word: string) => {
    if (window.electronAPI) {
      try {
        // This would use a text-to-speech API or local audio files
        console.log(`Playing pronunciation for: ${word}`)
        // await window.electronAPI.playAudio(`pronunciation-${word}.mp3`)
      } catch (error) {
        console.error('Failed to play pronunciation:', error)
      }
    }
  }

  const renderFlashcardMode = () => {
    if (filteredWords.length === 0) {
      return (
        <div className="no-words">
          <p>No words match your current filters.</p>
        </div>
      )
    }

    const currentWord = filteredWords[currentWordIndex]

    return (
      <div className="flashcard-container">
        <div className="flashcard-header">
          <span className="word-counter">
            {currentWordIndex + 1} of {filteredWords.length}
          </span>
          <div className="flashcard-controls">
            <button onClick={previousWord} className="nav-button">
              ⬅️ Previous
            </button>
            <button onClick={nextWord} className="nav-button">
              Next ➡️
            </button>
          </div>
        </div>

        <Flashcard
          word={currentWord}
          onMastered={handleWordMastered}
          onDifficult={handleWordDifficult}
          onPlayPronunciation={playPronunciation}
        />
      </div>
    )
  }

  const renderListMode = () => {
    return (
      <div className="word-list">
        {filteredWords.map((word, index) => (
          <div key={word.id} className="word-item">
            <div className="word-header">
              <h3 className="word-title">{word.word}</h3>
              <button 
                className="pronunciation-button"
                onClick={() => playPronunciation(word.word)}
              >
                🔊
              </button>
            </div>
            <p className="word-pronunciation">{word.pronunciation}</p>
            <p className="word-definition">{word.definition}</p>
            <p className="word-example">"{word.example}"</p>
            <div className="word-meta">
              <span className={`difficulty-badge ${word.difficulty}`}>
                {word.difficulty}
              </span>
              <span className="category-badge">{word.category}</span>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="vocabulary-module">
      <header className="module-header">
        <h1>Vocabulary Learning</h1>
        <p>Expand your English vocabulary with interactive flashcards</p>
      </header>

      <div className="module-controls">
        <div className="study-mode-selector">
          <button
            className={`mode-button ${studyMode === 'flashcards' ? 'active' : ''}`}
            onClick={() => setStudyMode('flashcards')}
          >
            📚 Flashcards
          </button>
          <button
            className={`mode-button ${studyMode === 'list' ? 'active' : ''}`}
            onClick={() => setStudyMode('list')}
          >
            📋 List View
          </button>
          <button
            className={`mode-button ${studyMode === 'quiz' ? 'active' : ''}`}
            onClick={() => setStudyMode('quiz')}
          >
            🎯 Quiz
          </button>
        </div>

        <div className="filters">
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value as any)}
            className="filter-select"
          >
            <option value="all">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="module-content">
        {studyMode === 'flashcards' && renderFlashcardMode()}
        {studyMode === 'list' && renderListMode()}
        {studyMode === 'quiz' && (
          <div className="quiz-placeholder">
            <p>Quiz mode coming soon! 🚧</p>
          </div>
        )}
      </div>
    </div>
  )
}
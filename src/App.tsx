import React, { useEffect, useState } from 'react'
import { AppProvider } from '@/context/AppContext'
import { Dashboard } from '@/components/Dashboard'
import { VocabularyModule } from '@/components/VocabularyModule'
import { GrammarModule } from '@/components/GrammarModule'
import { PracticeModule } from '@/components/PracticeModule'
import { PronunciationPractice } from '@/components/PronunciationPractice'
import { ProgressView } from '@/components/ProgressView'
import { Settings } from '@/components/Settings'
import { Navigation } from '@/components/Navigation'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { ViewType } from '@/types'
import './App.css'

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard')
  const [isInitializing, setIsInitializing] = useState(true)

  useEffect(() => {
    // Initialize the app
    const initializeApp = async () => {
      try {
        // Load user progress from Electron store
        if (window.electronAPI) {
          const progress = await window.electronAPI.loadProgress()
          console.log('Loaded user progress:', progress)
        }
        
        // Set up any initial data or configurations
        await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate loading
        
      } catch (error) {
        console.error('Failed to initialize app:', error)
      } finally {
        setIsInitializing(false)
      }
    }

    initializeApp()
  }, [])

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />
      case 'vocabulary':
        return <VocabularyModule />
      case 'grammar':
        return <GrammarModule />
      case 'practice':
        return <PracticeModule />
      case 'pronunciation':
        return <PronunciationPractice />
      case 'progress':
        return <ProgressView />
      case 'settings':
        return <Settings />
      default:
        return <Dashboard />
    }
  }

  if (isInitializing) {
    return (
      <div className="app-loading">
        <LoadingSpinner />
        <h2>Initializing English Learning App...</h2>
      </div>
    )
  }

  return (
    <AppProvider>
      <div className="app">
        <Navigation currentView={currentView} onViewChange={setCurrentView} />
        <main className="app-main">
          {renderCurrentView()}
        </main>
      </div>
    </AppProvider>
  )
}

export default App
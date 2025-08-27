import { useEffect } from 'react'
import { useApp } from '@/context/AppContext'
import { ProgressTracker } from '@/utils/progressTracker'
import { StudySession } from '@/types'

export const useProgressTracking = () => {
  const { state, setUser } = useApp()
  const progressTracker = ProgressTracker.getInstance()

  // Initialize progress on app start
  useEffect(() => {
    if (!state.user) {
      const savedProgress = progressTracker.loadProgress()
      if (savedProgress) {
        setUser(savedProgress)
      }
    }
  }, [state.user, setUser, progressTracker])

  // Record a study session
  const recordStudySession = (session: StudySession) => {
    if (state.user) {
      const updatedProgress = progressTracker.recordStudySession(state.user, session)
      setUser(updatedProgress)
      return updatedProgress
    }
    return null
  }

  // Add a mastered word
  const addMasteredWord = (wordId: string) => {
    if (state.user) {
      const updatedProgress = progressTracker.addMasteredWord(state.user, wordId)
      setUser(updatedProgress)
      return updatedProgress
    }
    return null
  }

  // Add a weak word for review
  const addWeakWord = (wordId: string) => {
    if (state.user) {
      const updatedProgress = progressTracker.addWeakWord(state.user, wordId)
      setUser(updatedProgress)
      return updatedProgress
    }
    return null
  }

  // Get study statistics
  const getStatistics = () => {
    if (state.user) {
      return progressTracker.getStudyStatistics(state.user)
    }
    return null
  }

  // Export progress data
  const exportProgress = () => {
    if (state.user) {
      return progressTracker.exportProgress(state.user)
    }
    return null
  }

  // Import progress data
  const importProgress = (data: string) => {
    const imported = progressTracker.importProgress(data)
    if (imported) {
      setUser(imported)
      return true
    }
    return false
  }

  // Clear all progress
  const clearProgress = () => {
    const defaultProgress = progressTracker.clearProgress()
    setUser(defaultProgress)
    return defaultProgress
  }

  // Get daily progress percentage
  const getDailyProgress = () => {
    if (state.user) {
      return progressTracker.getDailyProgress(state.user)
    }
    return 0
  }

  return {
    user: state.user,
    recordStudySession,
    addMasteredWord,
    addWeakWord,
    getStatistics,
    exportProgress,
    importProgress,
    clearProgress,
    getDailyProgress
  }
}
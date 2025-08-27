import React, { createContext, useContext, useReducer, ReactNode } from 'react'
import { AppState, UserProgress, Lesson, StudySession, ViewType } from '@/types'

// Action types
type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_USER'; payload: UserProgress | null }
  | { type: 'SET_CURRENT_LESSON'; payload: Lesson | null }
  | { type: 'SET_CURRENT_SESSION'; payload: StudySession | null }
  | { type: 'UPDATE_PROGRESS'; payload: Partial<UserProgress> }
  | { type: 'ADD_MASTERED_WORD'; payload: string }
  | { type: 'ADD_WEAK_WORD'; payload: string }
  | { type: 'UPDATE_STREAK'; payload: number }
  | { type: 'ADD_POINTS'; payload: number }

// Initial state
const initialState: AppState = {
  user: null,
  currentLesson: null,
  currentSession: null,
  isLoading: false,
  error: null,
}

// Reducer
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    
    case 'SET_USER':
      return { ...state, user: action.payload }
    
    case 'SET_CURRENT_LESSON':
      return { ...state, currentLesson: action.payload }
    
    case 'SET_CURRENT_SESSION':
      return { ...state, currentSession: action.payload }
    
    case 'UPDATE_PROGRESS':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null
      }
    
    case 'ADD_MASTERED_WORD':
      return {
        ...state,
        user: state.user ? {
          ...state.user,
          masteredWords: [...state.user.masteredWords, action.payload]
        } : null
      }
    
    case 'ADD_WEAK_WORD':
      return {
        ...state,
        user: state.user ? {
          ...state.user,
          weakWords: [...state.user.weakWords, action.payload]
        } : null
      }
    
    case 'UPDATE_STREAK':
      return {
        ...state,
        user: state.user ? {
          ...state.user,
          streakDays: action.payload
        } : null
      }
    
    case 'ADD_POINTS':
      return {
        ...state,
        user: state.user ? {
          ...state.user,
          totalPoints: state.user.totalPoints + action.payload
        } : null
      }
    
    default:
      return state
  }
}

// Context
interface AppContextType {
  state: AppState
  dispatch: React.Dispatch<AppAction>
  // Helper functions
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setUser: (user: UserProgress | null) => void
  setCurrentLesson: (lesson: Lesson | null) => void
  addMasteredWord: (wordId: string) => void
  addWeakWord: (wordId: string) => void
  addPoints: (points: number) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

// Provider component
interface AppProviderProps {
  children: ReactNode
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // Helper functions
  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading })
  }

  const setError = (error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error })
  }

  const setUser = (user: UserProgress | null) => {
    dispatch({ type: 'SET_USER', payload: user })
  }

  const setCurrentLesson = (lesson: Lesson | null) => {
    dispatch({ type: 'SET_CURRENT_LESSON', payload: lesson })
  }

  const addMasteredWord = (wordId: string) => {
    dispatch({ type: 'ADD_MASTERED_WORD', payload: wordId })
  }

  const addWeakWord = (wordId: string) => {
    dispatch({ type: 'ADD_WEAK_WORD', payload: wordId })
  }

  const addPoints = (points: number) => {
    dispatch({ type: 'ADD_POINTS', payload: points })
  }

  const value: AppContextType = {
    state,
    dispatch,
    setLoading,
    setError,
    setUser,
    setCurrentLesson,
    addMasteredWord,
    addWeakWord,
    addPoints,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

// Custom hook
export const useApp = (): AppContextType => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
// Global type definitions for the English Learning App

export interface ElectronAPI {
  getAppVersion: () => Promise<string>
  saveProgress: (data: any) => Promise<{ success: boolean; error?: string }>
  loadProgress: () => Promise<UserProgress | null>
  exportProgress: (data: any) => Promise<{ success: boolean; path?: string; error?: string; canceled?: boolean }>
  importProgress: (filePath: string) => Promise<UserProgress | null>
  saveSettings: (settings: any) => Promise<{ success: boolean; error?: string }>
  loadSettings: () => Promise<AppSettings | null>
  playAudio: (audioPath: string) => Promise<{ success: boolean; error?: string }>
  selectFile: () => Promise<string | null>
  minimizeWindow: () => Promise<void>
  maximizeWindow: () => Promise<void>
  closeWindow: () => Promise<void>
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}

// Learning content types
export interface Word {
  id: string
  word: string
  pronunciation: string
  definition: string
  example: string
  audioUrl?: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  category: string
  translation?: string
}

export interface GrammarRule {
  id: string
  title: string
  description: string
  examples: string[]
  exercises: Exercise[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

export interface Exercise {
  id: string
  type: 'multiple-choice' | 'fill-blank' | 'translation' | 'pronunciation'
  question: string
  options?: string[]
  correctAnswer: string
  explanation: string
  points: number
}

export interface Lesson {
  id: string
  title: string
  description: string
  words: Word[]
  grammar?: GrammarRule[]
  exercises: Exercise[]
  estimatedTime: number // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

// User progress tracking
export interface UserProgress {
  userId: string
  currentLevel: 'beginner' | 'intermediate' | 'advanced'
  totalPoints: number
  streakDays: number
  lastStudyDate: string
  completedLessons: string[]
  masteredWords: string[]
  weakWords: string[]
  timeSpent: number // in minutes
  achievements: Achievement[]
  dailyGoal: number // in minutes
  weeklyStats: WeeklyStats
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  earnedDate: string
  points: number
}

export interface WeeklyStats {
  week: string
  lessonsCompleted: number
  wordsLearned: number
  timeSpent: number
  accuracy: number
}

// Study session types
export interface StudySession {
  id: string
  startTime: string
  endTime?: string
  lessonId: string
  wordsStudied: string[]
  exercisesCompleted: number
  correctAnswers: number
  totalAnswers: number
  pointsEarned: number
}

// App state types
export interface AppState {
  user: UserProgress | null
  currentLesson: Lesson | null
  currentSession: StudySession | null
  isLoading: boolean
  error: string | null
}

// Navigation types
export type ViewType = 'dashboard' | 'vocabulary' | 'grammar' | 'practice' | 'pronunciation' | 'progress' | 'settings'

export interface NavigationItem {
  id: ViewType
  title: string
  icon: string
  path: string
}

// Settings types
export interface AppSettings {
  theme: 'light' | 'dark' | 'auto'
  language: 'en' | 'zh-CN' | 'zh-TW'
  autoPlay: boolean
  showTranslations: boolean
  dailyReminder: boolean
  reminderTime: string
  soundEnabled: boolean
  animationsEnabled: boolean
}
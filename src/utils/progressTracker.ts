import { UserProgress, StudySession, WeeklyStats, Achievement } from '@/types'

export class ProgressTracker {
  private static instance: ProgressTracker
  private readonly STORAGE_KEY = 'english-learning-progress'

  private constructor() {}

  static getInstance(): ProgressTracker {
    if (!ProgressTracker.instance) {
      ProgressTracker.instance = new ProgressTracker()
    }
    return ProgressTracker.instance
  }

  // Load progress from localStorage
  loadProgress(): UserProgress | null {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY)
      if (saved) {
        const progress = JSON.parse(saved) as UserProgress
        return this.migrateProgressData(progress)
      }
    } catch (error) {
      console.error('Error loading progress:', error)
    }
    return this.createDefaultProgress()
  }

  // Save progress to localStorage
  saveProgress(progress: UserProgress): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(progress))
    } catch (error) {
      console.error('Error saving progress:', error)
    }
  }

  // Create default progress for new users
  createDefaultProgress(): UserProgress {
    const now = new Date().toISOString()
    return {
      userId: this.generateUserId(),
      currentLevel: 'beginner',
      totalPoints: 0,
      streakDays: 0,
      lastStudyDate: now,
      completedLessons: [],
      masteredWords: [],
      weakWords: [],
      timeSpent: 0,
      achievements: [],
      dailyGoal: 30, // 30 minutes
      weeklyStats: this.initializeWeeklyStats()
    }
  }

  // Update study session and calculate statistics
  recordStudySession(progress: UserProgress, session: StudySession): UserProgress {
    const updatedProgress = { ...progress }
    
    // Update time spent
    const sessionDuration = session.endTime 
      ? new Date(session.endTime).getTime() - new Date(session.startTime).getTime()
      : 0
    const minutesSpent = Math.floor(sessionDuration / (1000 * 60))
    updatedProgress.timeSpent += minutesSpent

    // Update points
    updatedProgress.totalPoints += session.pointsEarned

    // Update words studied
    session.wordsStudied.forEach(wordId => {
      if (!updatedProgress.masteredWords.includes(wordId)) {
        updatedProgress.masteredWords.push(wordId)
      }
    })

    // Update streak
    updatedProgress.streakDays = this.calculateStreak(updatedProgress)
    updatedProgress.lastStudyDate = session.startTime

    // Update weekly stats
    updatedProgress.weeklyStats = this.updateWeeklyStats(updatedProgress.weeklyStats, session)

    // Check for new achievements
    const newAchievements = this.checkAchievements(updatedProgress)
    updatedProgress.achievements = [...updatedProgress.achievements, ...newAchievements]

    // Update level based on points
    updatedProgress.currentLevel = this.calculateLevel(updatedProgress.totalPoints)

    this.saveProgress(updatedProgress)
    return updatedProgress
  }

  // Add a mastered word
  addMasteredWord(progress: UserProgress, wordId: string): UserProgress {
    const updatedProgress = { ...progress }
    
    if (!updatedProgress.masteredWords.includes(wordId)) {
      updatedProgress.masteredWords.push(wordId)
      
      // Remove from weak words if present
      updatedProgress.weakWords = updatedProgress.weakWords.filter(id => id !== wordId)
      
      // Award points for mastering a word
      updatedProgress.totalPoints += 10
    }

    this.saveProgress(updatedProgress)
    return updatedProgress
  }

  // Add a weak word for review
  addWeakWord(progress: UserProgress, wordId: string): UserProgress {
    const updatedProgress = { ...progress }
    
    if (!updatedProgress.weakWords.includes(wordId)) {
      updatedProgress.weakWords.push(wordId)
    }

    this.saveProgress(updatedProgress)
    return updatedProgress
  }

  // Calculate current streak
  private calculateStreak(progress: UserProgress): number {
    const today = new Date()
    const lastStudy = new Date(progress.lastStudyDate)
    const dayDiff = Math.floor((today.getTime() - lastStudy.getTime()) / (1000 * 60 * 60 * 24))
    
    if (dayDiff === 0) {
      // Same day - maintain streak
      return progress.streakDays
    } else if (dayDiff === 1) {
      // Consecutive day - increase streak
      return progress.streakDays + 1
    } else {
      // Gap in studying - reset streak
      return 1
    }
  }

  // Calculate user level based on points
  private calculateLevel(points: number): 'beginner' | 'intermediate' | 'advanced' {
    if (points < 500) return 'beginner'
    if (points < 2000) return 'intermediate'
    return 'advanced'
  }

  // Initialize weekly stats
  private initializeWeeklyStats(): WeeklyStats {
    const today = new Date()
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay())
    
    return {
      week: startOfWeek.toISOString().split('T')[0],
      lessonsCompleted: 0,
      wordsLearned: 0,
      timeSpent: 0,
      accuracy: 0
    }
  }

  // Update weekly statistics
  private updateWeeklyStats(currentStats: WeeklyStats, session: StudySession): WeeklyStats {
    const today = new Date()
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay())
    const weekKey = startOfWeek.toISOString().split('T')[0]

    // Check if we need to reset weekly stats
    if (currentStats.week !== weekKey) {
      return {
        week: weekKey,
        lessonsCompleted: session.lessonId ? 1 : 0,
        wordsLearned: session.wordsStudied.length,
        timeSpent: session.endTime 
          ? Math.floor((new Date(session.endTime).getTime() - new Date(session.startTime).getTime()) / (1000 * 60))
          : 0,
        accuracy: session.totalAnswers > 0 ? (session.correctAnswers / session.totalAnswers) * 100 : 0
      }
    }

    // Update existing weekly stats
    const sessionDuration = session.endTime 
      ? Math.floor((new Date(session.endTime).getTime() - new Date(session.startTime).getTime()) / (1000 * 60))
      : 0

    return {
      ...currentStats,
      lessonsCompleted: currentStats.lessonsCompleted + (session.lessonId ? 1 : 0),
      wordsLearned: currentStats.wordsLearned + session.wordsStudied.length,
      timeSpent: currentStats.timeSpent + sessionDuration,
      accuracy: session.totalAnswers > 0 
        ? ((currentStats.accuracy * currentStats.lessonsCompleted + (session.correctAnswers / session.totalAnswers) * 100) / (currentStats.lessonsCompleted + 1))
        : currentStats.accuracy
    }
  }

  // Check for new achievements
  private checkAchievements(progress: UserProgress): Achievement[] {
    const newAchievements: Achievement[] = []
    const now = new Date().toISOString()

    // Achievement definitions
    const achievements = [
      {
        id: 'first-word',
        title: 'First Word',
        description: 'Learn your first word',
        condition: () => progress.masteredWords.length >= 1,
        points: 10,
        icon: '🎯'
      },
      {
        id: 'word-collector',
        title: 'Word Collector',
        description: 'Learn 10 words',
        condition: () => progress.masteredWords.length >= 10,
        points: 50,
        icon: '📚'
      },
      {
        id: 'word-master',
        title: 'Word Master',
        description: 'Learn 50 words',
        condition: () => progress.masteredWords.length >= 50,
        points: 200,
        icon: '🏆'
      },
      {
        id: 'vocabulary-expert',
        title: 'Vocabulary Expert',
        description: 'Learn 100 words',
        condition: () => progress.masteredWords.length >= 100,
        points: 500,
        icon: '🎓'
      },
      {
        id: 'streak-starter',
        title: 'Streak Starter',
        description: 'Study for 3 days in a row',
        condition: () => progress.streakDays >= 3,
        points: 30,
        icon: '🔥'
      },
      {
        id: 'streak-master',
        title: 'Streak Master',
        description: 'Study for 7 days in a row',
        condition: () => progress.streakDays >= 7,
        points: 100,
        icon: '🌟'
      },
      {
        id: 'dedicated-learner',
        title: 'Dedicated Learner',
        description: 'Study for 30 days in a row',
        condition: () => progress.streakDays >= 30,
        points: 500,
        icon: '💎'
      },
      {
        id: 'point-collector',
        title: 'Point Collector',
        description: 'Earn 500 points',
        condition: () => progress.totalPoints >= 500,
        points: 50,
        icon: '⭐'
      },
      {
        id: 'high-achiever',
        title: 'High Achiever',
        description: 'Earn 1000 points',
        condition: () => progress.totalPoints >= 1000,
        points: 100,
        icon: '🏅'
      },
      {
        id: 'time-tracker',
        title: 'Time Tracker',
        description: 'Study for 10 hours total',
        condition: () => progress.timeSpent >= 600, // 10 hours in minutes
        points: 100,
        icon: '⏰'
      }
    ]

    // Check which achievements are newly earned
    achievements.forEach(achievement => {
      const alreadyEarned = progress.achievements.some(earned => earned.id === achievement.id)
      if (!alreadyEarned && achievement.condition()) {
        newAchievements.push({
          id: achievement.id,
          title: achievement.title,
          description: achievement.description,
          icon: achievement.icon,
          earnedDate: now,
          points: achievement.points
        })
        
        // Add achievement points to total
        progress.totalPoints += achievement.points
      }
    })

    return newAchievements
  }

  // Migrate old progress data format
  private migrateProgressData(progress: any): UserProgress {
    // Add any missing fields with defaults
    return {
      userId: progress.userId || this.generateUserId(),
      currentLevel: progress.currentLevel || 'beginner',
      totalPoints: progress.totalPoints || 0,
      streakDays: progress.streakDays || 0,
      lastStudyDate: progress.lastStudyDate || new Date().toISOString(),
      completedLessons: progress.completedLessons || [],
      masteredWords: progress.masteredWords || [],
      weakWords: progress.weakWords || [],
      timeSpent: progress.timeSpent || 0,
      achievements: progress.achievements || [],
      dailyGoal: progress.dailyGoal || 30,
      weeklyStats: progress.weeklyStats || this.initializeWeeklyStats()
    }
  }

  // Generate unique user ID
  private generateUserId(): string {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  }

  // Get daily progress percentage
  getDailyProgress(progress: UserProgress): number {
    const today = new Date().toDateString()
    const lastStudyDay = new Date(progress.lastStudyDate).toDateString()
    
    if (today !== lastStudyDay) {
      return 0 // No study today
    }
    
    // This is a simplified calculation - in a real app you'd track today's specific time
    const todayMinutes = progress.timeSpent % progress.dailyGoal
    return Math.min((todayMinutes / progress.dailyGoal) * 100, 100)
  }

  // Get study statistics for different time periods
  getStudyStatistics(progress: UserProgress) {
    return {
      totalWords: progress.masteredWords.length,
      weakWords: progress.weakWords.length,
      totalTime: progress.timeSpent,
      currentStreak: progress.streakDays,
      totalPoints: progress.totalPoints,
      achievementsCount: progress.achievements.length,
      currentLevel: progress.currentLevel,
      dailyGoalProgress: this.getDailyProgress(progress)
    }
  }

  // Export progress data
  exportProgress(progress: UserProgress): string {
    return JSON.stringify(progress, null, 2)
  }

  // Import progress data
  importProgress(data: string): UserProgress | null {
    try {
      const imported = JSON.parse(data) as UserProgress
      const migrated = this.migrateProgressData(imported)
      this.saveProgress(migrated)
      return migrated
    } catch (error) {
      console.error('Error importing progress:', error)
      return null
    }
  }

  // Clear all progress data
  clearProgress(): UserProgress {
    const defaultProgress = this.createDefaultProgress()
    this.saveProgress(defaultProgress)
    return defaultProgress
  }
}
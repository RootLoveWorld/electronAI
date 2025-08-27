import React from 'react'
import { useApp } from '@/context/AppContext'
import './ProgressView.css'

export const ProgressView: React.FC = () => {
  const { state } = useApp()

  // Mock data for demonstration
  const progressData = {
    wordsLearned: state.user?.masteredWords.length || 47,
    streak: state.user?.streakDays || 12,
    totalPoints: state.user?.totalPoints || 850,
    timeSpent: state.user?.timeSpent || 420, // in minutes
    lessonsCompleted: state.user?.completedLessons.length || 8,
    weakWords: state.user?.weakWords.length || 15,
    currentLevel: state.user?.currentLevel || 'intermediate',
    dailyGoal: state.user?.dailyGoal || 30
  }

  const weeklyData = [
    { day: 'Mon', minutes: 45, wordsLearned: 8 },
    { day: 'Tue', minutes: 30, wordsLearned: 5 },
    { day: 'Wed', minutes: 60, wordsLearned: 12 },
    { day: 'Thu', minutes: 25, wordsLearned: 6 },
    { day: 'Fri', minutes: 40, wordsLearned: 7 },
    { day: 'Sat', minutes: 55, wordsLearned: 10 },
    { day: 'Sun', minutes: 35, wordsLearned: 8 }
  ]

  const achievements = [
    { id: 1, title: 'First Steps', description: 'Complete your first lesson', earned: true },
    { id: 2, title: 'Word Master', description: 'Learn 50 new words', earned: false, progress: '47/50' },
    { id: 3, title: 'Streak Master', description: 'Study for 7 days in a row', earned: true },
    { id: 4, title: 'Grammar Guru', description: 'Complete 10 grammar exercises', earned: false, progress: '6/10' },
    { id: 5, title: 'Pronunciation Pro', description: 'Practice pronunciation 20 times', earned: false, progress: '12/20' }
  ]

  const maxMinutes = Math.max(...weeklyData.map(d => d.minutes))
  const maxWords = Math.max(...weeklyData.map(d => d.wordsLearned))

  return (
    <div className="progress-view">
      <header className="progress-header">
        <h1>Your Learning Progress</h1>
        <p>Track your English learning journey and celebrate your achievements!</p>
      </header>

      <div className="stats-overview">
        <div className="stat-card primary">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <h3>{progressData.wordsLearned}</h3>
            <p>Words Learned</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-content">
            <h3>{progressData.streak}</h3>
            <p>Day Streak</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <h3>{progressData.totalPoints}</h3>
            <p>Total Points</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏰</div>
          <div className="stat-content">
            <h3>{Math.floor(progressData.timeSpent / 60)}h {progressData.timeSpent % 60}m</h3>
            <p>Time Spent</p>
          </div>
        </div>
      </div>

      <div className="progress-content">
        <div className="left-column">
          <div className="weekly-chart">
            <h3>This Week's Activity</h3>
            <div className="chart-container">
              <div className="chart-bars">
                {weeklyData.map((day, index) => (
                  <div key={index} className="bar-group">
                    <div className="bar-container">
                      <div 
                        className="bar minutes-bar"
                        style={{ height: `${(day.minutes / maxMinutes) * 100}%` }}
                        title={`${day.minutes} minutes`}
                      ></div>
                      <div 
                        className="bar words-bar"
                        style={{ height: `${(day.wordsLearned / maxWords) * 100}%` }}
                        title={`${day.wordsLearned} words`}
                      ></div>
                    </div>
                    <span className="day-label">{day.day}</span>
                  </div>
                ))}
              </div>
              <div className="chart-legend">
                <div className="legend-item">
                  <div className="legend-color minutes"></div>
                  <span>Minutes Studied</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color words"></div>
                  <span>Words Learned</span>
                </div>
              </div>
            </div>
          </div>

          <div className="level-progress">
            <h3>Current Level: {progressData.currentLevel}</h3>
            <div className="level-bar">
              <div className="level-fill" style={{ width: '65%' }}></div>
            </div>
            <p>65% to next level</p>
          </div>

          <div className="study-areas">
            <h3>Study Areas</h3>
            <div className="area-list">
              <div className="area-item">
                <span className="area-name">Vocabulary</span>
                <div className="area-progress">
                  <div className="area-bar">
                    <div className="area-fill" style={{ width: '75%' }}></div>
                  </div>
                  <span className="area-percentage">75%</span>
                </div>
              </div>
              <div className="area-item">
                <span className="area-name">Grammar</span>
                <div className="area-progress">
                  <div className="area-bar">
                    <div className="area-fill" style={{ width: '60%' }}></div>
                  </div>
                  <span className="area-percentage">60%</span>
                </div>
              </div>
              <div className="area-item">
                <span className="area-name">Pronunciation</span>
                <div className="area-progress">
                  <div className="area-bar">
                    <div className="area-fill" style={{ width: '45%' }}></div>
                  </div>
                  <span className="area-percentage">45%</span>
                </div>
              </div>
              <div className="area-item">
                <span className="area-name">Listening</span>
                <div className="area-progress">
                  <div className="area-bar">
                    <div className="area-fill" style={{ width: '50%' }}></div>
                  </div>
                  <span className="area-percentage">50%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="right-column">
          <div className="achievements">
            <h3>Achievements</h3>
            <div className="achievements-list">
              {achievements.map(achievement => (
                <div 
                  key={achievement.id} 
                  className={`achievement-item ${achievement.earned ? 'earned' : 'locked'}`}
                >
                  <div className="achievement-icon">
                    {achievement.earned ? '🏆' : '🔒'}
                  </div>
                  <div className="achievement-content">
                    <h4>{achievement.title}</h4>
                    <p>{achievement.description}</p>
                    {!achievement.earned && achievement.progress && (
                      <span className="achievement-progress">{achievement.progress}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="weak-words">
            <h3>Words to Review</h3>
            <p>Focus on these {progressData.weakWords} words that need more practice:</p>
            <div className="weak-words-list">
              <span className="weak-word">challenging</span>
              <span className="weak-word">sophisticated</span>
              <span className="weak-word">acknowledge</span>
              <span className="weak-word">phenomenon</span>
              <span className="weak-word">prerequisite</span>
            </div>
            <button className="review-button">Review These Words</button>
          </div>

          <div className="goals">
            <h3>Goals</h3>
            <div className="goal-item">
              <span className="goal-text">Daily Study Goal</span>
              <span className="goal-value">{progressData.dailyGoal} minutes</span>
            </div>
            <div className="goal-item">
              <span className="goal-text">Weekly Target</span>
              <span className="goal-value">50 new words</span>
            </div>
            <div className="goal-item">
              <span className="goal-text">Monthly Challenge</span>
              <span className="goal-value">Complete 20 lessons</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
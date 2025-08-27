import React from 'react'
import { useApp } from '@/context/AppContext'
import './Dashboard.css'

export const Dashboard: React.FC = () => {
  const { state } = useApp()

  const stats = {
    wordsLearned: state.user?.masteredWords.length || 0,
    streak: state.user?.streakDays || 0,
    totalPoints: state.user?.totalPoints || 0,
    timeSpent: state.user?.timeSpent || 0
  }

  const dailyGoal = state.user?.dailyGoal || 30
  const todayProgress = Math.min((stats.timeSpent % dailyGoal) / dailyGoal * 100, 100)

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Welcome back! 👋</h1>
        <p>Ready to continue your English learning journey?</p>
      </header>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <h3>{stats.wordsLearned}</h3>
            <p>Words Learned</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-content">
            <h3>{stats.streak}</h3>
            <p>Day Streak</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <h3>{stats.totalPoints}</h3>
            <p>Total Points</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏰</div>
          <div className="stat-content">
            <h3>{Math.floor(stats.timeSpent / 60)}h {stats.timeSpent % 60}m</h3>
            <p>Time Spent</p>
          </div>
        </div>
      </div>

      <div className="daily-goal">
        <h3>Today's Goal</h3>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${todayProgress}%` }}
          ></div>
        </div>
        <p>{Math.floor(todayProgress)}% of {dailyGoal} minutes completed</p>
      </div>

      <div className="quick-actions">
        <h3>Quick Start</h3>
        <div className="action-cards">
          <div className="action-card">
            <div className="action-icon">📖</div>
            <h4>Learn New Words</h4>
            <p>Expand your vocabulary with flashcards</p>
            <button className="action-button">Start Learning</button>
          </div>

          <div className="action-card">
            <div className="action-icon">📝</div>
            <h4>Grammar Practice</h4>
            <p>Improve your grammar skills</p>
            <button className="action-button">Practice Now</button>
          </div>

          <div className="action-card">
            <div className="action-icon">🎯</div>
            <h4>Take Quiz</h4>
            <p>Test your knowledge</p>
            <button className="action-button">Start Quiz</button>
          </div>

          <div className="action-card">
            <div className="action-icon">🗣️</div>
            <h4>Pronunciation</h4>
            <p>Practice speaking English</p>
            <button className="action-button">Practice</button>
          </div>
        </div>
      </div>

      <div className="recent-activity">
        <h3>Recent Activity</h3>
        <div className="activity-list">
          <div className="activity-item">
            <span className="activity-icon">✅</span>
            <span className="activity-text">Completed "Basic Greetings" lesson</span>
            <span className="activity-time">2 hours ago</span>
          </div>
          <div className="activity-item">
            <span className="activity-icon">📚</span>
            <span className="activity-text">Learned 5 new words</span>
            <span className="activity-time">1 day ago</span>
          </div>
          <div className="activity-item">
            <span className="activity-icon">🏆</span>
            <span className="activity-text">Earned "Word Master" achievement</span>
            <span className="activity-time">2 days ago</span>
          </div>
        </div>
      </div>
    </div>
  )
}
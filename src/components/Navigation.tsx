import React from 'react'
import { ViewType, NavigationItem } from '@/types'
import './Navigation.css'

interface NavigationProps {
  currentView: ViewType
  onViewChange: (view: ViewType) => void
}

const navigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: '🏠',
    path: '/dashboard'
  },
  {
    id: 'vocabulary',
    title: 'Vocabulary',
    icon: '📖',
    path: '/vocabulary'
  },
  {
    id: 'grammar',
    title: 'Grammar',
    icon: '📝',
    path: '/grammar'
  },
  {
    id: 'practice',
    title: 'Practice',
    icon: '🎯',
    path: '/practice'
  },
  {
    id: 'pronunciation',
    title: 'Pronunciation',
    icon: '🗣️',
    path: '/pronunciation'
  },
  {
    id: 'progress',
    title: 'Progress',
    icon: '📊',
    path: '/progress'
  },
  {
    id: 'settings',
    title: 'Settings',
    icon: '⚙️',
    path: '/settings'
  }
]

export const Navigation: React.FC<NavigationProps> = ({ currentView, onViewChange }) => {
  return (
    <nav className="navigation">
      <div className="navigation-header">
        <div className="app-logo">
          <span className="logo-icon">🎓</span>
          <h1 className="app-title">English Learning</h1>
        </div>
      </div>
      
      <ul className="navigation-menu">
        {navigationItems.map((item) => (
          <li key={item.id} className="navigation-item">
            <button
              className={`navigation-button ${currentView === item.id ? 'active' : ''}`}
              onClick={() => onViewChange(item.id)}
            >
              <span className="navigation-icon">{item.icon}</span>
              <span className="navigation-text">{item.title}</span>
            </button>
          </li>
        ))}
      </ul>
      
      <div className="navigation-footer">
        <div className="user-info">
          <div className="user-avatar">👤</div>
          <div className="user-details">
            <span className="user-name">Student</span>
            <span className="user-level">Beginner</span>
          </div>
        </div>
      </div>
    </nav>
  )
}
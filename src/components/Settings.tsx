import React, { useState, useEffect } from 'react'
import { AppSettings } from '@/types'
import { ElectronStorageService } from '@/utils/electronStorage'
import { useProgressTracking } from '@/hooks/useProgressTracking'
import './Settings.css'

export const Settings: React.FC = () => {
  const { exportProgress, importProgress, clearProgress } = useProgressTracking()
  const storageService = ElectronStorageService.getInstance()
  const [settings, setSettings] = useState<AppSettings>({
    theme: 'light',
    language: 'en',
    autoPlay: true,
    showTranslations: true,
    dailyReminder: true,
    reminderTime: '09:00',
    soundEnabled: true,
    animationsEnabled: true
  })

  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    // Load settings on component mount
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const savedSettings = await storageService.loadSettings()
      if (savedSettings) {
        setSettings(savedSettings)
        // Apply theme immediately
        document.documentElement.setAttribute('data-theme', savedSettings.theme)
      }
    } catch (error) {
      console.error('Failed to load settings:', error)
    }
  }

  const handleSettingChange = <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const saveSettings = async () => {
    setIsSaving(true)
    setMessage(null)
    
    try {
      const success = await storageService.saveSettings(settings)
      
      if (success) {
        // Apply theme immediately
        document.documentElement.setAttribute('data-theme', settings.theme)
        setMessage({ type: 'success', text: 'Settings saved successfully!' })
      } else {
        setMessage({ type: 'error', text: 'Failed to save settings. Please try again.' })
      }
      
    } catch (error) {
      console.error('Failed to save settings:', error)
      setMessage({ type: 'error', text: 'An error occurred while saving settings.' })
    } finally {
      setIsSaving(false)
      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const resetSettings = () => {
    setSettings({
      theme: 'light',
      language: 'en',
      autoPlay: true,
      showTranslations: true,
      dailyReminder: true,
      reminderTime: '09:00',
      soundEnabled: true,
      animationsEnabled: true
    })
  }

  const handleExportData = async () => {
    try {
      const progressData = exportProgress()
      if (progressData) {
        const result = await storageService.createBackup(JSON.parse(progressData), settings)
        if (result) {
          setMessage({ type: 'success', text: 'Data exported successfully!' })
        } else {
          setMessage({ type: 'error', text: 'Failed to export data.' })
        }
      }
    } catch (error) {
      console.error('Export failed:', error)
      setMessage({ type: 'error', text: 'Export failed. Please try again.' })
    }
    setTimeout(() => setMessage(null), 3000)
  }

  const handleImportData = async () => {
    try {
      const restored = await storageService.restoreBackup()
      if (restored) {
        if (restored.progress) {
          const success = importProgress(JSON.stringify(restored.progress))
          if (success && restored.settings) {
            setSettings(restored.settings)
            await storageService.saveSettings(restored.settings)
          }
          setMessage({ type: 'success', text: 'Data imported successfully!' })
        } else {
          setMessage({ type: 'error', text: 'Invalid backup file format.' })
        }
      } else {
        setMessage({ type: 'error', text: 'Failed to import data or operation cancelled.' })
      }
    } catch (error) {
      console.error('Import failed:', error)
      setMessage({ type: 'error', text: 'Import failed. Please check the file format.' })
    }
    setTimeout(() => setMessage(null), 3000)
  }

  const handleClearAllData = async () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      try {
        clearProgress()
        await storageService.clearAllData()
        resetSettings()
        setMessage({ type: 'success', text: 'All data cleared successfully!' })
      } catch (error) {
        console.error('Clear data failed:', error)
        setMessage({ type: 'error', text: 'Failed to clear data.' })
      }
      setTimeout(() => setMessage(null), 3000)
    }
  }

  return (
    <div className="settings">
      <header className="settings-header">
        <h1>Settings</h1>
        <p>Customize your English learning experience</p>
      </header>

      <div className="settings-content">
        <div className="settings-section">
          <h3>Appearance</h3>
          <div className="setting-item">
            <label>Theme</label>
            <select
              value={settings.theme}
              onChange={(e) => handleSettingChange('theme', e.target.value as any)}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto (System)</option>
            </select>
          </div>

          <div className="setting-item">
            <label>Enable Animations</label>
            <input
              type="checkbox"
              checked={settings.animationsEnabled}
              onChange={(e) => handleSettingChange('animationsEnabled', e.target.checked)}
            />
          </div>
        </div>

        <div className="settings-section">
          <h3>Language & Learning</h3>
          <div className="setting-item">
            <label>Interface Language</label>
            <select
              value={settings.language}
              onChange={(e) => handleSettingChange('language', e.target.value as any)}
            >
              <option value="en">English</option>
              <option value="zh-CN">简体中文</option>
              <option value="zh-TW">繁體中文</option>
            </select>
          </div>

          <div className="setting-item">
            <label>Show Translations</label>
            <input
              type="checkbox"
              checked={settings.showTranslations}
              onChange={(e) => handleSettingChange('showTranslations', e.target.checked)}
            />
            <span className="setting-description">
              Display Chinese translations for English words
            </span>
          </div>
        </div>

        <div className="settings-section">
          <h3>Audio & Sound</h3>
          <div className="setting-item">
            <label>Sound Effects</label>
            <input
              type="checkbox"
              checked={settings.soundEnabled}
              onChange={(e) => handleSettingChange('soundEnabled', e.target.checked)}
            />
          </div>

          <div className="setting-item">
            <label>Auto-play Pronunciation</label>
            <input
              type="checkbox"
              checked={settings.autoPlay}
              onChange={(e) => handleSettingChange('autoPlay', e.target.checked)}
            />
            <span className="setting-description">
              Automatically play word pronunciation when shown
            </span>
          </div>
        </div>

        <div className="settings-section">
          <h3>Study Reminders</h3>
          <div className="setting-item">
            <label>Daily Reminder</label>
            <input
              type="checkbox"
              checked={settings.dailyReminder}
              onChange={(e) => handleSettingChange('dailyReminder', e.target.checked)}
            />
          </div>

          {settings.dailyReminder && (
            <div className="setting-item">
              <label>Reminder Time</label>
              <input
                type="time"
                value={settings.reminderTime}
                onChange={(e) => handleSettingChange('reminderTime', e.target.value)}
              />
            </div>
          )}
        </div>

        <div className="settings-section">
          <h3>Data & Privacy</h3>
          <div className="setting-item">
            <label>Learning Data</label>
            <div className="data-actions">
              <button className="secondary-button" onClick={handleExportData}>
                Export Progress
              </button>
              <button className="secondary-button" onClick={handleImportData}>
                Import Data
              </button>
              <button className="danger-button" onClick={handleClearAllData}>
                Clear All Data
              </button>
            </div>
          </div>
          
          <div className="storage-info">
            <span className="info-label">Storage Type:</span>
            <span className="info-value">
              {storageService.getStorageInfo().type === 'electron' ? 'Local Files' : 'Browser Storage'}
            </span>
          </div>
        </div>

        <div className="settings-section">
          <h3>About</h3>
          <div className="about-info">
            <div className="info-item">
              <span className="info-label">Version:</span>
              <span className="info-value">1.0.0</span>
            </div>
            <div className="info-item">
              <span className="info-label">Built with:</span>
              <span className="info-value">Electron + React 19 + TypeScript</span>
            </div>
            <div className="info-item">
              <span className="info-label">Last Updated:</span>
              <span className="info-value">December 2024</span>
            </div>
          </div>
        </div>

        <div className="settings-actions">
          <button 
            className="primary-button"
            onClick={saveSettings}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
          <button 
            className="secondary-button"
            onClick={resetSettings}
          >
            Reset to Defaults
          </button>
        </div>
        
        {message && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}
      </div>
    </div>
  )
}
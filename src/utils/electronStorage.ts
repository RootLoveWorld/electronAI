import { UserProgress, AppSettings } from '@/types'

export class ElectronStorageService {
  private static instance: ElectronStorageService
  private readonly FALLBACK_PREFIX = 'english-learning-'

  private constructor() {}

  static getInstance(): ElectronStorageService {
    if (!ElectronStorageService.instance) {
      ElectronStorageService.instance = new ElectronStorageService()
    }
    return ElectronStorageService.instance
  }

  // Check if running in Electron environment
  private isElectron(): boolean {
    return typeof window !== 'undefined' && window.electronAPI !== undefined
  }

  // Progress Data Storage
  async saveProgress(progress: UserProgress): Promise<boolean> {
    try {
      if (this.isElectron()) {
        const result = await window.electronAPI.saveProgress(progress)
        return result.success
      } else {
        // Fallback to localStorage for web version
        localStorage.setItem(this.FALLBACK_PREFIX + 'progress', JSON.stringify(progress))
        return true
      }
    } catch (error) {
      console.error('Error saving progress:', error)
      return false
    }
  }

  async loadProgress(): Promise<UserProgress | null> {
    try {
      if (this.isElectron()) {
        return await window.electronAPI.loadProgress()
      } else {
        // Fallback to localStorage for web version
        const saved = localStorage.getItem(this.FALLBACK_PREFIX + 'progress')
        return saved ? JSON.parse(saved) : null
      }
    } catch (error) {
      console.error('Error loading progress:', error)
      return null
    }
  }

  async exportProgress(progress: UserProgress): Promise<{ success: boolean; path?: string }> {
    try {
      if (this.isElectron()) {
        const result = await window.electronAPI.exportProgress(progress)
        return { success: result.success, path: result.path }
      } else {
        // For web version, create a download link
        const dataStr = JSON.stringify(progress, null, 2)
        const dataBlob = new Blob([dataStr], { type: 'application/json' })
        const url = URL.createObjectURL(dataBlob)
        
        const link = document.createElement('a')
        link.href = url
        link.download = 'english-learning-progress.json'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
        
        return { success: true }
      }
    } catch (error) {
      console.error('Error exporting progress:', error)
      return { success: false }
    }
  }

  async importProgress(): Promise<UserProgress | null> {
    try {
      if (this.isElectron()) {
        const filePath = await window.electronAPI.selectFile()
        if (filePath) {
          return await window.electronAPI.importProgress(filePath)
        }
        return null
      } else {
        // For web version, use file input
        return new Promise((resolve) => {
          const input = document.createElement('input')
          input.type = 'file'
          input.accept = '.json'
          input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0]
            if (file) {
              const reader = new FileReader()
              reader.onload = (e) => {
                try {
                  const data = JSON.parse(e.target?.result as string)
                  resolve(data)
                } catch (error) {
                  console.error('Error parsing imported file:', error)
                  resolve(null)
                }
              }
              reader.readAsText(file)
            } else {
              resolve(null)
            }
          }
          input.click()
        })
      }
    } catch (error) {
      console.error('Error importing progress:', error)
      return null
    }
  }

  // Settings Storage
  async saveSettings(settings: AppSettings): Promise<boolean> {
    try {
      if (this.isElectron()) {
        const result = await window.electronAPI.saveSettings(settings)
        return result.success
      } else {
        // Fallback to localStorage for web version
        localStorage.setItem(this.FALLBACK_PREFIX + 'settings', JSON.stringify(settings))
        return true
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      return false
    }
  }

  async loadSettings(): Promise<AppSettings | null> {
    try {
      if (this.isElectron()) {
        return await window.electronAPI.loadSettings()
      } else {
        // Fallback to localStorage for web version
        const saved = localStorage.getItem(this.FALLBACK_PREFIX + 'settings')
        return saved ? JSON.parse(saved) : null
      }
    } catch (error) {
      console.error('Error loading settings:', error)
      return null
    }
  }

  // Audio playback
  async playAudio(audioPath: string): Promise<boolean> {
    try {
      if (this.isElectron()) {
        const result = await window.electronAPI.playAudio(audioPath)
        return result.success
      } else {
        // For web version, use HTML5 audio or Web Speech API
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(audioPath)
          utterance.rate = 0.8
          speechSynthesis.speak(utterance)
          return true
        }
        return false
      }
    } catch (error) {
      console.error('Error playing audio:', error)
      return false
    }
  }

  // Window controls (Electron only)
  async minimizeWindow(): Promise<void> {
    if (this.isElectron()) {
      await window.electronAPI.minimizeWindow()
    }
  }

  async maximizeWindow(): Promise<void> {
    if (this.isElectron()) {
      await window.electronAPI.maximizeWindow()
    }
  }

  async closeWindow(): Promise<void> {
    if (this.isElectron()) {
      await window.electronAPI.closeWindow()
    } else {
      window.close()
    }
  }

  // Backup and restore functionality
  async createBackup(progress: UserProgress, settings: AppSettings): Promise<boolean> {
    try {
      const backupData = {
        version: '1.0',
        timestamp: new Date().toISOString(),
        progress,
        settings
      }

      if (this.isElectron()) {
        const result = await window.electronAPI.exportProgress(backupData)
        return result.success
      } else {
        const dataStr = JSON.stringify(backupData, null, 2)
        const dataBlob = new Blob([dataStr], { type: 'application/json' })
        const url = URL.createObjectURL(dataBlob)
        
        const link = document.createElement('a')
        link.href = url
        link.download = `english-learning-backup-${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
        
        return true
      }
    } catch (error) {
      console.error('Error creating backup:', error)
      return false
    }
  }

  async restoreBackup(): Promise<{ progress?: UserProgress; settings?: AppSettings } | null> {
    try {
      const backupData = await this.importProgress() as any
      
      if (backupData && backupData.version) {
        // Full backup file
        return {
          progress: backupData.progress,
          settings: backupData.settings
        }
      } else if (backupData) {
        // Progress-only file
        return { progress: backupData }
      }
      
      return null
    } catch (error) {
      console.error('Error restoring backup:', error)
      return null
    }
  }

  // Clear all data
  async clearAllData(): Promise<boolean> {
    try {
      if (this.isElectron()) {
        // In Electron, we'd need to implement file deletion
        // For now, just overwrite with empty data
        await this.saveProgress({} as UserProgress)
        await this.saveSettings({} as AppSettings)
      } else {
        // Clear localStorage
        Object.keys(localStorage)
          .filter(key => key.startsWith(this.FALLBACK_PREFIX))
          .forEach(key => localStorage.removeItem(key))
      }
      return true
    } catch (error) {
      console.error('Error clearing data:', error)
      return false
    }
  }

  // Get storage information
  getStorageInfo(): { type: 'electron' | 'web'; available: boolean } {
    if (this.isElectron()) {
      return { type: 'electron', available: true }
    } else {
      const available = typeof Storage !== 'undefined'
      return { type: 'web', available }
    }
  }
}
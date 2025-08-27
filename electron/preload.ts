import { contextBridge, ipcRenderer } from 'electron'

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  getAppVersion: () => ipcRenderer.invoke('app-version'),
  
  // Learning data persistence
  saveProgress: (data: any) => ipcRenderer.invoke('save-progress', data),
  loadProgress: () => ipcRenderer.invoke('load-progress'),
  exportProgress: (data: any) => ipcRenderer.invoke('export-progress', data),
  importProgress: (filePath: string) => ipcRenderer.invoke('import-progress', filePath),
  
  // Settings storage
  saveSettings: (settings: any) => ipcRenderer.invoke('save-settings', settings),
  loadSettings: () => ipcRenderer.invoke('load-settings'),
  
  // Audio functionality
  playAudio: (audioPath: string) => ipcRenderer.invoke('play-audio', audioPath),
  
  // File operations
  selectFile: () => ipcRenderer.invoke('select-file'),
  
  // Window controls
  minimizeWindow: () => ipcRenderer.invoke('minimize-window'),
  maximizeWindow: () => ipcRenderer.invoke('maximize-window'),
  closeWindow: () => ipcRenderer.invoke('close-window'),
})
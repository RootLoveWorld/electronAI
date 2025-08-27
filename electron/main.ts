import { app, BrowserWindow, Menu, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { promises as fs } from 'fs'
import { isDev } from './utils'

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit()
}

let mainWindow: BrowserWindow

const createWindow = (): void => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    height: 800,
    width: 1200,
    minHeight: 600,
    minWidth: 800,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    icon: join(__dirname, '../assets/icon.png'), // We'll add this later
    titleBarStyle: 'default',
    show: false, // Don't show until ready-to-show
  })

  // Load the app
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
    // Open the DevTools in development
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(join(__dirname, '../dist-react/index.html'))
  }

  // Show window when ready to prevent visual flash
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null as any
  })
}

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
  createWindow()

  // On OS X, re-create a window when the dock icon is clicked
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })

  // Set up menu
  setupMenu()
})

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// Setup application menu
const setupMenu = () => {
  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Quit',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit()
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'close' }
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

// IPC handlers for communication between main and renderer processes
ipcMain.handle('app-version', () => {
  return app.getVersion()
})

// Data storage handlers
ipcMain.handle('save-progress', async (event, data) => {
  try {
    const userDataPath = app.getPath('userData')
    const progressFile = join(userDataPath, 'progress.json')
    await fs.writeFile(progressFile, JSON.stringify(data, null, 2))
    return { success: true }
  } catch (error) {
    console.error('Error saving progress:', error)
    return { success: false, error: error.message }
  }
})

ipcMain.handle('load-progress', async () => {
  try {
    const userDataPath = app.getPath('userData')
    const progressFile = join(userDataPath, 'progress.json')
    const data = await fs.readFile(progressFile, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error loading progress:', error)
    return null
  }
})

// Audio functionality
ipcMain.handle('play-audio', async (event, audioPath) => {
  try {
    // In a real implementation, you might use a library like 'speaker' or 'node-wav'
    console.log('Playing audio:', audioPath)
    return { success: true }
  } catch (error) {
    console.error('Error playing audio:', error)
    return { success: false, error: error.message }
  }
})

// File operations
ipcMain.handle('select-file', async () => {
  try {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openFile'],
      filters: [
        { name: 'JSON Files', extensions: ['json'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    })
    
    if (!result.canceled && result.filePaths.length > 0) {
      return result.filePaths[0]
    }
    return null
  } catch (error) {
    console.error('Error selecting file:', error)
    return null
  }
})

// Export progress data
ipcMain.handle('export-progress', async (event, data) => {
  try {
    const result = await dialog.showSaveDialog(mainWindow, {
      defaultPath: 'english-learning-progress.json',
      filters: [
        { name: 'JSON Files', extensions: ['json'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    })
    
    if (!result.canceled && result.filePath) {
      await fs.writeFile(result.filePath, JSON.stringify(data, null, 2))
      return { success: true, path: result.filePath }
    }
    return { success: false, canceled: true }
  } catch (error) {
    console.error('Error exporting progress:', error)
    return { success: false, error: error.message }
  }
})

// Import progress data
ipcMain.handle('import-progress', async (event, filePath) => {
  try {
    const data = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error importing progress:', error)
    return null
  }
})

// Settings storage
ipcMain.handle('save-settings', async (event, settings) => {
  try {
    const userDataPath = app.getPath('userData')
    const settingsFile = join(userDataPath, 'settings.json')
    await fs.writeFile(settingsFile, JSON.stringify(settings, null, 2))
    return { success: true }
  } catch (error) {
    console.error('Error saving settings:', error)
    return { success: false, error: error.message }
  }
})

ipcMain.handle('load-settings', async () => {
  try {
    const userDataPath = app.getPath('userData')
    const settingsFile = join(userDataPath, 'settings.json')
    const data = await fs.readFile(settingsFile, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error loading settings:', error)
    return null
  }
})

// Window controls
ipcMain.handle('minimize-window', () => {
  if (mainWindow) {
    mainWindow.minimize()
  }
})

ipcMain.handle('maximize-window', () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize()
    } else {
      mainWindow.maximize()
    }
  }
})

ipcMain.handle('close-window', () => {
  if (mainWindow) {
    mainWindow.close()
  }
})
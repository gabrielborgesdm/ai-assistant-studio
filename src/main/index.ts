import * as dotenv from 'dotenv'
dotenv.config()

import { electronApp, optimizer } from '@electron-toolkit/utils'
import { app, BrowserWindow, globalShortcut, ipcMain } from 'electron'

import { setupAssistantsController } from '@main/features/assistants/assistants.controller'
import { initDB } from '@main/features/database/db.config'
import { setupTray } from '@main/features/electron/tray.config'
import { setupWindowConfig } from '@main/features/electron/window.config'
import { setupFileController } from '@main/features/file/file.controller'
import { setupOllamaController } from '@main/features/ollama/ollama.controller'
import { setupShortcut } from '@main/features/electron/shortcut.config'
import { setupStartup } from '@main/features/electron/startup.config'
import { setupElectronSettingsController } from '@main/features/electron/electron-settings.controller'
import { setupMenu } from '@main/features/electron/menu.config'

let mainWindow: BrowserWindow | null = null

app.whenReady().then(async () => {
  // Initialize the database
  const db = await initDB()

  // Initialize the controllers
  setupOllamaController()
  setupFileController()
  setupAssistantsController(db)

  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.on('ping', () => console.log('pong'))

  setupMenu()
  mainWindow = await setupWindowConfig(app, db)
  app.on('activate', async () => {
    if (BrowserWindow.getAllWindows().length === 0) mainWindow = await setupWindowConfig(app, db)
  })

  // 🟡 Config setups
  setupTray(app, mainWindow)
  setupShortcut(mainWindow, db)
  setupStartup(mainWindow, db)
  setupElectronSettingsController(db, mainWindow)
})

app.on('window-all-closed', () => {
  app.quit()
})

app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})


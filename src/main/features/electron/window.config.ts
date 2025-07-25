import { is } from '@electron-toolkit/utils'
import { DBType } from '@main/features/database/db.type'
import icon from '@resources/logo.png?asset'
import { BrowserWindow, shell } from 'electron'
import { join } from 'path'

let resizeTimeout: NodeJS.Timeout | null = null

export const setupWindowConfig = async (app: Electron.App, db: DBType): Promise<BrowserWindow> => {
  await db.read()

  const config = db.data?.config
  const mainWindow = new BrowserWindow({
    width: config?.window?.width || 1024,
    height: config?.window?.height || 768,
    minWidth: 450,
    minHeight: 500,
    skipTaskbar: false,
    alwaysOnTop: true,
    autoHideMenuBar: true,
    show: false, // start hidden
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    },
    title: 'AI Assistant Studio'
  })

  app.setName('AI Assistant Studio')

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  mainWindow.on('resize', () => {
    if (!mainWindow) return

    if (resizeTimeout) {
      clearTimeout(resizeTimeout)
    }

    resizeTimeout = setTimeout(() => {
      const [width, height] = mainWindow.getSize()
      if (!width || !height) return

      if (db.data?.config?.window) {
        db.data.config.window.width = width
        db.data.config.window.height = height
        db.write()
      }
    }, 3000)
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  mainWindow.on('ready-to-show', () => {
    if (
      process.argv.includes('--hidden') ||
      process.execArgv.includes('--hidden') ||
      app.getLoginItemSettings().wasOpenedAtLogin
    ) {
      return
    }
    mainWindow?.show()
  })

  return mainWindow
}

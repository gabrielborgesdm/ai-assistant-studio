import icon from '@resources/logo.png?asset'
import macIcon from '@resources/mac-tray-logo.png?asset'
import { BrowserWindow, Menu, nativeImage, Tray } from 'electron'

let isQuitting = false

export const setupTray = (app: Electron.App, mainWindow: BrowserWindow | null): void => {
  if (!mainWindow) {
    return
  }
  // 🟡 Tray setup

  // Handle different icons for mac and other platforms
  const isMac = process.platform === 'darwin'
  const trayIcon = isMac ? nativeImage.createFromPath(macIcon) : nativeImage.createFromPath(icon)
  if (isMac) {
    // Necessary for mac to auto handle sizing and color
    trayIcon.setTemplateImage(true)
  }

  const tray = new Tray(trayIcon)

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show', click: () => mainWindow?.show() },
    {
      label: 'Quit',
      click: () => {
        console.log('Quitting app')
        isQuitting = true
        tray?.destroy()
        app.quit()
      }
    }
  ])

  tray.setToolTip('AI Assistant Studio')
  tray.setContextMenu(contextMenu)

  tray.on('click', () => {
    mainWindow?.show()
  })

  mainWindow.on('close', (event) => {
    if (!isQuitting) {
      console.log('Minimizing app')
      event.preventDefault()
      mainWindow?.hide()
    } else {
      console.log('Quitting app')
    }
  })
}

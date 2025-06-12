import icon from '@resources/logo.png?asset'
import { BrowserWindow, Menu, Tray } from 'electron'

let isQuitting = false

export const setupTray = (app: Electron.App, mainWindow: BrowserWindow | null): void => {
  if (!mainWindow) {
    return
  }
  // 🟡 Tray setup
  const tray = new Tray(icon)
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

  mainWindow.on('ready-to-show', () => {
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

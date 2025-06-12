import { globalShortcut, BrowserWindow } from 'electron'
import { DBType } from '@main/features/database/db.type'
import { app } from 'electron'
import { Config } from '@global/types/config'

export default class ElectronSettingsService {
  mainWindow: BrowserWindow
  db: DBType

  constructor(mainWindow: BrowserWindow, db: DBType) {
    this.mainWindow = mainWindow
    this.db = db
  }

  registerShortcut(accelerator: string | undefined): string | undefined {
    // Unregister all shortcuts
    globalShortcut.unregisterAll()

    console.log(`Registering shortcut: ${accelerator}`)

    try {
      this.db.data!.config.shortcut = accelerator || ''
      this.db.write()
      console.log(`Shortcut registered: ${accelerator}`)
    } catch (error) {
      console.error('Failed to update shortcut config:', error)
    }

    if (!accelerator) return

    const success = globalShortcut.register(accelerator, () => {
      this.toggleWindow()
    })

    if (!success) {
      console.error(`Failed to register shortcut: ${accelerator}`)
      return
    }

    return accelerator
  }

  registerOpenAtStartup(runAtStartup: boolean): boolean {
    console.log(`Registering open at startup: ${runAtStartup}`)
    app.setLoginItemSettings({
      openAtLogin: runAtStartup,
      args: ['--hidden']
    })

    try {
      this.db.data!.config.runAtStartup = runAtStartup
      this.db.write()
    } catch (error) {
      console.error('Failed to update runAtStartup config:', error)
    }

    return runAtStartup
  }

  async getConfig(): Promise<Config | undefined> {
    await this.db.read()
    return this.db.data?.config
  }

  async getOs(): Promise<string> {
    return process.platform
  }

  toggleWindow(): void {
    if (!this.mainWindow) return
    if (this.mainWindow.isVisible()) {
      this.mainWindow.hide()
    } else {
      this.mainWindow.show()
      this.mainWindow.focus()
    }
  }
}

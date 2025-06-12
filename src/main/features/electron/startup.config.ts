import { DBType } from '@main/features/database/db.type'
import { BrowserWindow } from 'electron'
import ElectronSettingsService from '@main/features/electron/electron-settings.service'

export const setupStartup = async (mainWindow: BrowserWindow | null, db: DBType): Promise<void> => {
  if (!mainWindow || !db) {
    throw new Error('Main window is not initialized')
  }

  await db.read()
  const config = db.data?.config
  if (!config) {
    console.log('No config found')
    return
  }

  const shortcutService = new ElectronSettingsService(mainWindow, db)
  shortcutService.registerOpenAtStartup(config.runAtStartup)
}

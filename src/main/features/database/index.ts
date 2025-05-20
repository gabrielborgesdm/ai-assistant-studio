import { JSONFilePreset } from 'lowdb/node'

import defaultActions from '../../../../resources/default-actions.json'
import { Low } from 'lowdb/lib'
import path from 'path'
import { app, ipcMain } from 'electron'

const initialData = {
  actions: defaultActions,
  history: []
}

let db: Low<typeof initialData>

export async function initDB(): Promise<void> {
  const file = path.join(app.getPath('userData'), 'db.json')
  db = await JSONFilePreset(file, initialData)
  await db.read()
}

ipcMain.handle('get-actions', async () => {
  await db.read()
  return db.data?.actions || []
})

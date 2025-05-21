import { JSONFilePreset } from 'lowdb/node'
import defaultActions from '../../../../resources/default-actions.json'
import { Low } from 'lowdb/lib'
import path from 'path'
import { app, ipcMain } from 'electron'
import { addActionMessage, clearHistory, getActions } from './actions.service'
import { Action, ActionHistory, ActionMessage } from '@global/types/action'

/*
 * This file is responsible for initializing the database and handling
 * the IPC calls to the db services.
 * It uses lowdb to create a JSON file based database.
 * The database is stored in the user data directory of the app.
 */

const initialData: { actions: Action[]; history: ActionHistory[] } = {
  actions: defaultActions,
  history: []
}

let db: Low<typeof initialData>
export type DB = typeof db

export async function initDB(): Promise<void> {
  const file = path.join(app.getPath('userData'), 'db.json')
  db = await JSONFilePreset(file, initialData)
  await db.read()
}

ipcMain.handle('get-actions', () => getActions(db))

ipcMain.handle('add-action-message', (_event, actionId: string, message: ActionMessage) =>
  addActionMessage(db, actionId, message)
)

ipcMain.handle('clear-history', (_event, actionId: string) => clearHistory(db, actionId))

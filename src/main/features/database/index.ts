import { Action, ActionHistory, ActionMessage } from '@global/types/action'
import { app, ipcMain } from 'electron'
import { Low } from 'lowdb/lib'
import { JSONFilePreset } from 'lowdb/node'
import path from 'path'
import defaultActions from '../../../../resources/default-actions.json'
import { addActionMessage, clearHistory, getActions, getHistory } from './actions.service'

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

ipcMain.handle('get-history', (_event, actionId) => getHistory(db, actionId))

ipcMain.handle('add-action-message', (_event, actionId: string, messages: ActionMessage[]) =>
  addActionMessage(db, actionId, messages)
)

ipcMain.handle('clear-history', (_event, actionId: string) => clearHistory(db, actionId))

import { Assistant, AssistantHistory, AssistantMessage } from 'src/global/types/assistant'
import { app, ipcMain } from 'electron'
import { Low } from 'lowdb/lib'
import { JSONFilePreset } from 'lowdb/node'
import path from 'path'
import defaultAssistants from '@global/resources/default-assistants.json'
import { addAssistantMessage, clearHistory, getAssistants, getHistory } from './assistants.service'
import fs from 'fs/promises'

/*
 * This file is responsible for initializing the database and handling
 * the IPC calls to the db services.
 * It uses lowdb to create a JSON file based database.
 * The database is stored in the user data directory of the app.
 */

const initialData: { assistants: Assistant[]; history: AssistantHistory[] } = {
  assistants: defaultAssistants,
  history: []
}

let db: Low<typeof initialData>
export type DB = typeof db

export async function initDB(): Promise<void> {
  const file = path.join(app.getPath('userData'), 'db.json')
  // for debug purposes, remove the db file if env var is set
  if (process.env.VITE_DEBUG_CLEANUP) {
    console.log('Removing database file for debug purposes')
    try {
      await fs.rm(file).then(() => console.log('Database file removed'))
    } catch (error) {
      console.error('Error removing database file:', error)
    }
  }

  db = await JSONFilePreset(file, initialData)
  await db.read()
}

ipcMain.handle('get-assistants', () => getAssistants(db))

ipcMain.handle('get-history', (_event, assistantId) => getHistory(db, assistantId))

ipcMain.handle(
  'add-assistant-message',
  (_event, assistantId: string, messages: AssistantMessage[]) =>
    addAssistantMessage(db, assistantId, messages)
)

ipcMain.handle('clear-history', (_event, assistantId: string) => clearHistory(db, assistantId))

import { Assistant, ActionHistory, AssistantMessage } from 'src/global/types/assistant'
import { DB } from '.'
import { HistoryFactory } from '@global/factories/action.factory'

/*
 * Retrieves all actions from the database.
 * @param db - The database instance.
 * @returns An array of actions.
 */
export const getActions = async (db: DB): Promise<Assistant[]> => {
  await db.read()
  return db.data?.actions || []
}

/*
 * Retrieves a specific action from the database by its ID.
 * @param db - The database instance.
 * @param actionId - The ID of the action to retrieve.
 * @returns The action object if found, otherwise undefined.
 */
export const getHistory = async (db: DB, actionId: string): Promise<ActionHistory | undefined> => {
  const histories: ActionHistory[] = db.data?.history

  return histories.find((history) => history.actionId === actionId)
}

/*
 * Adds a message to the action history.
 * If the action history does not exist, it creates a new one.
 * @param db - The database instance.
 * @param actionId - The ID of the action.
 * @param message - The message to add.
 * @returns The updated action history.
 */
export const addActionMessage = async (
  db: DB,
  actionId: string,
  messages: AssistantMessage[]
): Promise<ActionHistory> => {
  await db.read()
  const histories: ActionHistory[] = db.data?.history
  let filteredHistory = await getHistory(db, actionId)

  if (!filteredHistory) {
    filteredHistory = HistoryFactory(actionId, [...messages])
  } else {
    filteredHistory.messages = [...filteredHistory.messages, ...messages]
  }

  histories.push(filteredHistory)
  // Push without needing to wait
  db.write()

  return filteredHistory
}

export const clearHistory = async (db: DB, actionId: string): Promise<void> => {
  console.log('Clearing history for actionId:', actionId)

  await db.read()
  if (!db.data.history?.length) {
    console.log('No histories found')
    return
  }
  db.data.history = db.data?.history.filter((history) => history.actionId !== actionId)
  console.log('Cleaning history', actionId)
  db.write()
}

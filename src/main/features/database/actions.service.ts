import { Action, ActionHistory, ActionMessage } from '@global/types/action'
import { DB } from '.'

/*
 * Retrieves all actions from the database.
 * @param db - The database instance.
 * @returns An array of actions.
 */
export const getActions = async (db: DB): Promise<Action[]> => {
  await db.read()
  return db.data?.actions || []
}

const historyFactory = (actionId: string, messages: ActionMessage[] = []): ActionHistory => ({
  actionId,
  messages
})

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
  message: ActionMessage
): Promise<ActionHistory> => {
  await db.read()
  const histories: ActionHistory[] = db.data?.history
  let filteredHistory = histories.find((history) => history.actionId === actionId)

  if (!filteredHistory) {
    filteredHistory = historyFactory(actionId, [message])
  } else {
    filteredHistory.messages.push(message)
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

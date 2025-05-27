import { Assistant, AssistantHistory, AssistantMessage } from '@global/types/assistant'
import { DB } from '.'
import { HistoryFactory } from '@global/factories/assistant.factory'

/*
 * Retrieves all assistants from the database.
 * @param db - The database instance.
 * @returns An array of assistants.
 */
export const getAssistants = async (db: DB): Promise<Assistant[]> => {
  await db.read()
  return db.data?.assistants || []
}

/*
 * Retrieves a specific assistant from the database by its ID.
 * @param db - The database instance.
 * @param assistantId - The ID of the assistant to retrieve.
 * @returns The assistant object if found, otherwise undefined.
 */
export const getHistory = async (
  db: DB,
  assistantId: string
): Promise<AssistantHistory | undefined> => {
  const histories: AssistantHistory[] = db.data?.history

  return histories.find((history) => history.assistantId === assistantId)
}

/*
 * Adds a message to the assistant history.
 * If the assistant history does not exist, it creates a new one.
 * @param db - The database instance.
 * @param assistantId - The ID of the assistant.
 * @param message - The message to add.
 * @returns The updated assistant history.
 */
export const addAssistantMessage = async (
  db: DB,
  assistantId: string,
  messages: AssistantMessage[]
): Promise<AssistantHistory> => {
  await db.read()
  const histories: AssistantHistory[] = db.data?.history
  let filteredHistory = await getHistory(db, assistantId)

  if (!filteredHistory) {
    filteredHistory = HistoryFactory(assistantId, [...messages])
  } else {
    filteredHistory.messages = [...filteredHistory.messages, ...messages]
  }

  histories.push(filteredHistory)
  // Push without needing to wait
  db.write()

  return filteredHistory
}

export const clearHistory = async (db: DB, assistantId: string): Promise<void> => {
  console.log('Clearing history for assistantId:', assistantId)

  await db.read()
  if (!db.data.history?.length) {
    console.log('No histories found')
    return
  }
  db.data.history = db.data?.history.filter((history) => history.assistantId !== assistantId)
  console.log('Cleaning history', assistantId)
  db.write()
}

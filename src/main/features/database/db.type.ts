import { Assistant, AssistantHistory } from '@global/types/assistant'
import { Low } from 'lowdb/lib'
import { Config } from '@global/types/config'

// Define the database schema
export interface DBSchema {
  assistants: Assistant[]
  // Store messages directly in the history, keyed by assistantId
  history: AssistantHistory[]
  config: Config
}

// Define the DB interface that includes both data and LowDB methods
export type DBType = Low<DBSchema>

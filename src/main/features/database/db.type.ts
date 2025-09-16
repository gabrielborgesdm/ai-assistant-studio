import { Assistant, Conversation } from "@global/types/assistant";
import { Low } from "lowdb/lib";

// Define the database schema
export interface DBSchema {
  assistants: Assistant[];
  // Store messages directly in the history, keyed by assistantId
  history: Conversation[];
}

// Define the DB interface that includes both data and LowDB methods
export type DBType = Low<DBSchema>;

import { ipcRenderer } from 'electron'
import {
  GetAssistantsEvent,
  GetHistoryEvent,
  AddAssistantMessageEvent,
  ClearHistoryEvent,
  SaveAssistantEvent,
  DeleteAssistantEvent
} from '@global/const/db.event'

// This file is used to expose the database API to the renderer process
export const dbApi = {
  getAssistants: () => ipcRenderer.invoke(GetAssistantsEvent),
  getHistory: (assistantId) => ipcRenderer.invoke(GetHistoryEvent, assistantId),
  addAssistantMessage: (assistantId, messages) =>
    ipcRenderer.invoke(AddAssistantMessageEvent, assistantId, messages),
  clearHistory: (assistantId) => ipcRenderer.invoke(ClearHistoryEvent, assistantId),
  saveAssistant: (assistantData, assistantId) =>
    ipcRenderer.invoke(SaveAssistantEvent, assistantData, assistantId),
  deleteAssistant: (assistantId) => ipcRenderer.invoke(DeleteAssistantEvent, assistantId)
}

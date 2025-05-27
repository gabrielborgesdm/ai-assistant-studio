import { ipcRenderer } from 'electron'

// This file is used to expose the database API to the renderer process
export const dbApi = {
  getAssistants: () => ipcRenderer.invoke('get-assistants'),
  getHistory: (assistantId) => ipcRenderer.invoke('get-history', assistantId),
  addAssistantMessage: (assistantId, messages) =>
    ipcRenderer.invoke('add-assistant-message', assistantId, messages),
  clearHistory: (assistantId) => ipcRenderer.invoke('clear-history', assistantId)
}

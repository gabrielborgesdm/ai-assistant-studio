import { ipcRenderer } from 'electron'

// This file is used to expose the database API to the renderer process
export const dbApi = {
  getActions: () => ipcRenderer.invoke('get-actions'),
  getHistory: (actionId) => ipcRenderer.invoke('get-history', actionId),
  addActionMessage: (actionId, messages) =>
    ipcRenderer.invoke('add-action-message', actionId, messages),
  clearHistory: (actionId) => ipcRenderer.invoke('clear-history', actionId)
}

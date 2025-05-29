import { ChatEvent, ChatEventReply, OllamaIsInstalledEvent } from '@global/const/ollama.event'
import { ipcRenderer } from 'electron'

// This file is used to expose the database API to the renderer process
// It uses Electron's IPC (Inter-Process Communication) to communicate with the main process

export const ollamaApi = {
  streamOllamaChatResponse: (action, history, callback) => {
    ipcRenderer.removeAllListeners(ChatEventReply) // Remove any previous listeners to avoid duplicates
    console.log('calling streamOllamaChatResponse')
    ipcRenderer.send(ChatEvent, action, history)

    const listener = (_event: Electron.IpcRendererEvent, result): void => {
      callback(result)
    }

    ipcRenderer.on(ChatEventReply, listener)
  },
  checkOllamaIsInstalled: () => ipcRenderer.invoke(OllamaIsInstalledEvent)
}

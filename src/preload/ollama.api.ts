import { GenerateEvent, GenerateEventReply } from '@global/const/ollama.event'
import { ipcRenderer } from 'electron'

// This file is used to expose the database API to the renderer process
// It uses Electron's IPC (Inter-Process Communication) to communicate with the main process

export const ollamaApi = {
  generate: (prompt, action, callback) => {
    console.log('Generating with prompt:', prompt, action)
    ipcRenderer.send(GenerateEvent, prompt, action)

    const listener = (_event: Electron.IpcRendererEvent, result): void => {
      console.log('Responding with result:', result)
      callback(result)

      // Clean up the listener after responding (optional but recommended)
      if (result.done === true) {
        ipcRenderer.removeListener(GenerateEventReply, listener)
      }
    }

    ipcRenderer.on(GenerateEventReply, listener)
  }
}

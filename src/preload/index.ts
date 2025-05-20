/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { electronAPI } from '@electron-toolkit/preload'
import { contextBridge, ipcRenderer } from 'electron'

// Custom APIs for renderer
const api = {
  ollama: {
    generate: (prompt, action, callback) => {
      console.log('Sending generate request to main process:', prompt, action)
      ipcRenderer.send('generate', prompt, action)

      const listener = (_event: Electron.IpcRendererEvent, result) => {
        console.log('Received response from main process:', result)
        callback(result)
        // Clean up the listener after responding (optional but recommended)
        if (result.done === true) {
          ipcRenderer.removeListener('generate-reply', listener)
        }
      }

      ipcRenderer.on('generate-reply', listener)
    },
    downloadModel: (modelName) => ipcRenderer.invoke('download-model', modelName)
  },
  db: {
    getActions: () => ipcRenderer.invoke('get-actions'),
    getHistory: (actionId) => ipcRenderer.invoke('get-history', actionId),
    deleteHistory: (actionId) => ipcRenderer.invoke('delete-history', actionId),
    addAction: (action) => ipcRenderer.invoke('add-action', action),
    deleteAction: (action) => ipcRenderer.invoke('delete-action', action)
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}

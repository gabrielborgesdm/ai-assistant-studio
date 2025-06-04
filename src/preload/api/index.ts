import { EventCancel } from '@global/const/event'
import { ipcRenderer } from 'electron'
import { dbApi } from '@preload/api/db.api'
import { fileApi } from '@preload/api/file.api'
import { ollamaApi } from '@preload/api/ollama.api'

/*
 * This file is used to define the API that will be exposed to the renderer process.
 */

export const api = {
  ollama: ollamaApi,
  db: dbApi,
  file: fileApi,

  // This function allows the renderer process to cancel an event
  cancel: (eventName: string) => {
    console.log('Cancelling event:', eventName)
    ipcRenderer.send(EventCancel(eventName)) // Remove all listeners for the event
    // Remove the listener if the event is cancelled
  }
}

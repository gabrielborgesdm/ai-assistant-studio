import { ipcRenderer } from 'electron'
import {
  GetConfigEvent,
  GetOsEvent,
  RegisterShortcutEvent,
  RegisterStartupEvent
} from '@global/const/config.event'

// This file is used to expose the assistants API to the renderer process
export const configApi = {
  registerShortcut: (accelerator: string) => ipcRenderer.invoke(RegisterShortcutEvent, accelerator),
  registerStartup: (runAtStartup: boolean) =>
    ipcRenderer.invoke(RegisterStartupEvent, runAtStartup),
  getConfig: () => ipcRenderer.invoke(GetConfigEvent),
  getOs: () => ipcRenderer.invoke(GetOsEvent)
}

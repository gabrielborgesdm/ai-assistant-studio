import { SelectImageEvent, GetDirectoryPathEvent } from '@global/const/file.event'
import { ipcRenderer } from 'electron'

export const fileApi = {
  selectImage: () => ipcRenderer.invoke(SelectImageEvent),
  getDirectoryPath: () => ipcRenderer.invoke(GetDirectoryPathEvent)
}

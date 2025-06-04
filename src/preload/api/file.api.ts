import { SelectImageEvent } from '@global/const/file'
import { ipcRenderer } from 'electron'

export const fileApi = {
  selectImage: () => ipcRenderer.invoke(SelectImageEvent)
}

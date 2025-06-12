import { SelectImageEvent } from '@global/const/file'
import FileService from '@main/features/file/file.service'
import { ipcMain } from 'electron'

export const setupFileController = (): void => {
  const fileService = new FileService()
  ipcMain.handle(SelectImageEvent, () => fileService.selectImage())
}

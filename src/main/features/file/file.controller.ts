import { SelectImageEvent, GetDirectoryPathEvent } from '@global/const/file.event'
import FileService from '@main/features/file/file.service'
import { ipcMain } from 'electron'

export const setupFileController = (): void => {
  const fileService = new FileService()
  ipcMain.handle(SelectImageEvent, () => fileService.selectImage())
  ipcMain.handle(GetDirectoryPathEvent, () => fileService.getDirectoryPath())
}

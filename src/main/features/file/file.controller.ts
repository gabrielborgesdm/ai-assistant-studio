import { ipcMain } from 'electron'
import { selectImage } from '@main/features/file/file.service'
import { SelectImageEvent } from '@global/const/file'

ipcMain.handle(SelectImageEvent, () => selectImage())

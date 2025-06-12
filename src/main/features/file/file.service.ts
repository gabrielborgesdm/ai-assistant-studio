import { dialog } from 'electron'
import fs from 'fs'
import mime from 'mime-types'

export default class FileService {
  selectImage = async (): Promise<{ buffer: Buffer; name: string; type: string } | undefined> => {
    const result = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [{ name: 'Images', extensions: ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp'] }]
    })

    if (!result.canceled && result.filePaths?.length > 0) {
      const path = result.filePaths[0]
      const buffer = fs.readFileSync(path)
      const name = path.split('/').pop() || 'image'
      const type = mime.contentType(path) || 'application/octet-stream'
      return { buffer, name, type }
    }

    return undefined
  }
}

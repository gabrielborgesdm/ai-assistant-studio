export interface ModelDownload {
  name: string
  size?: string
  info?: string
  installed: boolean
  required?: boolean
}

export interface InstalledModels {
  [key: string]: ModelDownload
}
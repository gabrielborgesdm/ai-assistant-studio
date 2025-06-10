import { OllamaModel as OllamaModelType } from 'ollama-models-search'
export interface ModelDownload {
  name: string
  size?: string
  info?: string
  installed: boolean
  required?: boolean
}

export interface OllamaModel extends OllamaModelType {
  recommended?: boolean
}

export interface InstalledModels {
  [key: string]: ModelDownload
}

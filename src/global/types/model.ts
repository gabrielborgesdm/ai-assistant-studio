import { OllamaModel as OllamaModelType } from 'ollama-models-search'
export interface ModelDownload {
  name: string
  size?: string
  info?: string
  installed: boolean
  required?: boolean
}

export interface OllamaModel extends OllamaModelType {
  id?: number
  recommended?: boolean
  installedVersions?: string[]

}

export interface InstalledModels {
  [key: string]: ModelDownload
}

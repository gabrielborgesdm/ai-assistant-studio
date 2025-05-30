export interface OllamaMessageStreamResponse {
  done: boolean
  response: string
  error?: string
}

export interface OllamaDownloadStreamResponse {
  done: boolean
  progress: number // 0-100
  error?: string
}

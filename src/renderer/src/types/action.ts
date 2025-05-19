import { GenerateRequest } from 'ollama'

export interface Action {
  title: string
  description: string
  prompt: string
  model: string
  options?: GenerateRequest
}

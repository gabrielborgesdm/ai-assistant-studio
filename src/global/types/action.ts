import { GenerateRequest } from 'ollama'

export enum ActionMode {
  Generation = 'generation',
  Chat = 'chat'
}

export interface Action {
  id: string
  title: string
  description: string
  prompt: string
  model: string
  options?: GenerateRequest
  downloaded?: boolean
  mode?: ActionMode
}

export interface ActionMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
  images?: string[]
}

export interface ActionHistory {
  actionId: string
  messages: ActionMessage[]
}

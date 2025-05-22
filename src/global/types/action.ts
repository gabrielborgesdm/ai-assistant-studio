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

export enum MessageRole {
  SYSTEM = 'system',
  USER = 'user',
  ASSISTANT = 'assistant',
  CUSTOM_UI = 'custom_ui' // This will be filtered out in the ollama input, but used to show the UI
}

export interface ActionMessage {
  role: MessageRole
  content: string
  images?: string[]
}

export interface ActionHistory {
  actionId: string
  messages: ActionMessage[]
}

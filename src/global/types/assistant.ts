import { GenerateRequest } from 'ollama'

export interface Assistant {
  id: string
  title: string
  description: string
  prompt: string
  model: string
  options?: GenerateRequest
  downloaded?: boolean
  ephemeral?: boolean
}

export enum MessageRole {
  SYSTEM = 'system',
  USER = 'user',
  ASSISTANT = 'assistant',

  // Custom_ roles are filtered out in the ollama input, but used for other purposes
  // like displaying a message in the UI
  CUSTOM_UI = 'custom_ui',
  CUSTOM_ERROR = 'custom_error'
}

export interface AssistantMessage {
  role: MessageRole
  content: string
  images?: string[]
}

export interface AssistantHistory {
  assistantId: string
  messages: AssistantMessage[]
}

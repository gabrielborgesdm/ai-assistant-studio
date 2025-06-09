import { GenerateRequest } from 'ollama'
import { z } from 'zod'

export interface Assistant {
  id: string
  title: string
  description: string
  model: string
  options?: GenerateRequest
  downloaded?: boolean
  ephemeral?: boolean
  prompt?: string
  systemBehavior?: string
  allowImage?: boolean
}

export type AssistantData = Omit<Assistant, 'id'> & { id?: string | undefined }

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

// Define the custom field schema
// Define the main form schema
export const assistantFormSchema = z.object({
  title: z.string().min(1, 'Assistant name is required'),
  description: z.string(),
  model: z.string().min(1, 'Model selection is required'),
  ephemeral: z.boolean(),
  systemBehaviour: z.string().optional(),
  prompt: z.string().optional(),
  allowImageUpload: z.boolean()
})

// Define the type based on the schema
export type AssistantFormData = z.infer<typeof assistantFormSchema>

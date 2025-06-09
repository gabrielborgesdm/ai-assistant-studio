import {
  AssistantData,
  AssistantFormData,
  AssistantHistory,
  AssistantMessage,
  MessageRole
} from '@global/types/assistant'

export const AssistantDataFactory = (
  assistantData: AssistantFormData,
  assistantId: string | undefined
): AssistantData => {
  return {
    id: assistantId || undefined,
    ...assistantData
  }
}

export const HistoryFactory = (
  assistantId: string,
  messages: AssistantMessage[] = []
): AssistantHistory => ({
  assistantId,
  messages
})

export const AssistantMessageFactory = (
  role: MessageRole,
  content: string,
  images?: string[] | undefined
): AssistantMessage => {
  const message: AssistantMessage = {
    role,
    content
  }

  if (images?.length) {
    message.images = images
  }

  return message
}

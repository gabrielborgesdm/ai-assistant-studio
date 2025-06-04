import { AssistantMessage, AssistantHistory, MessageRole } from '@global/types/assistant'

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

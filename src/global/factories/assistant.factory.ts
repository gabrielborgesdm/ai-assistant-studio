import { AssistantMessage, AssistantHistory, MessageRole } from '@global/types/assistant'

export const HistoryFactory = (
  assistantId: string,
  messages: AssistantMessage[] = []
): AssistantHistory => ({
  assistantId,
  messages
})

export const AssistantMessageFactory = (role: MessageRole, content: string): AssistantMessage => ({
  role,
  content
})

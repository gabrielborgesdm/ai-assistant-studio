import { AssistantMessage, AssistantHistory } from 'src/global/types/assistant'

export const HistoryFactory = (
  assistantId: string,
  messages: AssistantMessage[] = []
): AssistantHistory => ({
  assistantId,
  messages
})

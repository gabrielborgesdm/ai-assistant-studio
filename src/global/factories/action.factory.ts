import { AssistantMessage, ActionHistory } from 'src/global/types/assistant'

export const HistoryFactory = (
  actionId: string,
  messages: AssistantMessage[] = []
): ActionHistory => ({
  actionId,
  messages
})

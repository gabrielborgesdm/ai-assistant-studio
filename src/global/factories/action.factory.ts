import { ActionMessage, ActionHistory } from '@global/types/action'

export const HistoryFactory = (
  actionId: string,
  messages: ActionMessage[] = []
): ActionHistory => ({
  actionId,
  messages
})

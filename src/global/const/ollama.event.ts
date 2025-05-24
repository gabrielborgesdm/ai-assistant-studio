import { EventCancel, EventReply } from './event'

export const ChatEvent = 'ollama-chat'
export const ChatEventReply = EventReply(ChatEvent)
export const ChatEventCancel = EventCancel(ChatEvent)

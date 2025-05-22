import { EventCancel, EventReply } from './event'

export const GenerateEvent = 'ollama-generate'
export const GenerateEventReply = EventReply(GenerateEvent)
export const GenerateEventCancel = EventCancel(GenerateEvent)

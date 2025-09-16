import { EventCancel, EventReply } from "@global/utils/event.utils";

export const ChatEvent = "llm-chat";
export const ChatEventReply = EventReply(ChatEvent);
export const ChatEventCancel = EventCancel(ChatEvent);

export const AutoGenerateEvent = "llm-auto-generate";
export const AutoGenerateEventReply = EventReply(AutoGenerateEvent);
export const AutoGenerateEventCancel = EventCancel(AutoGenerateEvent);
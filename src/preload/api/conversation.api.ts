import { ipcRenderer } from "electron";
import {
  GetConversationEvent,
  SaveConversationEvent,
  ClearConversationMessagesEvent,
  GetAllConversationsEvent,
} from "@global/const/conversation.event";

export const conversationApi = {
  getConversation: (assistantId: string, conversationId?: string) =>
    ipcRenderer.invoke(GetConversationEvent, assistantId, conversationId),
  saveConversation: (assistantId: string, conversationId: string | undefined, messages?, forceNew?: boolean) =>
    ipcRenderer.invoke(SaveConversationEvent, assistantId, conversationId, messages, forceNew),
  clearConversationMessages: (conversationId: string) =>
    ipcRenderer.invoke(ClearConversationMessagesEvent, conversationId),
  getAllConversations: (assistantId: string) =>
    ipcRenderer.invoke(GetAllConversationsEvent, assistantId),
};
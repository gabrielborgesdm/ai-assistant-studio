import { ipcRenderer } from "electron";
import {
  GetConversationEvent,
  SaveConversationEvent,
  ClearConversationMessagesEvent,
  DeleteConversationEvent,
  UpdateConversationTitleEvent,
  GetAllConversationsEvent,
} from "@global/const/conversation.event";

export const conversationApi = {
  getConversation: (assistantId: string, conversationId?: string) =>
    ipcRenderer.invoke(GetConversationEvent, assistantId, conversationId),
  saveConversation: (assistantId: string, conversationId: string | undefined, messages?, forceNew?: boolean) =>
    ipcRenderer.invoke(SaveConversationEvent, assistantId, conversationId, messages, forceNew),
  clearConversationMessages: (conversationId: string) =>
    ipcRenderer.invoke(ClearConversationMessagesEvent, conversationId),
  deleteConversation: (conversationId: string) =>
    ipcRenderer.invoke(DeleteConversationEvent, conversationId),
  updateConversationTitle: (conversationId: string, title: string) =>
    ipcRenderer.invoke(UpdateConversationTitleEvent, conversationId, title),
  getAllConversations: (assistantId: string) =>
    ipcRenderer.invoke(GetAllConversationsEvent, assistantId),
};
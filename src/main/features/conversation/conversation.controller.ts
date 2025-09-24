import {
  GetConversationEvent,
  SaveConversationEvent,
  ClearConversationMessagesEvent,
  DeleteConversationEvent,
  UpdateConversationTitleEvent,
  GetAllConversationsEvent,
} from "@global/const/conversation.event";
import { Message } from "@global/types/assistant";
import ConversationService from "@main/features/conversation/conversation.service";
import { ipcMain } from "electron";

export const setupConversationController = (): void => {
  const conversationService = new ConversationService();

  ipcMain.handle(
    GetConversationEvent,
    (_event, assistantId: string, conversationId?: string) =>
      conversationService.getConversation(assistantId, conversationId)
  );

  ipcMain.handle(
    SaveConversationEvent,
    (
      _event,
      assistantId: string,
      conversationId: string | undefined,
      messages?: Message[],
      forceNew?: boolean
    ) => conversationService.saveConversation(assistantId, conversationId, messages, forceNew)
  );

  ipcMain.handle(
    ClearConversationMessagesEvent,
    (_event, conversationId: string) =>
      conversationService.deleteConversation(conversationId)
  );
  ipcMain.handle(
    DeleteConversationEvent,
    (_event, conversationId: string) =>
      conversationService.deleteConversation(conversationId)
  );

  ipcMain.handle(
    UpdateConversationTitleEvent,
    (_event, conversationId: string, title: string) =>
      conversationService.updateConversationTitle(conversationId, title)
  );

  ipcMain.handle(
    GetAllConversationsEvent,
    (_event, assistantId: string) =>
      conversationService.getAllConversations(assistantId)
  );
};
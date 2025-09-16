import {
  GetConversationEvent,
  SaveConversationEvent,
  ClearConversationMessagesEvent,
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
      messages?: Message[]
    ) => conversationService.saveConversation(assistantId, conversationId, messages)
  );

  ipcMain.handle(
    ClearConversationMessagesEvent,
    (_event, conversationId: string) =>
      conversationService.clearConversationMessages(conversationId)
  );

  ipcMain.handle(
    GetAllConversationsEvent,
    (_event, assistantId: string) =>
      conversationService.conversationRepository.getAllAssistantConversations(assistantId)
  );
};
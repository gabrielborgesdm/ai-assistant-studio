import {
  DeleteAssistantEvent, GetAssistantsEvent,
  GetHistoryEvent,
  RefreshModelStatusEvent,
  SaveAssistantEvent
} from "@global/const/db.event";
import { AssistantFormData } from "@global/types/assistant";
import AssistantService from "@main/features/assistants/assistants.service";
import ConversationService from "@main/features/conversation/conversation.service";
import { ipcMain } from "electron";

export const setupAssistantsController = (): void => {
  const assistantService = new AssistantService();
  const conversationService = new ConversationService();

  ipcMain.handle(GetAssistantsEvent, () => assistantService.getAssistants());

  ipcMain.handle(GetHistoryEvent, (_event, assistantId) =>
    conversationService.getConversation(assistantId),
  );

  ipcMain.handle(
    SaveAssistantEvent,
    (
      _event,
      assistantData: AssistantFormData,
      assistantId: string | undefined,
    ) => assistantService.saveAssistant(assistantData, assistantId),
  );

  ipcMain.handle(DeleteAssistantEvent, (_event, assistantId: string) =>
    assistantService.deleteAssistant(assistantId),
  );

  ipcMain.handle(RefreshModelStatusEvent, () =>
    assistantService.refreshModelDownloadStatus(),
  );
};

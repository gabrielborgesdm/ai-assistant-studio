import { DBType } from "@main/features/database/db.type";
import { DeleteAssistantEvent } from "@global/const/db.event";
import { ipcMain } from "electron";
import {
  AddAssistantMessageEvent,
  ClearHistoryEvent,
  GetAssistantsEvent,
  GetHistoryEvent,
  SaveAssistantEvent,
} from "@global/const/db.event";
import AssistantService from "@main/features/assistants/assistants.service";
import { AssistantFormData, AssistantMessage } from "@global/types/assistant";

export const setupAssistantsController = (db: DBType): void => {
  const assistantService = new AssistantService(db);

  ipcMain.handle(GetAssistantsEvent, () => assistantService.getAssistants());

  ipcMain.handle(GetHistoryEvent, (_event, assistantId) =>
    assistantService.getHistory(assistantId),
  );

  ipcMain.handle(
    AddAssistantMessageEvent,
    (_event, assistantId: string, messages: AssistantMessage[]) =>
      assistantService.addAssistantMessage(assistantId, messages),
  );

  ipcMain.handle(ClearHistoryEvent, (_event, assistantId: string) =>
    assistantService.clearHistory(assistantId),
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
};

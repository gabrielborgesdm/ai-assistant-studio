/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  DeleteModelEvent,
  DownloadModelEvent,
  getDownloadModelEventCancel,
  getDownloadModelEventReply,
  ListModelsEvent,
  OllamaIsInstalledEvent,
  SearchOnlineModelsEvent,
  WarmupOllamaEvent
} from "@global/const/ollama.event";
import { ModelDownload } from "@global/types/model";
import { ipcMain } from "electron";
import OllamaService from "@main/features/ollama/ollama.service";

export const setupOllamaController = (): void => {
  const ollamaService = new OllamaService();

  // I need to be able to run this in parallel according to the model name and cancel it if the user requests it
  ipcMain.on(DownloadModelEvent, async (event, model: ModelDownload) => {
    const eventReply = getDownloadModelEventReply(model);
    const abort = new AbortController();

    // Listen for the cancel event
    ipcMain.once(getDownloadModelEventCancel(model), () => {
      console.log(
        "Received cancel request from renderer",
        getDownloadModelEventCancel(model),
      );
      abort.abort();
    });

    // Call the function to stream the response passing the abort controller
    await ollamaService.downloadModel(event, eventReply, model, abort);
  });

  ipcMain.handle(OllamaIsInstalledEvent, () =>
    ollamaService.checkOllamaRunning(),
  );
  ipcMain.handle(ListModelsEvent, () => ollamaService.listModels());

  ipcMain.handle(SearchOnlineModelsEvent, (_event, query: string) =>
    ollamaService.searchOnlineModels(query),
  );

  ipcMain.handle(WarmupOllamaEvent, (_event, model: string) =>
    ollamaService.warmupOllama(model),
  );

  ipcMain.handle(DeleteModelEvent, (_event, model: string) =>
    ollamaService.deleteModel(model),
  );
};

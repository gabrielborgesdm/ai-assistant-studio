import {
  DeleteModelEvent,
  DownloadModelEvent,
  getDownloadModelEventReply,
  ListModelsEvent,
  OllamaIsInstalledEvent,
  SearchOnlineModelsEvent,
  WarmupOllamaEvent,
} from "@global/const/ollama.event";
import { ipcRenderer } from "electron";

// This file is used to expose the database API to the renderer process
// It uses Electron's IPC (Inter-Process Communication) to communicate with the main process

export const ollamaApi = {
  downloadModel: (model, callback) => {
    const eventReply = getDownloadModelEventReply(model);
    ipcRenderer.removeAllListeners(eventReply); // Remove any previous listeners to avoid duplicates

    console.log("calling downloadModel", DownloadModelEvent);
    ipcRenderer.send(DownloadModelEvent, model);

    const listener = (_event: Electron.IpcRendererEvent, result): void => {
      callback(result);
    };

    ipcRenderer.on(eventReply, listener);
  },
  listModels: () => ipcRenderer.invoke(ListModelsEvent),
  checkOllamaRunning: () => ipcRenderer.invoke(OllamaIsInstalledEvent),
  searchOnlineModels: (query: string) =>
    ipcRenderer.invoke(SearchOnlineModelsEvent, query),
  warmupOllama: (model: string) => ipcRenderer.invoke(WarmupOllamaEvent, model),
  deleteModel: (model: string) => ipcRenderer.invoke(DeleteModelEvent, model),
};

import { EventCancel } from "@global/utils/event.utils";
import { ipcRenderer } from "electron";
import { assistantsApi } from "@preload/api/assistants.api";
import { fileApi } from "@preload/api/file.api";
import { ollamaApi } from "@preload/api/ollama.api";
import { configApi } from "@preload/api/config.api";

/*
 * This file is used to define the API that will be exposed to the renderer process.
 */

export const api = {
  ollama: ollamaApi,
  assistants: assistantsApi,
  file: fileApi,
  config: configApi,

  // This function allows the renderer process to cancel an event
  cancel: (eventName: string) => {
    console.log("Cancelling event:", eventName);
    ipcRenderer.send(EventCancel(eventName)); // Remove all listeners for the event
    // Remove the listener if the event is cancelled
  },
};

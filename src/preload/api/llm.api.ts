import {
  ChatEvent,
  ChatEventReply,
  AutoGenerateEvent,
  AutoGenerateEventReply,
} from "@global/const/llm.event";
import { Conversation } from "@global/types/assistant";
import { LlmMessageStreamResponse } from "@global/types/llm";
import { ipcRenderer } from "electron";

export const llmApi = {
  streamLlmChat: (assistantId: string, conversation: Conversation, message: string, images: string[] | undefined, callback: (response: LlmMessageStreamResponse) => void) => {
    ipcRenderer.removeAllListeners(ChatEventReply);
    console.log("calling streamLlmChat");
    ipcRenderer.send(ChatEvent, assistantId, conversation, message, images);

    const listener = (_event: Electron.IpcRendererEvent, result): void => {
      callback(result);
    };

    ipcRenderer.on(ChatEventReply, listener);
  },

  streamLlmAutoGenerate: (templateAssistantId: string, configuration: Record<string, any>, previousMessages: any[], callback: (response: LlmMessageStreamResponse) => void) => {
    ipcRenderer.removeAllListeners(AutoGenerateEventReply);
    console.log("calling streamLlmAutoGenerate");
    ipcRenderer.send(AutoGenerateEvent, templateAssistantId, configuration, previousMessages);

    const listener = (_event: Electron.IpcRendererEvent, result): void => {
      callback(result);
    };

    ipcRenderer.on(AutoGenerateEventReply, listener);
  },
};

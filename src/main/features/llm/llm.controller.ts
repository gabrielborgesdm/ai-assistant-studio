/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChatEvent,
  ChatEventCancel,
  AutoGenerateEvent,
  AutoGenerateEventCancel
} from "@global/const/llm.event";
import { Conversation } from "@global/types/assistant";
import OllamaService from "@main/features/llm/llm.service";
import { ipcMain } from "electron";

export const setupLlmController = (): void => {
  const ollamaService = new OllamaService();
  ipcMain.on(
    ChatEvent,
    async (event, assistantId: string, conversation: Conversation, message: string, images: string[] | undefined) => {
      // Initialize the abort controller
      const abort = new AbortController();

      // Listen for the cancel event
      ipcMain.once(ChatEventCancel, () => {
        console.log("Received cancel request from renderer");
        abort.abort();
      });
      console.log("Received streamOllamaChatResponse request from renderer");

      // Call the function to stream the response passing the abort controller
      await ollamaService.streamLlmChat(
        assistantId,
        conversation,
        message,
        images,
        event,
        abort,
      );
    },
  );

  ipcMain.on(
    AutoGenerateEvent,
    async (event, templateAssistantId: string, configuration: Record<string, any>, previousMessages: any[]) => {
      // Initialize the abort controller
      const abort = new AbortController();

      // Listen for the cancel event
      ipcMain.once(AutoGenerateEventCancel, () => {
        console.log("Received auto-generate cancel request from renderer");
        abort.abort();
      });
      console.log("Received streamLlmAutoGenerate request from renderer");

      // Call the function to stream the auto-generation response
      await ollamaService.streamLlmAutoGenerate(
        templateAssistantId,
        configuration,
        previousMessages,
        event,
        abort,
      );
    },
  );
};

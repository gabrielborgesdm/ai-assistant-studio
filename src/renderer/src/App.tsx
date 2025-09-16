import { SidebarComponent } from "@/components/features/sidebar";
import { ChatPage } from "@/components/pages/chat";
import { SetupPage } from "@/components/pages/setup";
import { SidebarProvider } from "@/components/ui/sidebar";
import { GlobalProvider } from "@/provider/GlobalProvider";
import { PageProvider } from "@/provider/PageProvider";
import { RequirementsProvider } from "@/provider/RequirementsProvider";
import {
  Assistant,
  AssistantFormData,
  Conversation,
  Message,
} from "@global/types/assistant";
import { Config } from "@global/types/config";
import { ModelDownload, OllamaModel } from "@global/types/model";
import { AssistantManagementPage } from "@/components/pages/assistant-management";
import { ReactElement } from "react";
import { Toaster } from "@/components/ui/sonner";
import { ConfigPage } from "@/components/pages/config";
import { AssistantProvider } from "@/provider/AssistantProvider";
import { LlmMessageStreamResponse } from "@global/types/llm";

/**
 * Global window object to expose API methods and data
 * These methods are defined in /preload directory and use the Electron ipcRenderer to communicate with the main process
 */
declare global {
  interface Window {
    api: {
      ollama: {
        checkOllamaRunning: () => Promise<boolean>;
        downloadModel: (
          model: ModelDownload,
          callback: (response) => void,
        ) => Promise<void>;
        listModels: () => Promise<string[]>;
        searchOnlineModels: (query?: string) => Promise<OllamaModel[]>;
        warmupOllama: (model: string) => Promise<void>;
        deleteModel: (model: string) => Promise<boolean>;
      };
      llm: {
        streamLlmChat: (
          assistantId: string,
          conversation: Conversation | null,
          message: string,
          images: string[] | undefined,
          callback: (response: LlmMessageStreamResponse) => void,
        ) => Promise<void>;
        streamLlmAutoGenerate: (
          templateAssistantId: string,
          configuration: Record<string, any>,
          previousMessages: any[],
          callback: (response: LlmMessageStreamResponse) => void,
        ) => Promise<void>;
      };
      assistants: {
        getAssistants: () => Promise<Assistant[]>;
        addAssistantMessage: (
          assistantId: string,
          messages: Message[],
        ) => Promise<Conversation | null>;
        saveAssistant: (
          assistantData: AssistantFormData,
          assistantId: string | undefined,
        ) => Promise<Assistant>;
        deleteAssistant: (assistantId: string) => Promise<void>;
      };
      conversation: {
        getConversation: (
          assistantId: string,
          conversationId?: string,
        ) => Promise<Conversation | null>;
        saveConversation: (
          assistantId: string,
          conversationId: string | undefined,
          messages?: Message[],
        ) => Promise<Conversation | null>;
        clearConversationMessages: (conversationId: string) => Promise<void>;
        getAllConversations: (assistantId: string) => Promise<Conversation[]>;
      };
      file: {
        getDirectoryPath: () => Promise<string | undefined>;
        selectImage: () => Promise<
          { buffer: string; name: string; type: string } | undefined
        >;
      };
      config: {
        registerShortcut: (accelerator: string) => Promise<string | undefined>;
        registerStartup: (runAtStartup: boolean) => Promise<boolean>;
        getConfig: () => Promise<Config | undefined>;
        getOs: () => Promise<string>;
      };
      cancel: (eventName: string) => void;
    };
  }
}

export default function App(): ReactElement {
  return (
    <div className="bg-background text-foreground ">
      <GlobalProvider>
        <PageProvider>
          <SidebarProvider defaultOpen>
            <RequirementsProvider>
              <AssistantProvider>
                <SidebarComponent />
                <main className="flex flex-row w-full">
                  {/* The Setup Page is the initial page */}
                  <SetupPage />
                  <ChatPage />
                  <AssistantManagementPage />
                  <ConfigPage />
                </main>
              </AssistantProvider>
            </RequirementsProvider>
          </SidebarProvider>
        </PageProvider>
      </GlobalProvider>
      <Toaster
        toastOptions={{ style: { maxWidth: "300px" }, duration: 3000 }}
        closeButton
      />
    </div>
  );
}

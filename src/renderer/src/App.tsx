import { SidebarComponent } from '@/components/features/sidebar'
import { ChatPage } from '@/components/pages/chat'
import { SidebarProvider } from '@/components/ui/sidebar'
import {
  Assistant,
  AssistantFormData,
  AssistantHistory,
  AssistantMessage
} from '@global/types/assistant'
import { ReactElement } from 'react'
import { PageProvider } from '@/provider/PageProvider'
import { SetupPage } from '@/components/pages/setup'
import { RequirementsProvider } from '@/provider/RequirementsProvider'
import { ModelDownload, OllamaModel } from '@global/types/model'
import { GlobalProvider } from '@/provider/GlobalProvider'
import { Toaster } from 'sonner'
import { AssistantManagementPage } from '@renderer/components/pages/assistant-management'

/**
 * Global window object to expose API methods and data
 * These methods are defined in /preload directory and use the Electron ipcRenderer to communicate with the main process
 */
declare global {
  interface Window {
    api: {
      ollama: {
        streamOllamaChatResponse: (
          assistant: Assistant,
          history: AssistantHistory,
          callback: (response) => void
        ) => Promise<void>
        checkOllamaRunning: () => Promise<boolean>
        downloadModel: (model: ModelDownload, callback: (response) => void) => Promise<void>
        listModels: () => Promise<string[]>
        searchOnlineModels: (query?: string) => Promise<OllamaModel[]>
      }
      db: {
        getAssistants: () => Promise<Assistant[]>
        getHistory: (assistantId: string) => Promise<AssistantHistory | undefined>
        addAssistantMessage: (
          assistantId: string,
          messages: AssistantMessage[]
        ) => Promise<AssistantHistory>
        saveAssistant: (
          assistantData: AssistantFormData,
          assistantId: string | undefined
        ) => Promise<Assistant>
        clearHistory: (assistantId: string) => Promise<void>
        deleteAssistant: (assistantId: string) => Promise<void>
      }
      file: {
        selectImage: () => Promise<{ buffer: string; name: string; type: string } | undefined>
      }
      cancel: (eventName: string) => void
    }
  }
}

export default function App(): ReactElement {
  return (
    <div className="bg-background text-foreground ">
      <GlobalProvider>
        <PageProvider>
          <SidebarProvider defaultOpen>
            <RequirementsProvider>
              <SidebarComponent />
              <main className="flex flex-row w-full">
                {/* The Setup Page is the initial page */}
                <SetupPage />
                <ChatPage />
                <AssistantManagementPage />
              </main>
            </RequirementsProvider>
          </SidebarProvider>
        </PageProvider>
      </GlobalProvider>
      <Toaster position="bottom-left" />
    </div>
  )
}

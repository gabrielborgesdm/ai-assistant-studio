import { SidebarComponent } from '@/components/features/sidebar'
import { ChatPage } from '@/components/pages/chat'
import { SidebarProvider } from '@/components/ui/sidebar'
import { Assistant, AssistantHistory, AssistantMessage } from '@global/types/assistant'
import { ReactElement } from 'react'
import { PageProvider } from '@/provider/PageProvider'
import { SetupPage } from '@/components/pages/setup'
import { RequirementsProvider } from '@/provider/RequirementsProvider'

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
        checkOllamaIsInstalled: () => Promise<boolean>
      }
      db: {
        getAssistants: () => Promise<Assistant[]>
        getHistory: (assistantId: string) => Promise<AssistantHistory | undefined>
        addAssistantMessage: (
          assistantId: string,
          messages: AssistantMessage[]
        ) => Promise<AssistantHistory>
        clearHistory: (assistantId: string) => Promise<void>
      }
      cancel: (eventName: string) => void
    }
  }
}

export default function App(): ReactElement {
  return (
    <div className="bg-background text-foreground ">
      <PageProvider>
        <SidebarProvider>
          <RequirementsProvider>
            <SidebarComponent />
            <main className="flex flex-row w-full">
              {/* The Setup Page is the initial page */}
              <SetupPage />
              <ChatPage />
            </main>
          </RequirementsProvider>
        </SidebarProvider>
      </PageProvider>
    </div>
  )
}

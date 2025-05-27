import { SidebarComponent } from '@/components/features/sidebar'
import { ChatPage } from '@/components/pages/chat'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AssistantHistory, Assistant, AssistantMessage } from '@global/types/assistant'
import { ReactElement } from 'react'

/**
 * Global window object to expose API methods and data
 * These methods are defined in /preload directory and use the Electron ipcRenderer to communicate with the main process
 *
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
      <SidebarProvider>
        <SidebarComponent />
        <main className="flex flex-row w-full">
          <ChatPage />
        </main>
      </SidebarProvider>
    </div>
  )
}

import { SidebarComponent } from '@/components/features/sidebar'
import { ChatPage } from '@/components/pages/chat'
import { SidebarProvider } from '@/components/ui/sidebar'
import { ActionHistory, Assistant, AssistantMessage } from '@global/types/assistant'
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
          action: Assistant,
          history: ActionHistory,
          callback: (response) => void
        ) => Promise<void>
      }
      db: {
        getActions: () => Promise<Assistant[]>
        getHistory: (actionId: string) => Promise<ActionHistory | undefined>
        addActionMessage: (actionId: string, messages: AssistantMessage[]) => Promise<ActionHistory>
        clearHistory: (actionId: string) => Promise<void>
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

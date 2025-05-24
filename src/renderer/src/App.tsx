import { Action, ActionHistory, ActionMessage } from '@global/types/action'
import { ReactElement } from 'react'
import { Chat } from './components/Chat/Chat'
import { Form } from './components/Form'
import { Layout } from './components/Layout'

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
          action: Action,
          history: ActionHistory,
          callback: (response) => void
        ) => Promise<void>
      }
      db: {
        getActions: () => Promise<Action[]>
        getHistory: (actionId: string) => Promise<ActionHistory | undefined>
        addActionMessage: (actionId: string, messages: ActionMessage[]) => Promise<ActionHistory>
        clearHistory: (actionId: string) => Promise<void>
      }
      cancel: (eventName: string) => void
    }
  }
}

export default function App(): ReactElement {
  return (
    <Layout>
      <Chat />
      <Form />
    </Layout>
  )
}

import { Action, ActionHistory, ActionMessage } from '@global/types/action'
import { ReactElement } from 'react'
import { Chat } from './components/Chat/Chat'
import { Form } from './components/Form'
import { Layout } from './components/Layout'

declare global {
  interface Window {
    api: {
      ollama: {
        generate: (input: string, action: Action, callback: (response) => void) => Promise<void>
      }
      db: {
        getActions: () => Promise<Action[]>
        getHistory: (actionId: string) => Promise<ActionHistory | undefined>
        addActionMessage: (actionId: string, message: ActionMessage) => Promise<ActionHistory>
        clearHistory: (actionId: string) => Promise<void>
      }
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

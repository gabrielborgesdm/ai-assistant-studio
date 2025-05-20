import { FormEvent, ReactElement, useEffect, useState } from 'react'
import { Layout } from './components/Layout'
import { Chat } from './components/Chat'
import { Form } from './components/Form'
import { useDataContext } from './context/DataContext'
import { Action } from '@global/types/action'

declare global {
  interface Window {
    api: {
      ollama: {
        generate: (input: string, action: Action, callback: (response) => void) => Promise<void>
      }
      db: {
        getActions: () => Promise<Action[]>
      }
    }
  }
}

export default function App(): ReactElement {
  const [input, setInput] = useState('')
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { selectedAction, setActions, actions, setSelectedAction } = useDataContext()

  useEffect(() => {
    window.api.db.getActions().then(setActions)
  }, [])

  useEffect(() => {
    // set the first action as selected by default
    if (actions.length > 0 && !selectedAction) {
      setSelectedAction(actions[0])
      console.log('Selected action as default action:', actions[0].title)
    }
  }, [actions, selectedAction])

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    if (!selectedAction) {
      console.error('No action selected')
      return
    }

    e.preventDefault()
    setIsLoading(true)
    const prompt = input
    setInput('')
    setResponse('')
    setIsLoading(true)

    window.api.ollama.generate(prompt, selectedAction, (res) => {
      if (!res) {
        setResponse('Error: An error occurred while generating the response.')
        return
      }
      setResponse((old) => `${old}${res.response}`)
      setIsLoading(false)
    })
  }

  useEffect(() => {
    setResponse('')
  }, [selectedAction])

  return (
    <Layout>
      <Chat response={response} isLoading={isLoading} />
      <Form onSubmit={handleSubmit} input={input} setInput={setInput} isLoading={isLoading} />
    </Layout>
  )
}

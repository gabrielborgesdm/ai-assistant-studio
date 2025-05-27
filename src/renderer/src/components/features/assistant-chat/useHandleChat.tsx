import { ChatEvent } from '@global/const/ollama.event'
import { Assistant, ActionHistory, AssistantMessage, MessageRole } from '@global/types/assistant'
import { OllamaMessageStreamResponse } from '@global/types/ollama'
import { FormEvent, useEffect, useState } from 'react'

interface useHandleChatProps {
  history: ActionHistory | undefined
  setHistory: (history: ActionHistory | undefined) => void
  textInput: string
  setTextInput: (textInput: string) => void
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
  currentAssistantMessage: string | undefined
  canceled: boolean
  setCanceled: (canceled: boolean) => void
  setCurrentAssistantMessage: (message: string | undefined) => void
  handleClearHistory: () => void
  handleCancelMessageRequest: () => void
  handleSubmit: (e: FormEvent) => Promise<void>
}

export const useHandleChat = (assistant: Assistant): useHandleChatProps => {
  const [history, setHistory] = useState<ActionHistory | undefined>(undefined)
  const [textInput, setTextInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentAssistantMessage, setCurrentAssistantMessage] = useState<string | undefined>(
    undefined
  )
  const [canceled, setCanceled] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)

  /**
   * Clear the assistant history
   * Call the API to clear the history for the selected assistant while also updating the state
   * Also clear the current assistant message to an empty string
   */
  const handleClearHistory = (): void => {
    if (!assistant) {
      return
    }

    console.log('Clearing history for assistant:', assistant.id)
    window.api.db.clearHistory(assistant.id)
    setHistory(history ? { ...history, messages: [] } : undefined)
    setCurrentAssistantMessage(undefined)
  }

  const handleCancelMessageRequest = (): void => {
    window.api.cancel(ChatEvent)
    setCanceled(true)
    setIsLoading(false)
  }

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    if (!assistant) {
      console.error('No assistant selected')
      return
    }

    e.preventDefault()
    setIsLoading(true)
    const newHistory = await window.api.db.addActionMessage(assistant.id, [
      {
        role: MessageRole.USER,
        content: textInput
      }
    ])
    setHistory({ ...newHistory })
    setTextInput('')
    // Set the current assistant message to an empty string to show the loading icon
    setCurrentAssistantMessage('')
    window.api.ollama.streamOllamaChatResponse(
      assistant,
      newHistory,
      async (res: OllamaMessageStreamResponse) => {
        // If we get the stream response, we need to update the chat state
        if (res.response) {
          setCurrentAssistantMessage((old: string | undefined) => `${old || ''}${res.response}`)
        }

        // Not supposed to happen, but show a generic error message if the response is empty
        if (res.error) {
          setError(res.error)
          setIsLoading(false)
          return
        }

        // When the stream is done, we need to update the chat state, so that the useEffect can store the completed message
        if (res.done) {
          setIsLoading(false)
        }
      }
    )
  }

  const persistMessage = async (): Promise<void> => {
    if (!assistant) {
      return
    }

    const messagesToInclude: AssistantMessage[] = []

    if (currentAssistantMessage) {
      messagesToInclude.push({
        role: MessageRole.ASSISTANT,
        content: currentAssistantMessage
      })
    }

    if (error) {
      messagesToInclude.push({
        role: MessageRole.CUSTOM_ERROR,
        content: error
      })
    }

    if (canceled) {
      messagesToInclude.push({
        role: MessageRole.CUSTOM_UI,
        content: 'Action was canceled by the user'
      })
    }

    const newHistory = await window.api.db.addActionMessage(assistant.id, messagesToInclude)

    setHistory(newHistory)
    setCurrentAssistantMessage(undefined)
    setError(undefined)
    setCanceled(false)
  }

  /**
   * We don't want to persist the message until the assistant message is done generating, so when It's done the useEffect will trigger and persist the message.
   * We couldn't call the persistMessage function directly because the callback holds the closure of when the function was created,
   * instead, we use the useEffect to trigger the persistMessage function when the loading state changes.
   */
  useEffect(() => {
    if ((!isLoading && currentAssistantMessage !== undefined) || error) {
      persistMessage()
    }
  }, [isLoading])

  // Load the history when the assistant changes
  useEffect(() => {
    window.api.db.getHistory(assistant.id).then(setHistory)
  }, [assistant])

  return {
    history,
    setHistory,
    textInput,
    setTextInput,
    isLoading,
    setIsLoading,
    currentAssistantMessage,
    setCurrentAssistantMessage,
    canceled,
    setCanceled,
    handleClearHistory,
    handleCancelMessageRequest,
    handleSubmit
  }
}

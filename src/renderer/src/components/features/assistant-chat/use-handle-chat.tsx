import { ChatEvent } from '@global/const/ollama.event'
import { Assistant, AssistantHistory, AssistantMessage, MessageRole } from '@global/types/assistant'
import { OllamaMessageStreamResponse } from '@global/types/ollama'
import { Page } from '@renderer/pages'
import { usePageContext } from '@renderer/provider/PageProvider'
import { FormEvent, useEffect, useState } from 'react'
import { useManageModel } from '../model-status/use-manage-model'
import { useGlobalContext } from '@renderer/provider/GlobalProvider'
import { fileToBase64 } from '@global/utils/file.utils'
import { AssistantMessageFactory } from '@global/factories/assistant.factory'

interface useHandleChatProps {
  images: File[]
  onRemoveImage: (image: File) => void
  onAddImage: (image: File) => void
  onClickAttachFile: () => void
  history: AssistantHistory | undefined
  setHistory: (history: AssistantHistory | undefined) => void
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
  const { checkRequirementsAreMet, checkOllamaRunning } = useManageModel()
  const { setActivePage } = usePageContext()
  const { setIsSidebarDisabled } = useGlobalContext()
  const [history, setHistory] = useState<AssistantHistory | undefined>(undefined)
  const [textInput, setTextInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentAssistantMessage, setCurrentAssistantMessage] = useState<string | undefined>(
    undefined
  )
  const [canceled, setCanceled] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)
  const [images, setImages] = useState<File[]>([])

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
    window.api.assistants.clearHistory(assistant.id)
    setHistory(history ? { ...history, messages: [] } : undefined)
    setCurrentAssistantMessage(undefined)
    setImages([])
  }

  const handleCancelMessageRequest = (): void => {
    window.api.cancel(ChatEvent)
    setCanceled(true)
    setIsLoading(false)
  }

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault()

    if (!textInput || !textInput.trim()) {
      return
    }

    if (!assistant) {
      console.error('No assistant selected')
      return
    }

    setIsLoading(true)
    const base64Images = await getBase64Images()

    const newHistory = await window.api.assistants.addAssistantMessage(assistant.id, [
      AssistantMessageFactory(MessageRole.USER, textInput, base64Images)
    ])

    console.log('New history:', JSON.stringify(newHistory.messages))

    setHistory({ ...newHistory })
    setTextInput('')
    setImages([])
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

  const persistGeneratedMessage = async (): Promise<void> => {
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
        content: 'Generation was canceled by the user'
      })
    }

    const newHistory = await window.api.assistants.addAssistantMessage(
      assistant.id,
      messagesToInclude
    )

    setHistory(newHistory)
    setCurrentAssistantMessage(undefined)
    setError(undefined)
    setCanceled(false)
  }

  const getBase64Images = async (): Promise<string[] | undefined> => {
    if (!images) return undefined
    return Promise.all(images.map((image) => fileToBase64(image))).then((results) => {
      const filteredResults = results.filter((result) => result !== undefined) as string[]
      return filteredResults
    })
  }

  const onAddImage = (file: File): void => {
    setImages((prev) => [...prev, file])
  }

  const onRemoveImage = (file: File): void => {
    setImages((prev) => prev.filter((image) => image !== file))
  }

  // open electron file picker
  const onClickAttachFile = (): void => {
    window.api.file.selectImage().then((result) => {
      if (result) {
        const blob = new Blob([result.buffer], { type: result.type })
        const file = new File([blob], result.name, { type: result.type })
        onAddImage(file)
      }
    })
  }

  const validateRequirementsAndUpdateHistory = async (): Promise<void> => {
    const requirementsMet = checkRequirementsAreMet()
    const isOllamaRunning = await checkOllamaRunning()
    if (!requirementsMet || !isOllamaRunning) {
      console.log('requirements not met')
      setActivePage(Page.Setup)
      return
    }
    window.api.assistants.getHistory(assistant.id).then(setHistory)
  }

  /**
   * We don't want to persist the message until the assistant message is done generating, so when It's done the useEffect will trigger and persist the message.
   * We couldn't call the persistGeneratedMessage function directly because the callback holds the closure of when the function was created,
   * instead, we use the useEffect to trigger the persistGeneratedMessage function when the loading state changes.
   */
  useEffect(() => {
    if ((!isLoading && currentAssistantMessage !== undefined) || error) {
      persistGeneratedMessage()
    }
  }, [isLoading])

  // Load the history when the assistant changes
  useEffect(() => {
    validateRequirementsAndUpdateHistory()
  }, [assistant])

  useEffect(() => {
    setIsSidebarDisabled(isLoading)
  }, [isLoading])

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
    handleSubmit,
    images,
    onRemoveImage,
    onAddImage,
    onClickAttachFile
  }
}

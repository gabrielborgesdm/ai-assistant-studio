import { MessageRole } from '@global/types/action'
import { useDataContext } from '@renderer/context/DataContext'
import { SendHorizonal } from 'lucide-react'
import { FormEvent, useEffect } from 'react'
import { AnimatedLoader } from './shared/Loader'

export const Form = (): React.ReactElement => {
  const {
    selectedAction,
    setIsLoading,
    setTextInput,
    textInput,
    isLoading,
    setHistory,
    currentAssistantMessage,
    setCurrentAssistantMessage,
    canceled,
    setCanceled
  } = useDataContext()

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    if (!selectedAction) {
      console.error('No action selected')
      return
    }

    e.preventDefault()
    setIsLoading(true)
    const newHistory = await window.api.db.addActionMessage(selectedAction.id, [
      {
        role: MessageRole.USER,
        content: textInput
      }
    ])
    setHistory({ ...newHistory })

    const prompt = textInput
    console.log('Prompt:', prompt)
    setTextInput('')
    window.api.ollama.generate(prompt, selectedAction, async (res) => {
      // If we get the stream response, we need to update the chat state
      if (res.response) {
        setCurrentAssistantMessage((old: string) => `${old}${res.response}`)
      }

      // Not supposed to happen, but show a generic error message if the response is empty
      if (!res) {
        setCurrentAssistantMessage('Error: An error occurred while generating the response.')
        setIsLoading(false)
        return
      }

      // When the stream is done, we need to update the chat state, so that the useEffect can store the completed message
      if (res.done) {
        setIsLoading(false)
      }
    })
  }

  const persistMessage = async (): Promise<void> => {
    if (!selectedAction) {
      return
    }
    const messagesToInclude = [
      {
        role: MessageRole.ASSISTANT,
        content: currentAssistantMessage
      }
    ]

    if (canceled) {
      messagesToInclude.push({
        role: MessageRole.CUSTOM_UI,
        content: 'Action was canceled by the user'
      })
      setCanceled(false)
    }

    const newHistory = await window.api.db.addActionMessage(selectedAction.id, messagesToInclude)

    setHistory(newHistory)
    setCurrentAssistantMessage('')
  }

  /**
   * We don't want to persist the message until the assistant message is done generating, so when It's done the useEffect will trigger and persist the message.
   * We couldn't call the persistMessage function directly because the callback holds the closure of when the function was created,
   * instead, we use the useEffect to trigger the persistMessage function when the loading state changes.
   */
  useEffect(() => {
    if (!isLoading && currentAssistantMessage) {
      persistMessage()
    }
  }, [isLoading])

  return (
    <form onSubmit={handleSubmit} className="w-full py-5 px-4 border-t flex items-center gap-4">
      <input
        autoFocus
        disabled={isLoading}
        value={textInput}
        onChange={(e) => setTextInput(e.target.value)}
        className={`flex-grow ${isLoading && 'disabled'}`}
        placeholder="Enter your message"
      />
      <button
        disabled={isLoading}
        type="submit"
        title="Send"
        className={`w-15 h-full flex items-center justify-center content-center transparent
          ${isLoading ? 'loading' : 'cursor-pointer'}
        `}
      >
        {isLoading ? (
          <>
            <AnimatedLoader className="text-white" />
          </>
        ) : (
          <SendHorizonal className="text-white" />
        )}
      </button>
    </form>
  )
}

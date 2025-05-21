import { SendHorizonal } from 'lucide-react'
import { AnimatedLoader } from './shared/Loader'
import { FormEvent, use, useEffect, useState } from 'react'
import { useDataContext } from '@renderer/context/DataContext'

export const Form = (): React.ReactElement => {
  const {
    selectedAction,
    setIsLoading,
    setTextInput,
    textInput,
    isLoading,
    setHistory,
    currentAssistantMessage,
    setCurrentAssistantMessage
  } = useDataContext()

  const [response, setResponse] = useState<string>('')
  const [isFetching, setIsFetching] = useState<boolean>(false)

  const loading = isLoading || isFetching

  useEffect(() => {
    if (!isFetching && response) {
      updateChatResponse()
    }
  }, [loading])

  useEffect(() => {
    if (response) {
      setCurrentAssistantMessage(response)
    }
  }, [response])

  const updateChatResponse = async (): Promise<void> => {
    if (!selectedAction) {
      console.error('No action selected')
      return
    }
    const newHistory = await window.api.db.addActionMessage(selectedAction.id, {
      role: 'assistant',
      content: response
    })
    console.log(history, newHistory)
    setHistory(newHistory)
    setCurrentAssistantMessage('')
    setResponse('')
    setIsLoading(false)
  }

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    if (!selectedAction) {
      console.error('No action selected')
      return
    }

    e.preventDefault()
    setIsLoading(true)
    const newHistory = await window.api.db.addActionMessage(selectedAction.id, {
      role: 'user',
      content: textInput
    })
    setHistory({ ...newHistory })

    const prompt = textInput
    console.log('Prompt:', prompt)
    setTextInput('')
    setIsLoading(false)
    setIsFetching(true)
    window.api.ollama.generate(prompt, selectedAction, async (res) => {
      if (!res) {
        setResponse('Error: An error occurred while generating the response.')
        setIsFetching(false)
        return
      }
      setResponse((old) => `${old}${res.response}`)

      if (res.done) {
        setIsFetching(false)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="w-full py-5 px-4 border-t flex items-center gap-4">
      <input
        autoFocus
        disabled={isLoading}
        value={textInput}
        onChange={(e) => setTextInput(e.target.value)}
        className=" flex-grow"
        placeholder="Type something..."
      />
      <button
        disabled={isLoading}
        type="submit"
        title="Send"
        className={`w-15 h-full flex items-center justify-center content-center ${isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
      >
        {isLoading ? (
          <AnimatedLoader className="text-white" />
        ) : (
          <SendHorizonal className="text-white" />
        )}
      </button>
    </form>
  )
}

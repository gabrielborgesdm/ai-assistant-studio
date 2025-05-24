import { ChatEvent } from '@global/const/ollama.event'
import { MessageRole } from '@global/types/action'
import { useDataContext } from '@renderer/context/DataContext'
import { Captions, CircleStop, Trash } from 'lucide-react'
import { ReactElement, useEffect, useRef } from 'react'
import { ChatMessage } from './ChatMessage'

export const Chat = (): ReactElement => {
  const preRef = useRef<HTMLPreElement>(null)

  // Also put the description of the action in the top of the chat as a icon

  const {
    selectedAction,
    isLoading,
    history,
    setHistory,
    currentAssistantMessage,
    setCurrentAssistantMessage,
    setIsLoading,
    setCanceled
  } = useDataContext()

  const handleCopy = (text: string): void => {
    if (!navigator.clipboard) return
    navigator.clipboard.writeText(text)
  }

  /**
   * Clear the action history
   * Call the API to clear the history for the selected action while also updating the state
   * Also clear the current assistant message to an empty string
   */
  const handleClearHistory = (): void => {
    if (!selectedAction) {
      return
    }

    console.log('Clearing history for action:', selectedAction.id)
    window.api.db.clearHistory(selectedAction.id)
    setHistory(history ? { ...history, messages: [] } : undefined)
    setCurrentAssistantMessage('')
  }

  const handleCancel = (): void => {
    window.api.cancel(ChatEvent)
    setCanceled(true)
    setIsLoading(false)
  }

  // Scroll to the bottom of the chat when the response or loading state changes
  useEffect(() => {
    if (preRef.current) {
      preRef.current.scrollTop = preRef.current.scrollHeight
    }
  }, [history, currentAssistantMessage])

  return (
    <section className="w-full h-full flex-1 overflow-hidden" aria-label="Chat response">
      <header className="flex items-center justify-between p-4 border-b-1">
        <div className="flex gap-2 items-center">
          <span title={selectedAction?.description} aria-label="Description">
            <Captions className="cursor-help" />
          </span>
          <h2 className="text-lg font-semibold">{selectedAction?.title}</h2>
        </div>
        {isLoading ? (
          <button
            title="Cancel Generation"
            aria-label="Cancel Generation"
            className="transparent animate-pulse"
          >
            <CircleStop className="cursor-pointer  text-danger" onClick={handleCancel} />
          </button>
        ) : (
          <button title="Clear History" aria-label="Clear History" className="transparent">
            <Trash
              className="cursor-pointer clickable active:text-danger hover:text-muted"
              onClick={handleClearHistory}
              size={20}
            />
          </button>
        )}
      </header>

      <pre
        ref={preRef}
        className="p-4 pb-15 rounded select-text overflow-y-auto h-full w-full whitespace-pre-wrap break-words"
        tabIndex={0}
      >
        {selectedAction?.description && !history?.messages?.length && (
          <p className="text-muted text-sm">{selectedAction.description}</p>
        )}

        {history?.messages &&
          history.messages.map((message, index) => (
            <ChatMessage
              key={message.role + message.content + index}
              message={message}
              handleCopy={handleCopy}
            />
          ))}

        {/* I chose to separate the current message from the history, since it gets updated really fast, It's better for performance to have it separate */}
        {currentAssistantMessage && (
          <ChatMessage
            message={{ content: currentAssistantMessage, role: MessageRole.ASSISTANT }}
            shouldShowCopy={false}
            handleCopy={handleCopy}
          />
        )}
      </pre>
    </section>
  )
}

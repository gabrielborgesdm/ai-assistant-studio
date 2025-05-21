import { useDataContext } from '@renderer/context/DataContext'
import { ClipboardCopy, Trash2 } from 'lucide-react'
import { ReactElement, useEffect, useRef, useState } from 'react'
import { AnimatedLoader } from './shared/Loader'
import { ActionMessage } from '@global/types/action'

export const Chat = (): ReactElement => {
  const preRef = useRef<HTMLPreElement>(null)
  const [copied, setCopied] = useState(false)

  const {
    selectedAction,
    history,
    setHistory,
    isLoading,
    currentAssistantMessage,
    setCurrentAssistantMessage
  } = useDataContext()

  const handleClearHistory = (): void => {
    if (selectedAction) {
      console.log('Clearing history for action:', selectedAction.id)
      window.api.db.clearHistory(selectedAction.id)
      setHistory(history ? { ...history, messages: [] } : undefined)
      setCurrentAssistantMessage('')
    }
  }

  // Scroll to the bottom of the chat when the response or loading state changes
  useEffect(() => {
    if (preRef.current) {
      preRef.current.scrollTop = preRef.current.scrollHeight
    }
  }, [history, currentAssistantMessage])

  const ChatMessage = ({
    message,
    className = ''
  }: {
    message: ActionMessage
    className?: string
  }): ReactElement => {
    if (!message?.content) return <></>
    return (
      <div className={` flex flex-col px-2 py-2 my-3 rounded  text-white bg-dark ${className}`}>
        <strong className={message.role === 'user' ? '' : ' text-warning'}>
          {message.role === 'user' ? 'User' : selectedAction?.title}:
        </strong>
        <span className="my-3">{message.content}</span>
      </div>
    )
  }

  return (
    <section className="w-full h-full flex-1 overflow-hidden" aria-label="Chat response">
      <header className="flex items-center justify-between p-4 border-b-1">
        <h2 className="text-lg font-semibold">{selectedAction?.title}</h2>
        <Trash2 className="cursor-pointer" onClick={handleClearHistory} />
        {isLoading && <AnimatedLoader />}
      </header>

      <pre
        ref={preRef}
        className="p-4 pb-15 rounded select-text overflow-y-auto h-full w-full whitespace-pre-wrap break-words custom-scrollbar"
        tabIndex={0}
      >
        {selectedAction?.description && !history?.messages?.length && (
          <div className="text-muted text-sm">{selectedAction.description}</div>
        )}

        {history?.messages &&
          history.messages.map((message, index) => (
            <ChatMessage key={message.role + message.content + index} message={message} />
          ))}

        {currentAssistantMessage && (
          <ChatMessage message={{ content: currentAssistantMessage, role: 'assistant' }} />
        )}

        {/* {response && !isLoading && (
          <div className="pb-12">
            <button
              type="button"
              disabled={copied}
              className={`cursor-pointer flex items-center justify-center gap-1 min-w-25 my-4 text-sm select-none`}
              onClick={() => {
                if (response) {
                  navigator.clipboard.writeText(response)
                  setCopied(true)
                  setTimeout(() => setCopied(false), 1500)
                }
              }}
              aria-label="Copy response to clipboard"
            >
              <ClipboardCopy className="w-4 h-4" />
              <span className="pointer-events-none select-none">{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        )} */}
      </pre>
    </section>
  )
}

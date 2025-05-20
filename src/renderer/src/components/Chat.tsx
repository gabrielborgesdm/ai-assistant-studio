import { useDataContext } from '@renderer/context/DataContext'
import { ClipboardCopy } from 'lucide-react'
import { ReactElement, useEffect, useRef, useState } from 'react'
import { AnimatedLoader } from './shared/Loader'

export interface ChatProps {
  response: string
  isLoading: boolean
}

export const Chat = ({ response, isLoading }: ChatProps): ReactElement => {
  const preRef = useRef<HTMLPreElement>(null)
  const [copied, setCopied] = useState(false)

  const { selectedAction } = useDataContext()

  // Scroll to the bottom of the chat when the response or loading state changes
  useEffect(() => {
    if (preRef.current) {
      preRef.current.scrollTop = preRef.current.scrollHeight
    }
  }, [response, isLoading])

  return (
    <section className="w-full h-full flex-1 overflow-hidden" aria-label="Chat response">
      <header className="flex items-center justify-between p-4 border-b-1">
        <h2 className="text-lg font-semibold">{selectedAction?.title}</h2>
        {isLoading && <AnimatedLoader />}
      </header>

      <pre
        ref={preRef}
        className="p-4 rounded select-text overflow-y-auto h-full w-full whitespace-pre-wrap break-words custom-scrollbar"
        tabIndex={0}
      >
        {selectedAction?.description && !response && (
          <div className="text-muted text-sm">{selectedAction.description}</div>
        )}
        {response}
        {response && !isLoading && (
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
        )}
      </pre>
    </section>
  )
}

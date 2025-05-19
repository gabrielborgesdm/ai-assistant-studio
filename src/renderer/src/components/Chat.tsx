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
      <div className="flex items-center justify-between p-2 bg-gray-700 text-gray-200 rounded-t">
        <h2 className="text-lg font-semibold">{selectedAction?.title}</h2>
        {isLoading && <AnimatedLoader className="text-gray-400" />}
      </div>

      <pre
        ref={preRef}
        className="p-2 text-gray-200 bg-gray-800 rounded select-text overflow-y-auto h-full w-full shadow-inner whitespace-pre-wrap break-words custom-scrollbar"
        tabIndex={0}
      >
        {selectedAction?.description && !response && (
          <div className="text-gray-400 text-xs mb-2">{selectedAction.description}</div>
        )}
        {response}
        {response && !isLoading && (
          <div className="pb-11">
            <button
              type="button"
              disabled={copied}
              className={`cursor-pointer flex items-center gap-1 px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition select-none`}
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

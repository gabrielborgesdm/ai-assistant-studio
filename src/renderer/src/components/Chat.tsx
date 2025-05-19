import { ClipboardCopy } from 'lucide-react'
import { ReactElement, useEffect, useRef, useState } from 'react'

export interface ChatProps {
  response: string
  isLoading: boolean
}

export const Chat = ({ response, isLoading }: ChatProps): ReactElement => {
  const preRef = useRef<HTMLPreElement>(null)
  const [copied, setCopied] = useState(false)

  // Scroll to the bottom of the chat when the response or loading state changes
  useEffect(() => {
    if (preRef.current) {
      preRef.current.scrollTop = preRef.current.scrollHeight
    }
  }, [response, isLoading])

  return (
    <section className="w-full h-full flex-1 overflow-hidden" aria-label="Chat response">
      <pre
        ref={preRef}
        className="position-relative p-2 text-gray-200 bg-gray-800 rounded select-text overflow-y-auto h-full w-full shadow-inner whitespace-pre-wrap break-words custom-scrollbar"
        tabIndex={0}
      >
        {response}
        {response && !isLoading && (
          <div className="pt-2 position-absolute bottom-2 right-2">
            <button
              type="button"
              disabled={copied}
              className={`flex items-center gap-1 px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition select-none`}
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

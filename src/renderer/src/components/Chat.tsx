import { ReactElement } from 'react'

export interface ChatProps {
  response: string
  isLoading: boolean
}

export const Chat = ({ response, isLoading }: ChatProps): ReactElement => {
  return (
    <section className="relative w-full h-full flex-1" aria-label="Chat response">
      <pre
        className="p-2 text-gray-200 bg-gray-800 rounded select-text overflow-y-auto h-full w-full shadow-inner border border-gray-700 whitespace-pre-wrap break-words"
        tabIndex={0}
      >
        {response}
        {isLoading ? '...' : ''}
      </pre>
    </section>
  )
}

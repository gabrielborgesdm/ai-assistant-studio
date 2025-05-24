import { ActionMessage, MessageRole } from '@global/types/action'
import { isCustomRole } from '@global/utils/role.utils'
import { CopyIcon } from 'lucide-react'
import { ReactElement } from 'react'

interface ChatMessageProps {
  message: ActionMessage
  className?: string
  handleCopy: (text: string) => void
  shouldShowCopy?: boolean
}

export const ChatMessage = ({
  message,
  className = '',
  handleCopy,
  shouldShowCopy = true
}: ChatMessageProps): ReactElement => {
  if (!message?.content) return <></>

  if (isCustomRole(message.role)) {
    return (
      <div className={`flex flex-col my-3 text-center text-xs text-muted bg-dark rounded italic`}>
        <span
          className={`my-3 ${message.role === MessageRole.CUSTOM_ERROR && 'text-danger'} text-xs }`}
        >
          {message.content}
        </span>
      </div>
    )
  }

  return (
    <div
      className={` flex flex-col  px-2 py-2 my-3 rounded  text-white  
      ${message.role === MessageRole.ASSISTANT ? '' : 'bg-dark'}
      ${className}`}
    >
      <span className="my-3">{message.content}</span>
      <span title="Copy to clipboard" aria-label="Copy to clipboard">
        <CopyIcon
          size={18}
          className={`
              cursor-pointer ml-auto active:text-warning hover:text-muted clickable
              ${!shouldShowCopy && 'invisible'}
            `}
          onClick={() => handleCopy(message.content)}
        />
      </span>
    </div>
  )
}

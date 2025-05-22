import { ActionMessage, MessageRole } from '@global/types/action'
import { useDataContext } from '@renderer/context/DataContext'
import { CopyIcon } from 'lucide-react'
import { ReactElement } from 'react'

interface ChatMessageProps {
  message: ActionMessage
  className?: string
  handleCopy: (text: string) => void
}

export const ChatMessage = ({
  message,
  className = '',
  handleCopy
}: ChatMessageProps): ReactElement => {
  const { selectedAction } = useDataContext()

  if (!message?.content) return <></>
  return (
    <div className={` flex flex-col px-2 py-2 my-3 rounded  text-white bg-dark ${className}`}>
      <strong className={message.role === MessageRole.USER ? '' : ' text-warning'}>
        {message.role === MessageRole.USER ? 'User' : selectedAction?.title}:
      </strong>
      <span className="my-3">{message.content}</span>
      <span title="Copy to clipboard" aria-label="Copy to clipboard">
        <CopyIcon
          size={18}
          className="cursor-pointer ml-auto active:text-warning hover:text-muted clickable"
          onClick={() => handleCopy(message.content)}
        />
      </span>
    </div>
  )
}

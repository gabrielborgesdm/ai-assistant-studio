import {
  ChatBubble,
  ChatBubbleAction,
  ChatBubbleAvatar,
  ChatBubbleMessage
} from '@/components/ui/chat/chat-bubble'
import { AssistantMessage, MessageRole } from '@global/types/assistant'
import { isCustomRole } from '@global/utils/role.utils'
import { ImagesDisplay } from '@renderer/components/features/image/ImagesDisplay'
import { cn } from '@renderer/lib/utils'
import { Copy } from 'lucide-react'
import { ReactElement } from 'react'

interface ChatMessageProps {
  message: AssistantMessage
  className?: string
  handleCopy: (text: string) => void
  shouldShowCopy?: boolean
  isLoading?: boolean
}

export const ChatMessage = ({
  message,
  className = '',
  handleCopy,
  shouldShowCopy = true,
  isLoading = false
}: ChatMessageProps): ReactElement => {
  if (message?.content === undefined) return <></>

  if (isCustomRole(message.role)) {
    return (
      <span
        className={`my-2 overflow-hidden ${message.role === MessageRole.CUSTOM_ERROR && 'text-destructive'} text-sm text-center italic select-text`}
      >
        {message.content}
      </span>
    )
  }

  const getVariant = (role: string): 'received' | 'sent' =>
    role === MessageRole.ASSISTANT ? 'received' : 'sent'

  // Only show the loading if there's no content generated yet
  const showLoadingIcon = (isLoading: boolean, message: AssistantMessage): boolean => {
    return isLoading && message.role === MessageRole.ASSISTANT && message.content === ''
  }

  return (
    <div className="flex flex-col w-full overflow-hidden px-0">
      <ChatBubble
        layout={message.role === MessageRole.ASSISTANT ? 'ai' : 'default'}
        variant={getVariant(message.role)}
        className={`my-2 ${className} select-text`}
        onClick={() => handleCopy(message.content)}
      >
        <ChatBubbleAvatar
          className={cn('select-none', {
            invisible: isLoading
          })}
          fallback={message.role === MessageRole.ASSISTANT ? 'AI' : 'US'}
        />
        <ChatBubbleMessage
          variant={getVariant(message.role)}
          isLoading={showLoadingIcon(isLoading, message)}
        >
          {message.content}
          {message.images && message.images.length > 0 && (
            <ImagesDisplay
              images={message.images}
              shouldShowRemoveButton={false}
              className="mt-2 grid-cols-3 md:grid-cols-3 lg:grid-cols-3"
            />
          )}

          {message.role === MessageRole.ASSISTANT && (
            <div>
              {shouldShowCopy && (
                <ChatBubbleAction
                  className="size-6"
                  icon={<Copy className="size-3" />}
                  onClick={() => handleCopy(message.content)}
                  title="Copy message"
                />
              )}
            </div>
          )}
        </ChatBubbleMessage>
      </ChatBubble>
    </div>
  )
}

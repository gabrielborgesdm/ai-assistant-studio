import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage } from '@/components/ui/chat/chat-bubble'
import { AssistantMessage, MessageRole } from '@global/types/assistant'
import { isCustomRole } from '@global/utils/role.utils'
import { ImagesDisplay } from '@renderer/components/features/image/ImagesDisplay'
import { CopyButton } from '@renderer/components/shared/CopyButton'
import { cn } from '@renderer/lib/utils'
import { ReactElement } from 'react'

interface ChatMessageProps {
  message: AssistantMessage
  className?: string
  handleCopy: (text: string) => void
  shouldShowCopy?: boolean
  isLoading?: boolean
  shouldShowAvatar?: boolean
}

export const ChatMessage = ({
  message,
  className = '',
  handleCopy,
  shouldShowCopy = true,
  isLoading = false,
  shouldShowAvatar = true
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
      >
        {shouldShowAvatar && (
          <ChatBubbleAvatar
            className={cn('select-none', {
              invisible: isLoading
            })}
            fallback="US"
          />
        )}
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
              {shouldShowCopy && <CopyButton onClick={() => handleCopy(message.content)} />}
            </div>
          )}
        </ChatBubbleMessage>
      </ChatBubble>
    </div>
  )
}

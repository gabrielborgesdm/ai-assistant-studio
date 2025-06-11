import { ChatMessage } from '@/components/features/assistant-chat/ChatMessage'
import { ChatMessageList } from '@/components/ui/chat/chat-message-list'
import { Assistant, AssistantHistory, MessageRole } from '@global/types/assistant'
import { useHandleCopy } from '@renderer/hooks/use-handle-copy'
import { ReactElement } from 'react'

interface ChatBodyProps {
  assistant: Assistant
  history: AssistantHistory | undefined
  currentAssistantMessage: string | undefined
  isLoading: boolean
  shouldShowAvatar?: boolean
}

export const ChatBody = ({
  assistant,
  history,
  currentAssistantMessage,
  isLoading,
  shouldShowAvatar = true
}: ChatBodyProps): ReactElement => {
  
  const { handleCopy } = useHandleCopy()

  const renderDescription = (): ReactElement => {
    if (!assistant.description || history?.messages?.length || currentAssistantMessage) return <></>
    return <p className="text-center text-sm italic">{assistant.description}</p>
  }

  return (
    <div className="flex flex-1 relative">
      <ChatMessageList className="absolute ">
        {renderDescription()}
        {history?.messages &&
          history.messages.map((message, index) => (
            <ChatMessage
              key={message.role + message.content + index}
              message={message}
              handleCopy={handleCopy}
              shouldShowAvatar={shouldShowAvatar}
            />
          ))}

        {/* I chose to separate the current message from the history, since it gets updated really fast, It's better for performance to have it separate */}
        {currentAssistantMessage !== undefined && (
          <ChatMessage
            message={{ content: currentAssistantMessage, role: MessageRole.ASSISTANT }}
            shouldShowCopy={false}
            isLoading={isLoading}
            handleCopy={handleCopy}
            shouldShowAvatar={shouldShowAvatar}
          />
        )}
      </ChatMessageList>
    </div>
  )
}

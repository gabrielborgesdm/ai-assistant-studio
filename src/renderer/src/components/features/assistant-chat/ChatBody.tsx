import { ChatMessageList } from '@/components/ui/chat/chat-message-list'
import { ActionHistory, Assistant, MessageRole } from '@global/types/assistant'
import { ReactElement } from 'react'
import { ChatMessage } from './ChatMessage'
import { isCustomRole } from '@global/utils/role.utils'

interface ChatBodyProps {
  assistant: Assistant
  history: ActionHistory | undefined
  currentAssistantMessage: string | undefined
  isLoading: boolean
}

export const ChatBody = ({
  assistant,
  history,
  currentAssistantMessage,
  isLoading
}: ChatBodyProps): ReactElement => {
  const handleCopy = (text: string): void => {
    if (!navigator.clipboard) return
    navigator.clipboard.writeText(text)
  }

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
            />
          ))}

        {/* I chose to separate the current message from the history, since it gets updated really fast, It's better for performance to have it separate */}
        {currentAssistantMessage !== undefined && (
          <ChatMessage
            message={{ content: currentAssistantMessage, role: MessageRole.ASSISTANT }}
            shouldShowCopy={false}
            isLoading={isLoading}
            handleCopy={handleCopy}
          />
        )}
      </ChatMessageList>
    </div>
  )
}

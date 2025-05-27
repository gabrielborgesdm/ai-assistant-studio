import { ChatBody } from '@renderer/components/features/assistant-chat/ChatBody'
import { ChatForm } from '@renderer/components/features/assistant-chat/ChatForm'
import { useHandleChat } from '@renderer/components/features/assistant-chat/useHandleChat'
import { Assistant } from '@global/types/assistant'
import { ChatHeader } from './ChatHeader'

interface ChatComponentProps {
  assistant: Assistant
}

export const ChatComponent = ({ assistant }: ChatComponentProps): React.ReactElement => {
  const {
    history,

    textInput,
    setTextInput,
    isLoading,
    currentAssistantMessage,
    handleClearHistory,
    handleCancelMessageRequest,
    handleSubmit
  } = useHandleChat(assistant)

  return (
    <main className="flex flex-grow-1 flex-col w-full h-full">
      <ChatHeader
        assistant={assistant}
        isLoading={isLoading}
        handleClearHistory={handleClearHistory}
        handleCancelMessageRequest={handleCancelMessageRequest}
      />
      <ChatBody
        assistant={assistant}
        history={history}
        currentAssistantMessage={currentAssistantMessage}
        isLoading={isLoading}
      />
      <ChatForm
        textInput={textInput}
        setTextInput={setTextInput}
        isLoading={isLoading}
        handleSubmit={handleSubmit}
      />
    </main>
  )
}

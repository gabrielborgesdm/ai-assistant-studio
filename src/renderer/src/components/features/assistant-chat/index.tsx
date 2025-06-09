import { Assistant } from '@global/types/assistant'
import { ChatBody } from '@renderer/components/features/assistant-chat/ChatBody'
import { ChatForm } from '@renderer/components/features/assistant-chat/ChatForm'
import { useHandleChat } from '@renderer/components/features/assistant-chat/use-handle-chat'
import { ChatHeader } from '@renderer/components/features/assistant-chat/ChatHeader'
import { ReactElement } from 'react'

interface ChatComponentProps {
  assistant: Assistant
  HeaderButton?: ReactElement
  shouldShowAvatar?: boolean
}

export const ChatComponent = ({
  assistant,
  HeaderButton,
  shouldShowAvatar = true
}: ChatComponentProps): React.ReactElement => {
  const {
    images,
    onRemoveImage,
    onAddImage,
    onClickAttachFile,
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
    <div className="flex flex-grow-1 flex-col w-full h-full">
      <ChatHeader
        assistant={assistant}
        isLoading={isLoading}
        handleClearHistory={handleClearHistory}
        handleCancelMessageRequest={handleCancelMessageRequest}
        HeaderButton={HeaderButton}
      />
      <ChatBody
        assistant={assistant}
        history={history}
        currentAssistantMessage={currentAssistantMessage}
        isLoading={isLoading}
        shouldShowAvatar={shouldShowAvatar}
      />
      <ChatForm
        images={images}
        onRemoveImage={onRemoveImage}
        onAddImage={onAddImage}
        onClickAttachFile={onClickAttachFile}
        assistant={assistant}
        textInput={textInput}
        setTextInput={setTextInput}
        isLoading={isLoading}
        handleSubmit={handleSubmit}
      />
    </div>
  )
}

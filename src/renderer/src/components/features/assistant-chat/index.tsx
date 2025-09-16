import { Assistant } from "@global/types/assistant";
import { ChatBody } from "@renderer/components/features/assistant-chat/ChatBody";
import { ChatForm } from "@renderer/components/features/assistant-chat/ChatForm";
import { useHandleChat } from "@renderer/components/features/assistant-chat/use-handle-chat";
import { ChatHeader } from "@renderer/components/features/assistant-chat/ChatHeader";
import { ReactElement } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface ChatComponentProps {
  assistant: Assistant;
  HeaderButton?: ReactElement;
  shouldShowAvatar?: boolean;
}

export const ChatComponent = ({
  assistant,
  HeaderButton,
  shouldShowAvatar = true,
}: ChatComponentProps): React.ReactElement => {
  const {
    images,
    onRemoveImage,
    onAddImage,
    onClickAttachFile,
    conversation,
    textInput,
    setTextInput,
    isLoading,
    currentAssistantMessage,
    handleClearHistory,
    handleCancelMessageRequest,
    handleSubmit,
    isNavigationDisabled,
  } = useHandleChat(assistant);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <AnimatePresence mode="wait">
        <div key={assistant.id} className="absolute inset-0 w-full h-full">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col w-full h-full"
          >
            <ChatHeader
              assistant={assistant}
              conversation={conversation}
              isLoading={isLoading}
              handleClearHistory={handleClearHistory}
              handleCancelMessageRequest={handleCancelMessageRequest}
              HeaderButton={HeaderButton}
              isNavigationDisabled={isNavigationDisabled}
            />
            <ChatBody
              assistant={assistant}
              conversation={conversation}
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
          </motion.div>
        </div>
      </AnimatePresence>
    </div>
  );
};

import { AssistantDropdown } from "@/components/features/assistant-chat/AssistantDropdown";
import { Assistant, Conversation } from "@global/types/assistant";
import { Button } from "@renderer/components/ui/button";
import { Pause, PlusSquareIcon } from "lucide-react";
import { ReactElement } from "react";

interface ChatHeaderProps {
  assistant: Assistant;
  isLoading: boolean;
  HeaderButton?: ReactElement;
  handleNewChat: () => void;
  handleCancelMessageRequest: () => void;
  isNavigationDisabled?: boolean;
  conversation?: Conversation | null;
}

export const ChatHeader = ({
  assistant,
  isLoading,
  HeaderButton,
  handleNewChat,
  handleCancelMessageRequest,
  conversation,
  isNavigationDisabled,
}: ChatHeaderProps): React.ReactElement => {
  const hasMessages = conversation?.messages && conversation.messages.length > 0;

  return (
    <header className="flex items-center justify-between p-4 border-b">
      <div className="flex gap-2 items-center">
        {!!HeaderButton && HeaderButton}
        <div className="flex flex-col">
          <span title={assistant?.description} aria-label="Description">
            <h2 className="text-lg font-bold cursor-help">{assistant?.title}</h2>
          </span>
          {!hasMessages && (
            <span className="text-sm text-muted-foreground">
              Start a new conversation
            </span>
          )}
          {hasMessages && (
            <span className="text-sm text-muted-foreground">
              {conversation?.description}
            </span>
          )}
        </div>
      </div>
      <div>
        {isLoading ? (
          <Button
            variant="ghost"
            size="icon"
            color="danger"
            className="animate-pulse"
            onClick={handleCancelMessageRequest}
          >
            <Pause />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNewChat}
            title="Start a new conversation"
          >
            <PlusSquareIcon />
          </Button>
        )}
        <AssistantDropdown
          assistant={assistant}
          disabled={isNavigationDisabled}
        />
      </div>
    </header>
  );
};

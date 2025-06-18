import { Assistant, AssistantHistory } from '@global/types/assistant'
import { Button } from '@renderer/components/ui/button'
import { BrushCleaning, MessageSquare, MessageSquareX, Pause, Trash2 } from 'lucide-react'
import { ReactElement } from 'react'
import { AssistantDropdown } from '@/components/features/assistant-chat/AssistantDropdown'
import { cn } from '@renderer/lib/utils'

interface ChatHeaderProps {
  assistant: Assistant
  isLoading: boolean
  HeaderButton?: ReactElement
  handleClearHistory: () => void
  handleCancelMessageRequest: () => void
  history: AssistantHistory | undefined
}

export const ChatHeader = ({
  assistant,
  isLoading,
  HeaderButton,
  handleClearHistory,
  handleCancelMessageRequest,
  history
}: ChatHeaderProps): React.ReactElement => {
  const hasMessages = history?.messages && history.messages.length > 0

  return (
    <header className="flex items-center justify-between p-4 border-b">
      <div className="flex gap-2 items-center">
        {!!HeaderButton && HeaderButton}
        <span title={assistant?.description} aria-label="Description">
          <h2 className="text-lg font-bold cursor-help">{assistant?.title}</h2>
        </span>
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
            className={cn(!hasMessages && 'disabled')}
            disabled={!hasMessages}
            onClick={handleClearHistory}
            title="Clear chat history"
          >
            <BrushCleaning />
          </Button>
        )}
        <AssistantDropdown assistant={assistant} />
      </div>
    </header>
  )
}

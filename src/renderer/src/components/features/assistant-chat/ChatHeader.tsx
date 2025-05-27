import { Assistant } from '@global/types/assistant'
import { Button } from '@renderer/components/ui/button'
import { SidebarTrigger } from '@renderer/components/ui/sidebar'
import { Pause, Trash2 } from 'lucide-react'

interface ChatHeaderProps {
  assistant: Assistant
  isLoading: boolean
  handleClearHistory: () => void
  handleCancelMessageRequest: () => void
}

export const ChatHeader = ({
  assistant,
  isLoading,
  handleClearHistory,
  handleCancelMessageRequest
}: ChatHeaderProps): React.ReactElement => {
  return (
    <header className="flex items-center justify-between p-4 border-b">
      <div className="flex gap-2 items-center">
        <Button variant="ghost" size="icon">
          <SidebarTrigger className="" />
        </Button>
        <span title={assistant?.description} aria-label="Description">
          <h2 className="text-lg font-bold cursor-help">{assistant?.title}</h2>
        </span>
      </div>
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
        <Button variant="ghost" size="icon" onClick={handleClearHistory}>
          <Trash2 />
        </Button>
      )}
    </header>
  )
}

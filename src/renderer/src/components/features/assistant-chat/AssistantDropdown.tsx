import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Assistant } from '@global/types/assistant'
import { Page } from '@renderer/pages'
import { useAssistantContext } from '@renderer/provider/AssistantProvider'
import { usePageContext } from '@renderer/provider/PageProvider'
import { CopyPlus, Edit, MoreVertical, SquareX } from 'lucide-react'
import { ReactElement } from 'react'
import { toast } from 'sonner'

export const AssistantDropdown = ({ assistant }: { assistant: Assistant }): ReactElement => {
  const { setActivePage } = usePageContext()
  const { removeAssistant } = useAssistantContext()

  const handleEdit = (): void => {
    setActivePage(Page.AssistantManagement, {
      assistant: assistant
    })
  }

  const handleDuplicate = (): void => {
    setActivePage(Page.AssistantManagement, {
      assistant: assistant,
      duplicate: true
    })
  }

  const handleDelete = (): void => {
    try {
      removeAssistant(assistant.id)
      setActivePage(Page.Chat)
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild title="Options">
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDuplicate}>
          <CopyPlus className="mr-2 h-4 w-4" />
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDelete}>
          <SquareX className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

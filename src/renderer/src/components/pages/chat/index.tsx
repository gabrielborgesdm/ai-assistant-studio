import { ChatComponent } from '@/components/features/assistant-chat'
import { SidebarButton } from '@/components/shared/SidebarButton'
import { Page } from '@renderer/pages'
import { useAssistantContext } from '@renderer/provider/AssistantProvider'
import { usePageContext } from '@renderer/provider/PageProvider'

export const ChatPage = (): React.ReactElement => {
  const { activeAssistant } = useAssistantContext()
  const { withActivePage } = usePageContext()

  if (!activeAssistant) {
    return <></>
  }

  return withActivePage(Page.Chat, () => (
    <ChatComponent assistant={activeAssistant} HeaderButton={<SidebarButton />} />
  ))
}

import { ChatComponent } from '@/components/features/assistant-chat'
import { useAssistantContext } from '@renderer/provider/AssistantProvider'

export const ChatPage = (): React.ReactElement => {
  const { activeAssistant } = useAssistantContext()

  if (!activeAssistant) {
    return <></>
  }
  return <ChatComponent assistant={activeAssistant} />
}

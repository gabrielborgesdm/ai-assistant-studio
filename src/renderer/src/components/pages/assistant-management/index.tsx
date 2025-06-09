import { AssistantManagement } from '@/components/features/assistant-management'
import { usePageContext } from '@renderer/provider/PageProvider'
import { Page } from '@renderer/pages'
import { Assistant } from '@global/types/assistant'

export const AssistantManagementPage = (): React.ReactElement => {
  const { withActivePage, pageProps } = usePageContext()

  const assistant = pageProps?.assistant

  return withActivePage(Page.AssistantManagement, () => (
    <AssistantManagement assistant={assistant as Assistant | undefined} />
  ))
}

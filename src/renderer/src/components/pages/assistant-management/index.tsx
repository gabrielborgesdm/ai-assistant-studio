import { AssistantManagement } from '@/components/features/assistant-management'
import { AssistantData } from '@global/types/assistant'
import { Page } from '@renderer/pages'
import { usePageContext } from '@renderer/provider/PageProvider'
import { useMemo } from 'react'

export const AssistantManagementPage = (): React.ReactElement => {
  const { withActivePage, pageProps } = usePageContext()

  const assistant = useMemo(() => {
    if (!pageProps?.assistant) return undefined
    const assistant = { ...pageProps.assistant } as AssistantData

    if (pageProps.duplicate) {
      assistant.id = undefined
      assistant.title += ' (Copy)'
    }
    console.log('assistant', assistant)
    return assistant
  }, [pageProps?.assistant, pageProps?.duplicate])

  return withActivePage(Page.AssistantManagement, () => (
    <AssistantManagement assistant={assistant as AssistantData | undefined} />
  ))
}

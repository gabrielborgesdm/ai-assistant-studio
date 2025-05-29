import { SetupComponent } from '@renderer/components/features/setup'
import { usePageContext } from '@renderer/provider/PageProvider'
import { Page } from '@renderer/pages'

export const SetupPage = (): React.ReactElement => {
  const { withActivePage } = usePageContext()

  return withActivePage(Page.Setup, SetupComponent)
}

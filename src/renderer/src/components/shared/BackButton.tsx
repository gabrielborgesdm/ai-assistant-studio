import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ReactElement } from 'react'
import { usePageContext } from '@/provider/PageProvider'
import { Page } from '@/pages'
import { useSidebar } from '@/components/ui/sidebar'

export const BackButton = (): ReactElement => {
  const { setActivePage } = usePageContext()

  const { setOpen } = useSidebar()

  const handleBack = (): void => {
    setActivePage(Page.Chat)
    setOpen(true)
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" className="flex items-center gap-3 text-lg" onClick={handleBack}>
        <ArrowLeft />
        Back
      </Button>
    </div>
  )
}

import { Button } from '@renderer/components/ui/button'
import { useSidebar } from '@renderer/components/ui/sidebar'
import { SidebarIcon } from 'lucide-react'
import { ReactElement } from 'react'

export const SidebarButton = (): ReactElement => {
  const { toggleSidebar } = useSidebar()

  return (
    <Button variant="ghost" size="icon" onClick={toggleSidebar}>
      <SidebarIcon />
    </Button>
  )
}

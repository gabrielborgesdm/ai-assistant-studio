import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@/components/ui/sidebar'
import { cn } from '@renderer/lib/utils'
import { Page } from '@renderer/pages'
import { useAssistantContext } from '@renderer/provider/AssistantProvider'
import { useGlobalContext } from '@renderer/provider/GlobalProvider'
import { usePageContext } from '@renderer/provider/PageProvider'
import { useTheme } from '@renderer/provider/ThemeProvider'
import { Bot, History, Moon, Sun } from 'lucide-react'

// TODO: make it stay fixed when size is big, deactivate clicks when generating messages
export const SidebarComponent = (): React.ReactElement => {
  const { assistants, activeAssistant, setActiveAssistant } = useAssistantContext()

  const { isDark, toggleTheme } = useTheme()
  const { setActivePage, activePage, pageProps } = usePageContext()
  const { isSidebarDisabled } = useGlobalContext()

  const { toggleSidebar } = useSidebar()

  const handleAssistantSelect = (assistantId: string): void => {
    if (isSidebarDisabled) return

    const selectedAssistant = assistants.find((assistant) => assistant.id === assistantId)
    if (selectedAssistant) {
      setActiveAssistant(selectedAssistant)
    }
    if (activePage !== Page.Chat) {
      setActivePage(Page.Chat)
    }

    checkShouldToggleMenu()
  }

  const handlePageChange = (page: string): void => {
    if (isSidebarDisabled) return
    console.log(page)
    setActivePage(page)
    checkShouldToggleMenu()
  }

  const checkShouldToggleMenu = (): void => {
    // only toggle if screen size is lower than 768px
    // When the screen is lower than this, the sidebar is turned into the mobile version,
    // and for better user experience we want to close it
    if (window.innerWidth < 768) {
      toggleSidebar()
    }
  }

  if (activePage === Page.Setup) {
    return <></>
  }

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex gap-1 items-center">
            <Bot />
            <span className="align-middle">Assistants</span>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {assistants.map((assistant) => (
                <SidebarMenuItem
                  key={assistant.id}
                  className={cn('cursor-pointer', {
                    disabled: isSidebarDisabled
                  })}
                >
                  <SidebarMenuButton
                    asChild
                    isActive={assistant.id === activeAssistant?.id && activePage === Page.Chat}
                    tooltip={assistant.title}
                    onClick={() => handleAssistantSelect(assistant.id)}
                  >
                    <span>{assistant.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="flex gap-1 items-center">
            <History />
            Chat History
          </SidebarGroupLabel>
          <SidebarGroupContent></SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem
                className={cn('cursor-pointer', {
                  disabled: isSidebarDisabled
                })}
              >
                <SidebarMenuButton
                  onClick={() => handlePageChange(Page.AssistantManagement)}
                  isActive={activePage === Page.AssistantManagement && !pageProps}
                  className="flex items-center justify-between"
                >
                  <span className="flex items-center gap-2 font-small">
                    <Bot size={18} />
                    Create Assistant
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem className="cursor-pointer" onClick={() => toggleTheme()}>
            <SidebarMenuButton className="flex items-center justify-between">
              <span className="flex items-center gap-2 font-small">
                {isDark ? <Moon size={18} /> : <Sun size={18} />}
                {isDark ? 'Dark' : 'Light'} Mode
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

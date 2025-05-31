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
import { Switch } from '@renderer/components/ui/switch'
import { cn } from '@renderer/lib/utils'
import { Page } from '@renderer/pages'
import { useAssistantContext } from '@renderer/provider/AssistantProvider'
import { useGlobalContext } from '@renderer/provider/GlobalProvider'
import { usePageContext } from '@renderer/provider/PageProvider'
import { useTheme } from '@renderer/provider/ThemeProvider'
import { Bot, History, Settings } from 'lucide-react'
import { useEffect } from 'react'

// TODO: make it stay fixed when size is big, deactivate clicks when generating messages
export const SidebarComponent = (): React.ReactElement => {
  const { assistants, setAssistants, activeAssistant, setActiveAssistant } = useAssistantContext()

  const { isDark, toggleTheme } = useTheme()
  const { setActivePage, activePage } = usePageContext()
  const { isSidebarDisabled } = useGlobalContext()

  const { toggleSidebar } = useSidebar()

  useEffect(() => {
    window.api.db.getAssistants().then(setAssistants)
  }, [])

  useEffect(() => {
    // set the first assistant as selected by default
    if (assistants.length > 0 && !activeAssistant) {
      setActiveAssistant(assistants[0])
    }
  }, [assistants, activeAssistant])

  const handleAssistantSelect = (assistantId: string): void => {
    if (isSidebarDisabled) return

    const selectedAssistant = assistants.find((assistant) => assistant.id === assistantId)
    if (selectedAssistant) {
      setActiveAssistant(selectedAssistant)
    }
    checkShouldToggleMenu()
  }

  const handleSettingsClick = (): void => {
    if (isSidebarDisabled) return
    setActivePage('settings')
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

  const footerItems = [
    {
      title: 'Add Assistant',
      icon: Bot
    },
    {
      title: 'Settings',
      icon: Settings,
      onClick: handleSettingsClick
    }
  ]

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
                    isActive={assistant.id === activeAssistant?.id}
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
        {/* <SidebarGroup>
          <SidebarGroupLabel className="flex gap-1 items-center">
            <History />
            Chat History
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu></SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup> 
        */}
        <SidebarFooter>
          <SidebarMenu>
            {footerItems.map((item) => (
              <SidebarMenuItem
                key={item.title}
                className={cn('cursor-pointer', {
                  disabled: isSidebarDisabled
                })}
              >
                <SidebarMenuButton asChild onClick={item.onClick}>
                  <span>
                    <item.icon />
                    {item.title}
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
            <SidebarMenuItem
              className="cursor-pointer flex gap-2 items-center"
              onClick={() => toggleTheme()}
            >
              <Switch checked={isDark} />
              {isDark ? 'Dark' : 'Light'} Mode
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  )
}

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
import { useAssistantContext } from '@renderer/provider/AssistantProvider'
import { useTheme } from '@renderer/provider/ThemeProvider'
import { Bot, History, Settings } from 'lucide-react'
import { useEffect } from 'react'

export const SidebarComponent = (): React.ReactElement => {
  const { assistants, setAssistants, activeAssistant, setActiveAssistant } = useAssistantContext()

  const { theme, setTheme } = useTheme()

  const { toggleSidebar } = useSidebar()

  useEffect(() => {
    window.api.db.getActions().then(setAssistants)
  }, [])

  useEffect(() => {
    // set the first action as selected by default
    if (assistants.length > 0 && !activeAssistant) {
      setActiveAssistant(assistants[0])
    }
  }, [assistants, activeAssistant])

  const handleAssistantSelect = (assistantId: string): void => {
    const selectedAssistant = assistants.find((assistant) => assistant.id === assistantId)
    if (selectedAssistant) {
      setActiveAssistant(selectedAssistant)
    }
    toggleSidebar()
  }

  const footerItems = [
    {
      title: 'Add Assistant',
      icon: Bot
    },
    {
      title: 'Settings',
      icon: Settings
    }
  ]

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
                <SidebarMenuItem key={assistant.id} className="cursor-pointer">
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
        <SidebarGroup>
          <SidebarGroupLabel className="flex gap-1 items-center">
            <History />
            Chat History
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{/* TODO: Add chat history items */}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarFooter>
          <SidebarMenu>
            {footerItems.map((item) => (
              <SidebarMenuItem key={item.title} className="cursor-pointer">
                <SidebarMenuButton asChild>
                  <span>
                    <item.icon />
                    {item.title}
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
            <SidebarMenuItem
              className="cursor-pointer flex gap-2 items-center"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            >
              <Switch checked={theme === 'dark'} />
              {theme.charAt(0).toUpperCase() + theme.slice(1)} Mode
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  )
}

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
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@renderer/lib/utils";
import { Page } from "@renderer/pages";
import { useAssistantContext } from "@renderer/provider/AssistantProvider";
import { useGlobalContext } from "@renderer/provider/GlobalProvider";
import { usePageContext } from "@renderer/provider/PageProvider";
import { useTheme } from "@renderer/provider/ThemeProvider";
import { useConversationContext } from "@renderer/provider/ConversationProvider";
import { ConversationDropdown } from "@renderer/components/features/conversation/ConversationDropdown";
import { Bot, History, Moon, PlusSquareIcon, Settings, Sun } from "lucide-react";

export const SidebarComponent = (): React.ReactElement => {
  const { assistants, activeAssistant, setActiveAssistant } =
    useAssistantContext();

  const { conversations, selectedConversationId, selectConversation, deleteConversation, renameConversation } = useConversationContext();
  const { isDark, toggleTheme } = useTheme();
  const { setActivePage, activePage, pageProps } = usePageContext();
  const { isNavigationDisabled } = useGlobalContext();

  const { toggleSidebar } = useSidebar();

  const handleAssistantSelect = (assistantId: string): void => {
    if (isNavigationDisabled) return;

    const selectedAssistant = assistants.find(
      (assistant) => assistant.id === assistantId,
    );
    if (selectedAssistant) {
      setActiveAssistant(selectedAssistant);
      // Clear conversation selection to start a new conversation
      selectConversation(null);
    }
    if (activePage !== Page.Chat) {
      setActivePage(Page.Chat);
    }

    checkShouldToggleMenu();
  };

  const handlePageChange = (page: string): void => {
    if (isNavigationDisabled) return;
    console.log(page);
    setActivePage(page);
    checkShouldToggleMenu();
  };

  const checkShouldToggleMenu = (): void => {
    // only toggle if screen size is lower than 768px
    // When the screen is lower than this, the sidebar is turned into the mobile version,
    // and for better user experience we want to close it
    if (window.innerWidth < 768) {
      toggleSidebar();
    }
  };

  const footerClassName = cn("flex items-center justify-between", {
    disabled: isNavigationDisabled,
  });

  if (activePage === Page.Setup) {
    return <></>;
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
                  className={cn("cursor-pointer", {
                    disabled: isNavigationDisabled,
                  })}
                >
                  <SidebarMenuButton
                    asChild
                    isActive={
                      assistant.id === activeAssistant?.id &&
                      activePage === Page.Chat
                    }
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
        {activeAssistant && (
          <SidebarGroup>
            <SidebarGroupLabel className="flex gap-1 items-center">
              <History />
              <span className="align-middle">Conversations</span>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {/* New Chat option */}
                <SidebarMenuItem
                  className={cn("cursor-pointer", {
                    disabled: isNavigationDisabled,
                  })}
                >
                  <SidebarMenuButton
                    tooltip="Start a new conversation"
                    isActive={selectedConversationId === null}
                    onClick={() => {
                      if (isNavigationDisabled) return;
                      selectConversation(null);
                      if (activePage !== Page.Chat) {
                        setActivePage(Page.Chat);
                      }
                      checkShouldToggleMenu();
                    }}
                  >
                    <span className=" p-0 flex gap-1 items-center justify-between font-semibold text-xs">
                      <PlusSquareIcon className="h-4 w-4" />New Conversation
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                {/* Existing conversations */}
                {conversations.map((conversation) => (
                  <SidebarMenuItem
                    key={conversation.id}
                    className={cn("cursor-pointer group relative", {
                      disabled: isNavigationDisabled,
                    })}
                  >
                    <SidebarMenuButton
                      tooltip={conversation.description || "New Conversation"}
                      isActive={selectedConversationId === conversation.id}
                      onClick={() => {
                        if (isNavigationDisabled) return;
                        selectConversation(conversation.id);
                        if (activePage !== Page.Chat) {
                          setActivePage(Page.Chat);
                        }
                        checkShouldToggleMenu();
                      }}
                      className="w-full pr-8"
                    >
                      <span className="truncate">
                        {conversation.description || "New Conversation"}
                      </span>
                    </SidebarMenuButton>
                    <div className="absolute right-1 top-1/2 -translate-y-1/2">
                      <ConversationDropdown
                        conversation={conversation}
                        disabled={isNavigationDisabled}
                        onDelete={deleteConversation}
                        onRename={renameConversation}
                      />
                    </div>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem
                className={cn("cursor-pointer", {
                  disabled: isNavigationDisabled,
                })}
              >
                <SidebarMenuButton
                  onClick={() => handlePageChange(Page.AssistantManagement)}
                  isActive={
                    activePage === Page.AssistantManagement && !pageProps
                  }
                  className={footerClassName}
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
          <SidebarMenuItem
            className="cursor-pointer"
            onClick={() => toggleTheme()}
          >
            <SidebarMenuButton className={footerClassName}>
              <span className="flex items-center gap-2 font-small">
                {isDark ? <Moon size={18} /> : <Sun size={18} />}
                {isDark ? "Dark" : "Light"} Mode
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem
            className="cursor-pointer"
            onClick={() => handlePageChange(Page.Config)}
          >
            <SidebarMenuButton className={footerClassName}>
              <span className="flex items-center gap-2 font-small">
                <Settings size={18} />
                Settings
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

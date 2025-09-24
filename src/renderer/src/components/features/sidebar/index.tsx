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
import { ConversationDropdown } from "@renderer/components/features/conversation/ConversationDropdown";
import { Button } from "@renderer/components/ui/button";
import { cn } from "@renderer/lib/utils";
import { Page } from "@renderer/pages";
import { useAssistantContext } from "@renderer/provider/AssistantProvider";
import { useConversationContext } from "@renderer/provider/ConversationProvider";
import { useGlobalContext } from "@renderer/provider/GlobalProvider";
import { usePageContext } from "@renderer/provider/PageProvider";
import { useTheme } from "@renderer/provider/ThemeProvider";
import { Bot, MessageSquare, Moon, PlusSquareIcon, Settings, Sun } from "lucide-react";

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
            <SidebarGroupLabel className="flex gap-2 items-center justify-between px-2 py-1.5">
              <div className="flex gap-2 items-center text-xs font-medium text-muted-foreground">
                <MessageSquare className="h-3.5 w-3.5" />
                <span>History</span>
              </div>
              {!!selectedConversationId && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    if (isNavigationDisabled) return;
                    selectConversation(null);
                    if (activePage !== Page.Chat) {
                      setActivePage(Page.Chat);
                    }
                    checkShouldToggleMenu();
                  }}
                  className={cn(
                    "h-4 w-4 rounded  transition-opacity flex items-center justify-center",

                  )}
                  disabled={isNavigationDisabled}
                  title="New conversation"
                >
                  <PlusSquareIcon className="h-3 w-3" />
                </Button>
              )}
            </SidebarGroupLabel>
            <SidebarGroupContent className="px-1">
              <SidebarMenu>
                {conversations.map((conversation) => (
                  <SidebarMenuItem key={conversation.id}>
                    <div className={cn(
                      "group relative flex items-center rounded hover:bg-accent/50 transition-colors",
                      {
                        "bg-accent": selectedConversationId === conversation.id,
                      }
                    )}>
                      <button
                        onClick={() => {
                          if (isNavigationDisabled) return;
                          selectConversation(conversation.id);
                          if (activePage !== Page.Chat) {
                            setActivePage(Page.Chat);
                          }
                          checkShouldToggleMenu();
                        }}
                        className={cn(
                          "flex-1 text-left px-2 py-1.5 text-xs truncate transition-colors",
                          {
                            "text-accent-foreground": selectedConversationId === conversation.id,
                            "text-muted-foreground hover:text-foreground": selectedConversationId !== conversation.id,
                            "opacity-50": isNavigationDisabled,
                          }
                        )}
                        title={conversation.description || "New Conversation"}
                        disabled={isNavigationDisabled}
                      >
                        {conversation.description || "New Conversation"}
                      </button>
                      <div className="opacity-0 group-hover:opacity-70 hover:opacity-100 transition-opacity pr-1">
                        <ConversationDropdown
                          conversation={conversation}
                          disabled={isNavigationDisabled}
                          onDelete={deleteConversation}
                          onRename={renameConversation}
                        />
                      </div>
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

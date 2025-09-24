/* eslint-disable react-refresh/only-export-components */
import { Conversation } from "@global/types/assistant";
import {
  createContext,
  ReactElement,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAssistantContext } from "./AssistantProvider";

interface ConversationContextType {
  conversations: Conversation[];
  selectedConversationId: string | null;
  loadConversations: (assistantId: string) => Promise<void>;
  refreshConversations: () => Promise<void>;
  setConversations: (conversations: Conversation[]) => void;
  selectConversation: (conversationId: string | null) => void;
  deleteConversation: (conversationId: string) => Promise<void>;
  renameConversation: (conversationId: string, newTitle: string) => Promise<void>;
}

const ConversationContext = createContext<ConversationContextType | undefined>(
  undefined,
);

export const ConversationProvider = ({
  children,
}: {
  children: ReactNode;
}): ReactElement => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const { activeAssistant } = useAssistantContext();

  const loadConversations = async (assistantId: string): Promise<void> => {
    try {
      console.log("Loading conversations for assistant:", assistantId);
      const conversations = await window.api.conversation.getAllConversations(assistantId);
      console.log("Loaded conversations:", conversations);
      setConversations(conversations || []);
    } catch (error) {
      console.error("Failed to load conversations:", error);
      setConversations([]);
    }
  };

  const refreshConversations = async (): Promise<void> => {
    console.log("Refreshing conversations...");
    if (activeAssistant) {
      await loadConversations(activeAssistant.id);
    }
  };

  const selectConversation = (conversationId: string | null): void => {
    setSelectedConversationId(conversationId);
  };

  const deleteConversation = async (conversationId: string): Promise<void> => {
    try {
      await window.api.conversation.deleteConversation(conversationId);

      // If the deleted conversation was selected, clear the selection
      if (selectedConversationId === conversationId) {
        setSelectedConversationId(null);
      }

      // Refresh the conversations list
      await refreshConversations();
    } catch (error) {
      console.error("Failed to delete conversation:", error);
      throw error;
    }
  };

  const renameConversation = async (conversationId: string, newTitle: string): Promise<void> => {
    try {
      await window.api.conversation.updateConversationTitle(conversationId, newTitle);

      // Refresh the conversations list to show the updated title
      await refreshConversations();
    } catch (error) {
      console.error("Failed to rename conversation:", error);
      throw error;
    }
  };

  // Load conversations when active assistant changes
  useEffect(() => {
    if (activeAssistant) {
      loadConversations(activeAssistant.id);
      setSelectedConversationId(null); // Clear selection when switching assistants
    } else {
      setConversations([]);
      setSelectedConversationId(null);
    }
  }, [activeAssistant]);

  const contextValue = useMemo(() => {
    return {
      conversations,
      selectedConversationId,
      loadConversations,
      refreshConversations,
      setConversations,
      selectConversation,
      deleteConversation,
      renameConversation,
    };
  }, [conversations, selectedConversationId, activeAssistant]);

  return (
    <ConversationContext.Provider value={contextValue}>
      {children}
    </ConversationContext.Provider>
  );
};

export const useConversationContext = (): ConversationContextType => {
  const context = useContext(ConversationContext);
  if (!context) {
    throw new Error(
      "useConversationContext must be used within a ConversationProvider",
    );
  }
  return context;
};
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
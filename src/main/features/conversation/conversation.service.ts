import { Conversation, Message } from "@global/types/assistant";
import { ConversationRepository } from "@main/features/conversation/model/conversation.repository";

export default class ConversationService {
  conversationRepository: ConversationRepository;

  constructor() {
    this.conversationRepository = new ConversationRepository();
  }

  getConversation = async (assistantId: string, conversationId?: string): Promise<Conversation | null> => {
    if (conversationId) {
      return this.conversationRepository.getConversation(conversationId);
    }

    const conversations = await this.conversationRepository.getAllAssistantConversations(assistantId);
    console.log("Conversations:", conversations);
    return conversations.length > 0 ? conversations[0] : null;
  };

  saveConversation = async (assistantId: string, conversationId: string | undefined, messages?: Message[]): Promise<Conversation | null> => {
    return this.conversationRepository.createOrUpdateConversation(assistantId, conversationId, messages);
  };

  clearConversationMessages = async (conversationId: string): Promise<void> => {
    console.log("Clearing history for conversationId:", conversationId);

    await this.conversationRepository.deleteConversation(conversationId);
  };
}

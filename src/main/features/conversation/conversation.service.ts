import { Conversation, Message } from "@global/types/assistant";
import { ConversationRepository } from "@main/features/conversation/model/conversation.repository";
import LlmService from "@main/features/llm/llm.service";

export default class ConversationService {
  conversationRepository: ConversationRepository;
  llmService: LlmService;

  constructor() {
    this.conversationRepository = new ConversationRepository();
    this.llmService = new LlmService();
  }

  getConversation = async (_assistantId: string, conversationId?: string): Promise<Conversation | null> => {
    if (conversationId) {
      return this.conversationRepository.getConversation(conversationId);
    }

    // If no specific conversation ID provided, return null to allow new conversation creation
    // The frontend will handle loading specific conversations via selectedConversationId
    return null;
  };

  saveConversation = async (assistantId: string, conversationId: string | undefined, messages?: Message[], forceNew: boolean = false): Promise<Conversation | null> => {
    return this.conversationRepository.createOrUpdateConversation(assistantId, conversationId, messages, forceNew);
  };

  deleteConversation = async (conversationId: string): Promise<void> => {
    console.log("Deleting conversation:", conversationId);

    await this.conversationRepository.deleteConversation(conversationId);
  };


  updateConversationTitle = async (conversationId: string, title: string): Promise<Conversation | null> => {
    return this.conversationRepository.updateConversation(conversationId, { description: title });
  };

  getAllConversations = async (assistantId: string): Promise<Conversation[]> => {
    return this.conversationRepository.getAllAssistantConversations(assistantId);
  };
}

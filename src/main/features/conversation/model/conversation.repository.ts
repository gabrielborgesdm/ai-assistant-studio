import { Assistant } from "@main/features/assistants/model/assistant.model";
import { Conversation } from "@main/features/conversation/model/conversation.model";
import { AppDataSource } from "@main/features/database/db.config";
import { Message } from "@main/features/messages/model/messages.model";
import { Message as MessageData } from "@global/types/assistant";
import LlmService from "@main/features/llm/llm.service";

export class ConversationRepository {
  private repo = AppDataSource.getRepository(Conversation);
  private llmService: LlmService;

  constructor() {
    this.llmService = new LlmService();
  }


  async getConversation(id: string): Promise<Conversation | null> {
    return this.repo.findOne({
      where: { id },
      relations: ["messages", "assistant"], // eager-load related data
    });
  }

  async getAllAssistantConversations(
    assistantId: string,
  ): Promise<Conversation[]> {
    return this.repo.find({
      where: { assistant: { id: assistantId } },
      order: { createdAt: "DESC" },
      relations: { messages: true },
    });
  }

  async updateConversation(
    id: string,
    data: Partial<Conversation>,
  ): Promise<Conversation | null> {
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) return null;

    this.repo.merge(existing, data);
    return this.repo.save(existing);
  }

  async deleteConversation(id: string): Promise<boolean> {
    const result = await this.repo.delete(id);
    return result.affected !== 0;
  }

  async createOrUpdateConversation(assistantId: string, conversationId: string | undefined, messages?: MessageData[], forceNew: boolean = false): Promise<Conversation | null> {
    return await this.repo.manager.transaction(async manager => {
      const assistantRepo = manager.getRepository(Assistant);
      const conversationRepo = manager.getRepository(Conversation);
      const messageRepo = manager.getRepository(Message);

      // Find the assistant
      const assistant = await assistantRepo.findOne({ where: { id: assistantId } });
      if (!assistant) {
        throw new Error(`Assistant with id ${assistantId} not found`);
      }

      // Find or create conversation for this assistant
      let conversation: Conversation | null = null;
      let isNewConversation = false;

      if (forceNew) {
        // When forcing new conversation, don't look for existing ones
        conversation = null;
      } else if (conversationId) {
        conversation = await conversationRepo.findOne({
          where: { id: conversationId },
          relations: ["messages", "assistant"],
        });
      } else {
        // Only look for existing conversation if not forcing new
        conversation = await conversationRepo.findOne({
          where: { assistant: { id: assistantId } },
          order: { createdAt: "DESC" },
        });
      }

      if (!conversation) {
        // Create a new conversation if none exists
        conversation = conversationRepo.create({
          assistant,
          description: "",
        });
        conversation = await conversationRepo.save(conversation);
        isNewConversation = true;
      }

      // Update conversation messages
      if (messages && messages.length > 0) {
        // Create message entities from the input messages
        const messageEntities = messages?.map(msg =>
          messageRepo.create({
            role: msg.role as any, // Convert from global type to model enum
            content: msg.content,
            images: msg.images,
            conversation: { id: conversation.id },
          })
        );
        await messageRepo.save(messageEntities);

        // Check if this is the first user message in a new conversation
        const isFirstUserMessage = isNewConversation &&
          messages.length === 1 &&
          messages[0].role === 'user' &&
          messages[0].content?.trim();

        if (isFirstUserMessage) {
          // Generate title asynchronously (don't await to avoid blocking)
          setImmediate(async () => {
            try {
              const title = await this.llmService.generateConversationTitle(
                messages[0].content,
                assistant
              );
              await this.updateConversation(conversation!.id, { description: title });
              console.log(`Generated title for conversation ${conversation!.id}: ${title}`);
            } catch (error) {
              console.error('Failed to generate conversation title:', error);
            }
          });
        }
      }

      // Return the updated conversation with messages
      // Use the transaction manager for the final query to see uncommitted changes
      const updatedConversation = await manager.getRepository(Conversation).findOne({
        where: { id: conversation.id },
        relations: { messages: true, assistant: true },
      });
      return updatedConversation;
    });
  }
}

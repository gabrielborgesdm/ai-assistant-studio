import { DataSource } from "typeorm";
import { Assistant } from "@main/features/assistants/model/assistant.model";
import { Conversation } from "@main/features/conversation/model/conversation.model";
import { Message, MessageRole } from "@main/features/messages/model/messages.model";
import { Message as MessageData } from "@global/types/assistant";

/**
 * Test fixtures helper for creating test data
 * Provides factories for consistent test data creation
 */
export class TestFixturesHelper {
  private dataSource: DataSource;

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
  }

  /**
   * Create a test assistant with default or custom properties
   */
  async createAssistant(overrides: Partial<Assistant> = {}): Promise<Assistant> {
    const assistantRepo = this.dataSource.getRepository(Assistant);

    const defaultAssistant = {
      title: "Test Assistant",
      description: "A test assistant for integration testing",
      model: "test-model",
      downloaded: true,
      ephemeral: false,
      allowImage: false,
      ...overrides,
    };

    const assistant = assistantRepo.create(defaultAssistant);
    return await assistantRepo.save(assistant);
  }

  /**
   * Create a test conversation with default or custom properties
   */
  async createConversation(
    assistant: Assistant,
    overrides: Partial<Conversation> = {}
  ): Promise<Conversation> {
    const conversationRepo = this.dataSource.getRepository(Conversation);

    const defaultConversation = {
      assistant,
      description: "Test conversation",
      messages: [],
      ...overrides,
    };

    const conversation = conversationRepo.create(defaultConversation);
    return await conversationRepo.save(conversation);
  }

  /**
   * Create a test message with default or custom properties
   */
  async createMessage(
    conversation: Conversation,
    overrides: Partial<Message> = {}
  ): Promise<Message> {
    const messageRepo = this.dataSource.getRepository(Message);

    const defaultMessage = {
      role: MessageRole.USER,
      content: "Test message content",
      images: [],
      conversation,
      ...overrides,
    };

    const message = messageRepo.create(defaultMessage);
    return await messageRepo.save(message);
  }

  /**
   * Create multiple test messages for a conversation
   */
  async createMessages(
    conversation: Conversation,
    messagesData: Partial<Message>[]
  ): Promise<Message[]> {
    const messages: Message[] = [];
    for (const messageData of messagesData) {
      const message = await this.createMessage(conversation, messageData);
      messages.push(message);
    }
    return messages;
  }

  /**
   * Create a complete test scenario: assistant + conversation + messages
   */
  async createCompleteScenario(options: {
    assistantData?: Partial<Assistant>;
    conversationData?: Partial<Conversation>;
    messagesData?: MessageData[];
  } = {}): Promise<{
    assistant: Assistant;
    conversation: Conversation;
    messages: Message[];
  }> {
    const assistant = await this.createAssistant(options.assistantData);
    const conversation = await this.createConversation(
      assistant,
      options.conversationData
    );

    const messages: Message[] = [];
    if (options.messagesData) {
      for (const msgData of options.messagesData) {
        const message = await this.createMessage(conversation, {
          role: msgData.role as MessageRole,
          content: msgData.content,
          images: msgData.images,
        });
        messages.push(message);
      }
    }

    return { assistant, conversation, messages };
  }
}

/**
 * Common test message data templates
 */
export const messageTemplates = {
  userMessage: (content = "Hello!"): MessageData => ({
    role: "user",
    content,
    images: [],
  }),

  assistantMessage: (content = "Hi there!"): MessageData => ({
    role: "assistant",
    content,
    images: [],
  }),

  userMessageWithImages: (
    content = "Look at this image",
    images = ["base64-image-data"]
  ): MessageData => ({
    role: "user",
    content,
    images,
  }),

  conversation: (): MessageData[] => [
    messageTemplates.userMessage("Hello, how are you?"),
    messageTemplates.assistantMessage("I'm doing well, thank you! How can I help you today?"),
    messageTemplates.userMessage("Can you help me with a coding problem?"),
  ],
};
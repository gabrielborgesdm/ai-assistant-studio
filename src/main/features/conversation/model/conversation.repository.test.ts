import { describe, expect, it, beforeAll } from "vitest";
import { setupIntegrationTest } from "@test/setup/integration.setup";
import { messageTemplates } from "@test/helpers/fixtures.helper";
import { Message as MessageData } from "@global/types/assistant";

describe("ConversationRepository - createOrUpdateConversation", () => {
  const setup = setupIntegrationTest();
  let ConversationRepository: any;

  beforeAll(async () => {
    // Dynamically import the repository after the mock is set up
    const module = await import("./conversation.repository");
    ConversationRepository = module.ConversationRepository;
  });

  it("should create new conversation when conversationId is undefined", async () => {
    const fixtures = setup.getFixtures();
    const assistant = await fixtures.createAssistant();
    const conversationRepo = new ConversationRepository();

    const messages: MessageData[] = [
      messageTemplates.userMessage("Hello"),
      messageTemplates.assistantMessage("Hi there!")
    ];

    const result = await conversationRepo.createOrUpdateConversation(
      assistant.id,
      undefined,
      messages
    );

    expect(result).not.toBeNull();
    expect(result!.assistant.id).toBe(assistant.id);
    expect(result!.messages).toHaveLength(2);
    expect(result!.messages[0].content).toBe("Hello");
    expect(result!.messages[1].content).toBe("Hi there!");
  });

  it("should update existing conversation when conversationId is provided", async () => {
    const fixtures = setup.getFixtures();
    const assistant = await fixtures.createAssistant();
    const conversationRepo = new ConversationRepository();

    // Create initial conversation
    const initialMessages = [messageTemplates.userMessage("Initial message")];
    const conversation = await conversationRepo.createOrUpdateConversation(
      assistant.id,
      undefined,
      initialMessages
    );

    const conversationId = conversation!.id;
    const originalUpdatedAt = conversation!.updatedAt;

    // Wait to ensure timestamp changes
    await new Promise(resolve => setTimeout(resolve, 10));

    // Add new messages to existing conversation
    const newMessages = [messageTemplates.assistantMessage("Response message")];
    const updatedConversation = await conversationRepo.createOrUpdateConversation(
      assistant.id,
      conversationId,
      newMessages
    );

    expect(updatedConversation).not.toBeNull();
    expect(updatedConversation!.id).toBe(conversationId);
    expect(updatedConversation!.messages).toHaveLength(2);
    expect(updatedConversation!.updatedAt).not.toEqual(originalUpdatedAt);

    // Check message order and content
    const messages = updatedConversation!.messages.sort((a, b) =>
      a.createdAt.getTime() - b.createdAt.getTime()
    );
    expect(messages[0].content).toBe("Initial message");
    expect(messages[1].content).toBe("Response message");
  });

  it("should create new conversation when invalid conversationId is provided", async () => {
    const fixtures = setup.getFixtures();
    const assistant = await fixtures.createAssistant();
    const conversationRepo = new ConversationRepository();

    const messages = [messageTemplates.userMessage("Test message")];

    const result = await conversationRepo.createOrUpdateConversation(
      assistant.id,
      "non-existent-id",
      messages
    );

    expect(result).not.toBeNull();
    expect(result!.id).not.toBe("non-existent-id");
    expect(result!.messages).toHaveLength(1);
    expect(result!.messages[0].content).toBe("Test message");
  });

  it("should handle messages with images", async () => {
    const fixtures = setup.getFixtures();
    const assistant = await fixtures.createAssistant({ allowImage: true });
    const conversationRepo = new ConversationRepository();

    const messages = [
      messageTemplates.userMessageWithImages("Look at this image", ["base64-1", "base64-2"])
    ];

    const result = await conversationRepo.createOrUpdateConversation(
      assistant.id,
      undefined,
      messages
    );

    expect(result).not.toBeNull();
    expect(result!.messages).toHaveLength(1);
    expect(result!.messages[0].images).toEqual(["base64-1", "base64-2"]);
  });

  it("should handle empty messages array", async () => {
    const fixtures = setup.getFixtures();
    const assistant = await fixtures.createAssistant();
    const conversationRepo = new ConversationRepository();

    const result = await conversationRepo.createOrUpdateConversation(
      assistant.id,
      undefined,
      []
    );

    expect(result).not.toBeNull();
    expect(result!.messages).toHaveLength(0);
    expect(result!.assistant.id).toBe(assistant.id);
  });

  it("should handle undefined messages", async () => {
    const fixtures = setup.getFixtures();
    const assistant = await fixtures.createAssistant();
    const conversationRepo = new ConversationRepository();

    const result = await conversationRepo.createOrUpdateConversation(
      assistant.id,
      undefined,
      undefined
    );

    expect(result).not.toBeNull();
    expect(result!.messages).toHaveLength(0);
    expect(result!.assistant.id).toBe(assistant.id);
  });

  it("should throw error when assistant does not exist", async () => {
    const conversationRepo = new ConversationRepository();
    const messages = [messageTemplates.userMessage("Hello")];

    await expect(
      conversationRepo.createOrUpdateConversation(
        "non-existent-assistant-id",
        undefined,
        messages
      )
    ).rejects.toThrow("Assistant with id non-existent-assistant-id not found");
  });

  it("should preserve conversation description when updating", async () => {
    const fixtures = setup.getFixtures();
    const assistant = await fixtures.createAssistant();
    const conversation = await fixtures.createConversation(assistant, {
      description: "Custom conversation description"
    });

    const conversationRepo = new ConversationRepository();
    const messages = [messageTemplates.userMessage("New message")];

    const result = await conversationRepo.createOrUpdateConversation(
      assistant.id,
      conversation.id,
      messages
    );

    expect(result).not.toBeNull();
    expect(result!.description).toBe("Custom conversation description");
    expect(result!.messages).toHaveLength(1);
  });

  it("should handle a full conversation scenario", async () => {
    const fixtures = setup.getFixtures();
    const assistant = await fixtures.createAssistant({
      title: "Chat Assistant",
      allowImage: true
    });

    const conversationRepo = new ConversationRepository();
    const conversationMessages = messageTemplates.conversation();

    const result = await conversationRepo.createOrUpdateConversation(
      assistant.id,
      undefined,
      conversationMessages
    );

    expect(result).not.toBeNull();
    expect(result!.messages).toHaveLength(3);
    expect(result!.assistant.title).toBe("Chat Assistant");

    // Verify message order
    const sortedMessages = result!.messages.sort((a, b) =>
      a.createdAt.getTime() - b.createdAt.getTime()
    );
    expect(sortedMessages[0].content).toBe("Hello, how are you?");
    expect(sortedMessages[1].content).toBe("I'm doing well, thank you! How can I help you today?");
    expect(sortedMessages[2].content).toBe("Can you help me with a coding problem?");
  });
});
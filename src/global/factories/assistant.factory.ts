import {
  AssistantData,
  AssistantFormData,
  Conversation,
  Message,
  MessageRole,
} from "@global/types/assistant";

export const AssistantDataFactory = (
  assistantData: AssistantFormData,
  assistantId: string | undefined,
): AssistantData => {
  return {
    id: assistantId || undefined,
    ...assistantData,
  };
};

export const HistoryFactory = (
  id: string,
  messages: Message[] = [],
): Conversation => ({
  id,
  messages,
  createdAt: new Date(),
  updatedAt: new Date(),
  description: "",
});

export const AssistantMessageFactory = (
  role: MessageRole,
  content: string,
  images?: string[] | undefined,
): Message => {
  const message: Message = {
    role,
    content,
  };

  if (images?.length) {
    message.images = images;
  }

  return message;
};

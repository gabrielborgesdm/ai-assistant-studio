import { GenerateRequest } from "ollama";
import { z } from "zod";

export interface Assistant {
  id: string;
  title: string;
  description: string;
  model: string;
  options?: GenerateRequest;
  downloaded?: boolean;
  ephemeral?: boolean;
  prompt?: string;
  systemBehaviour?: string;
  allowImage?: boolean;
  contextPath?: string;
}

export type AssistantData = Omit<Assistant, "id"> & { id?: string | undefined };

export const MessageRole = {
  SYSTEM: "system",
  USER: "user",
  ASSISTANT: "assistant",

  // Custom_ roles are filtered out in the ollama input, but used for other purposes
  // like displaying a message in the UI
  CUSTOM_UI: "custom_ui",
  CUSTOM_ERROR: "custom_error",
}

// Define the type based on the MessageRole object values
export type MessageRole = typeof MessageRole[keyof typeof MessageRole];

export interface Message {
  role: MessageRole;
  content: string;
  images?: string[];
}

export interface Conversation {
  id: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  description: string;
}

export interface ConversationData {
  assistantId: string;
  messages: Message[];
}

// Define the custom field schema
// Define the main form schema
export const assistantFormSchema = z.object({
  title: z.string().min(1, "Assistant name is required"),
  description: z.string(),
  model: z.string().min(1, "Model selection is required"),
  ephemeral: z.boolean(),
  systemBehaviour: z.string().optional(),
  prompt: z.string().optional(),
  allowImage: z.boolean(),
  contextPath: z.string().optional(),
});

// Define the type based on the schema
export type AssistantFormData = z.infer<typeof assistantFormSchema>;

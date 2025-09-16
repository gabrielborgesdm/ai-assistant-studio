import { CONFIG } from "@global/config";
import { ChatEventReply, AutoGenerateEventReply } from "@global/const/llm.event";
import {
  Assistant,
  Conversation,
  MessageRole
} from "@global/types/assistant";
import { isCustomRole } from "@global/utils/role.utils";
import { AIMessage, BaseMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";

import { ChatOllama } from "@langchain/ollama";
import AssistantService from "@main/features/assistants/assistants.service";
import { RagService } from "@main/features/rag/rag.service";
import console from "console";
import { IpcMainEvent } from "electron";
import instructionAssistant from "@global/resources/instruction-assistant.json";
import systemBehaviourAssistant from "@global/resources/system-behaviour-assistant.json";

export default class LlmService {
  ragService: RagService;
  assistantService: AssistantService;

  constructor() {
    this.ragService = new RagService();
    this.assistantService = new AssistantService();
  }

  private getTemplateAssistant(assistantId: string): Assistant | null {
    const templates = [instructionAssistant, systemBehaviourAssistant];
    const template = templates.find(t => t.id === assistantId);

    if (!template) {
      return null;
    }

    return {
      id: template.id,
      title: template.title,
      description: template.description,
      model: template.model,
      prompt: template.prompt,
      systemBehaviour: template.systemBehaviour,
      ephemeral: true,
      allowImage: false,
      downloaded: true // Assume template assistants are always available
    };
  }

  async streamLlmChat(
    assistantId: string,
    conversation: Conversation,
    message: string,
    images: string[] | undefined,
    event: IpcMainEvent,
    abort: AbortController,
  ): Promise<void> {
    try {
      let assistant = await this.assistantService.getAssistantById(assistantId);

      // If assistant not found in database, check if it's a template assistant
      if (!assistant) {
        assistant = this.getTemplateAssistant(assistantId);
        if (!assistant) {
          throw new Error("Assistant not found");
        }
      }

      // The last message needs to be from the user, otherwise we can't continue the generation
      if (!conversation || !conversation.messages || conversation.messages.length === 0) {
        throw new Error("Conversation not found or has no messages");
      }

      const isLastMessageUser = conversation.messages[conversation.messages.length - 1].role === MessageRole.USER;

      if (!isLastMessageUser) {
        throw new Error("Last message is not from the user");
      }



      const llm = new ChatOllama({
        model: assistant.model,
        baseUrl: CONFIG.OLLAMA_HOST,
        temperature: 0.2,
        numCtx: 8192,
      });


      // Build the LLM history from the conversation
      const messages = await this.buildLlmHistory(assistant, conversation, message, images);


      // Stream the LLM directly with the messages
      const stream = await llm.stream(messages);

      // Handle the LLM streamed response
      for await (const chunk of stream) {
        if (abort.signal.aborted) break;
        console.log("Chunk:", chunk);
        event.reply(ChatEventReply, { response: chunk?.content ?? "", done: false });
      }
      event.reply(ChatEventReply, { done: true });

    } catch (error: any) {
      console.error("Error generating response:", error.message);
      event.reply(ChatEventReply, {
        error: `Error: ${error.message}`,
        done: true,
      });
    }
  }

  async streamLlmAutoGenerate(
    templateAssistantId: string,
    configuration: Record<string, any>,
    previousMessages: BaseMessage[],
    event: IpcMainEvent,
    abort: AbortController,
  ): Promise<void> {
    try {
      const templateAssistant = this.getTemplateAssistant(templateAssistantId);
      if (!templateAssistant) {
        throw new Error("Template assistant not found");
      }

      const llm = new ChatOllama({
        model: templateAssistant.model,
        baseUrl: CONFIG.OLLAMA_HOST,
        temperature: 0.2,
        numCtx: 8192,
      });

      // Build messages for auto-generation
      const messages: BaseMessage[] = [];

      // Add system behavior with configuration injected
      if (templateAssistant.systemBehaviour) {
        const systemBehaviour = templateAssistant.systemBehaviour.replace(
          "{{configuration}}",
          JSON.stringify(configuration, null, 2),
        );
        messages.push(new SystemMessage(systemBehaviour));
      }

      // Add any previous messages (for iterative generation)
      messages.push(...previousMessages);

      // Add the user prompt
      if (templateAssistant.prompt) {
        messages.push(new HumanMessage(templateAssistant.prompt));
      }

      // Stream the LLM response
      const stream = await llm.stream(messages);

      for await (const chunk of stream) {
        if (abort.signal.aborted) break;
        event.reply(AutoGenerateEventReply, { response: chunk?.content ?? "", done: false });
      }
      event.reply(AutoGenerateEventReply, { done: true });

    } catch (error: any) {
      console.error("Error generating auto-content:", error.message);
      event.reply(AutoGenerateEventReply, {
        error: `Error: ${error.message}`,
        done: true,
      });
    }
  }

  async buildLlmHistory(
    assistant: Assistant,
    conversation: Conversation,
    message: string,
    images: string[] | undefined,
  ): Promise<BaseMessage[]> {
    const msgs: BaseMessage[] = [];

    // check for behavior
    if (assistant.systemBehaviour) {
      msgs.push(new SystemMessage(assistant.systemBehaviour));
    }

    // Iterate over the conversation messages and add them to the llm history according to their role
    for (const msg of conversation.messages.filter(
      (message) => !isCustomRole(message.role),
    )) {
      if (isCustomRole(msg.role)) continue;

      if (msg.role === MessageRole.ASSISTANT) {
        msgs.push(new AIMessage(msg.content));
      }

      if (msg.role === MessageRole.USER) {
        msgs.push(this.createHumanMessage(msg.content, msg.images));
      }
    }

    // Format the input based on the assistant configuration
    const llmInput = await this.formatInputBasedOnAssistantConfig(assistant, conversation, message);
    // Add the user message to the history
    msgs.push(this.createHumanMessage(llmInput, images));

    return msgs;
  }

  createHumanMessage(content: string, images: string[] | undefined): HumanMessage {
    return new HumanMessage({
      content: [
        {
          type: "text",
          text: content,
        },
        ...images?.map((image) => ({
          type: "image_url",
          image_url: {
            url: `data:image/jpeg;base64,${image}`,
          },
        })) || [],
      ],
    });
  }


  /**
   * Build the input based on the assistant configuration (ephemeral or not, rag context, etc)
   */
  async formatInputBasedOnAssistantConfig(assistant: Assistant, conversation: Conversation | null, message: string): Promise<string> {
    let input = "";
    const isTheFirstUserInput = conversation?.messages.filter(
      (message) => message.role === MessageRole.USER,
    ).length === 1;

    // If it's the first user input or the assistant is ephemeral, we format the input with the prompt
    if (isTheFirstUserInput || assistant.ephemeral) {
      input = this.formatUserInput(message, assistant.prompt);
    }

    // if it has a contextPath, we add the context to the input using RAG
    if (assistant.contextPath) {
      console.log("Adding context to input");
      const context = await this.ragService.getContext(
        assistant.contextPath,
        message,
      );
      input = `Here is some context:\n\n${context}\n\n---\n\n${input}`;
      console.log("Input with context:", input);
    }

    return input;
  }


  formatUserInput(
    input: string,
    prompt?: string,
  ): string {
    if (!prompt) return input;

    const DEFAULT_TEMPLATE_VARIABLE = "{{text}}";
    const hasTemplateVariable = prompt.includes(DEFAULT_TEMPLATE_VARIABLE);

    let finalInput = "";

    // If there is no template variable defined, append the input to the end of the prompt
    if (!hasTemplateVariable) {
      finalInput = `${prompt}\n\n${input}`;
    }

    // Otherwise, replace the template variable with the user message
    finalInput = prompt.replace(
      DEFAULT_TEMPLATE_VARIABLE,
      input,
    );

    return finalInput;
  }
}



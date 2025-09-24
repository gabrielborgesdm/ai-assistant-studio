import { ChatEvent } from "@global/const/llm.event";
import {
  Assistant,
  Conversation,
  Message,
  MessageRole
} from "@global/types/assistant";
import { LlmMessageStreamResponse } from "@global/types/llm";
import { fileToBase64 } from "@global/utils/file.utils";
import { Page } from "@renderer/pages";
import { useGlobalContext } from "@renderer/provider/GlobalProvider";
import { usePageContext } from "@renderer/provider/PageProvider";
import { useConversationContext } from "@renderer/provider/ConversationProvider";
import { FormEvent, useEffect, useState } from "react";
import { useManageModel } from "../model-status/use-manage-model";
import { AssistantMessageFactory } from "@global/factories/assistant.factory";

interface useHandleChatProps {
  images: File[];
  onRemoveImage: (image: File) => void;
  onAddImage: (image: File) => void;
  onClickAttachFile: () => void;
  conversation: Conversation | undefined | null;
  setConversation: (conversation: Conversation | null) => void;
  textInput: string;
  setTextInput: (textInput: string) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  currentAssistantMessage: string | undefined;
  canceled: boolean;
  setCanceled: (canceled: boolean) => void;
  setCurrentAssistantMessage: (message: string | undefined) => void;
  handleNewChat: () => void;
  handleCancelMessageRequest: () => void;
  handleSubmit: (e: FormEvent) => Promise<void>;
  isNavigationDisabled: boolean;
}

export const useHandleChat = (assistant: Assistant): useHandleChatProps => {
  const { checkRequirementsAreMet, checkOllamaRunning } = useManageModel();
  const { setActivePage } = usePageContext();
  const { setIsNavigationDisabled, isNavigationDisabled } = useGlobalContext();
  const { refreshConversations, selectedConversationId, selectConversation } = useConversationContext();
  const [conversation, setConversation] = useState<Conversation | null>(
    null,
  );
  const [textInput, setTextInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [currentAssistantMessage, setCurrentAssistantMessage] = useState<
    string | undefined
  >(undefined);
  const [canceled, setCanceled] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [images, setImages] = useState<File[]>([]);

  /**
   * Start a new chat conversation
   * Clear the current conversation state to start fresh while preserving all existing conversations
   */
  const handleNewChat = async (): Promise<void> => {
    console.log("Starting new chat for assistant:", assistant.id);

    // Clear current conversation state
    setConversation(null);
    selectConversation(null); // Deselect any selected conversation
    reset();

    // No need to call API or refresh conversations - we're just starting fresh
    // Existing conversations remain in history
  };

  const reset = (): void => {
    setTextInput("");
    setImages([]);
    setCurrentAssistantMessage(undefined);
    setError(undefined);
    setCanceled(false);
  };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    if (!textInput || !textInput.trim()) {
      return;
    }

    if (!assistant) {
      console.error("No assistant selected");
      return;
    }

    setIsLoading(true);
    const base64Images = await getBase64Images();

    // Determine if we should force a new conversation
    // This happens when no conversation is selected (user clicked "New Chat")
    const shouldForceNew = !selectedConversationId && !conversation?.id;

    // save conversation with user message
    const newConversation = await window.api.conversation.saveConversation(
      assistant.id,
      conversation?.id,
      [
        AssistantMessageFactory(MessageRole.USER, textInput, base64Images),
      ],
      shouldForceNew
    );
    setConversation(newConversation);

    // If this is a new conversation, select it and refresh sidebar
    if (newConversation && !selectedConversationId) {
      console.log("New conversation created, selecting and refreshing sidebar...");
      selectConversation(newConversation.id);
      // Immediately refresh conversations to show new conversation in sidebar
      await refreshConversations();
    }

    reset();

    // Set the current assistant message to an empty string to show the loading icon
    setIsDone(false);
    window.api.llm.streamLlmChat(
      assistant.id,
      newConversation,
      textInput,
      base64Images,
      async (res: LlmMessageStreamResponse) => {
        // If we get the stream response, we need to update the chat state
        if (res.response) {
          setCurrentAssistantMessage(
            (old: string | undefined) => `${old || ""}${res.response}`,
          );
        }

        // Not supposed to happen, but show a generic error message if the response is empty
        if (res.error) {
          console.log("Error:", res.error);
          setError(res.error);
          setIsLoading(false);
          setIsDone(true);
          return;
        }

        // When the stream is done, we need to update the chat state, so that the useEffect can store the completed message
        if (res.done) {
          setIsLoading(false);
          setIsDone(true);
        }
      },
    );
  };

  const handleCancelMessageRequest = (): void => {
    window.api.cancel(ChatEvent);
    setCanceled(true);
    setIsLoading(false);
    setIsDone(true);
  };

  const handleIsDone = async (): Promise<void> => {
    let message: Message | undefined;
    // save conversation with user message
    if (error) {
      console.log("Error:", error);
      message = AssistantMessageFactory(MessageRole.CUSTOM_ERROR, error);
    }
    if (currentAssistantMessage) {
      message = AssistantMessageFactory(MessageRole.ASSISTANT, currentAssistantMessage);
    }
    console.log("Message:", message);

    if (message) {
      const newConversation = await window.api.conversation.saveConversation(
        assistant.id,
        conversation?.id,
        [
          message,
        ],
      );
      console.log("New conversation:", newConversation);
      setConversation(newConversation);

      // Always refresh conversations when assistant response is saved
      console.log("Assistant response saved, refreshing conversations...");
      await refreshConversations();

      // Check for updated conversation title after a short delay
      // This allows time for the async title generation to complete
      setTimeout(async () => {
        try {
          const updatedConversation = await window.api.conversation.getConversation(
            assistant.id,
            newConversation?.id
          );
          if (updatedConversation && updatedConversation.description !== newConversation?.description) {
            console.log("Updated conversation title:", updatedConversation.description);
            setConversation(updatedConversation);
            // Refresh conversations in sidebar to show updated title
            await refreshConversations();
          }
        } catch (error) {
          console.error("Failed to check for conversation title update:", error);
        }
      }, 2000);
    }

    reset();
    setIsDone(false);
  };

  const getBase64Images = async (): Promise<string[] | undefined> => {
    if (!images) return undefined;
    return Promise.all(images.map((image) => fileToBase64(image))).then(
      (results) => {
        const filteredResults = results.filter(
          (result) => result !== undefined,
        ) as string[];
        return filteredResults;
      },
    );
  };

  const onAddImage = (file: File): void => {
    setImages((prev) => [...prev, file]);
  };

  const onRemoveImage = (file: File): void => {
    setImages((prev) => prev.filter((image) => image !== file));
  };

  // open electron file picker
  const onClickAttachFile = (): void => {
    window.api.file.selectImage().then((result) => {
      if (result) {
        const blob = new Blob([result.buffer], { type: result.type });
        const file = new File([blob], result.name, { type: result.type });
        onAddImage(file);
      }
    });
  };

  const validateRequirementsAndUpdateChat = async (): Promise<void> => {
    const requirementsMet = checkRequirementsAreMet();
    const isOllamaRunning = await checkOllamaRunning();
    if (!requirementsMet || !isOllamaRunning) {
      console.log("requirements not met");
      setActivePage(Page.Setup);
      return;
    }
  };

  const fetchConversation = async (): Promise<void> => {
    // Only fetch if we have a specific conversation selected
    if (selectedConversationId) {
      const updatedConversation = await window.api.conversation.getConversation(
        assistant.id,
        selectedConversationId,
      );
      setConversation(updatedConversation || null);
    } else {
      // No specific conversation selected - this is "new chat" mode
      setConversation(null);
    }
  };

  // makes sure the chat is ready to go
  const readyUpChat = async (): Promise<void> => {
    await validateRequirementsAndUpdateChat();
    fetchConversation();
    // window.api.ollama.warmupOllama(assistant.model);
  };

  useEffect(() => {
    if (isDone) {
      handleIsDone();
    }
  }, [isDone]);

  // Load the history when the assistant changes
  useEffect(() => {
    readyUpChat();
  }, [assistant]);

  // Load selected conversation when it changes
  useEffect(() => {
    fetchConversation();
  }, [selectedConversationId]);

  useEffect(() => {
    setIsNavigationDisabled(isLoading);
  }, [isLoading]);

  return {
    conversation,
    setConversation,
    textInput,
    setTextInput,
    isLoading,
    setIsLoading,
    currentAssistantMessage,
    setCurrentAssistantMessage,
    canceled,
    setCanceled,
    handleNewChat,
    handleCancelMessageRequest,
    handleSubmit,
    images,
    onRemoveImage,
    onAddImage,
    onClickAttachFile,
    isNavigationDisabled,
  };
};

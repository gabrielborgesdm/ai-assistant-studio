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
  handleClearHistory: () => void;
  handleCancelMessageRequest: () => void;
  handleSubmit: (e: FormEvent) => Promise<void>;
  isNavigationDisabled: boolean;
}

export const useHandleChat = (assistant: Assistant): useHandleChatProps => {
  const { checkRequirementsAreMet, checkOllamaRunning } = useManageModel();
  const { setActivePage } = usePageContext();
  const { setIsNavigationDisabled, isNavigationDisabled } = useGlobalContext();
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
   * Clear the assistant history
   * Call the API to clear the history for the selected assistant while also updating the state
   * Also clear the current assistant message to an empty string
   */
  const handleClearHistory = async (): Promise<void> => {
    if (!assistant || !conversation?.id) {
      return;
    }

    console.log("Clearing history for assistant:", assistant.id);
    await window.api.conversation.clearConversationMessages(conversation?.id);
    setConversation(null);
    reset();
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

    // save conversation with user message
    const newConversation = await window.api.conversation.saveConversation(
      assistant.id,
      conversation?.id,
      [
        AssistantMessageFactory(MessageRole.USER, textInput, base64Images),
      ],
    );
    console.log("New conversation:", newConversation);
    setConversation(newConversation);

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
    const updatedConversation = await window.api.conversation.getConversation(
      assistant.id,
      conversation?.id,
    );
    setConversation(updatedConversation || null);
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
    handleClearHistory,
    handleCancelMessageRequest,
    handleSubmit,
    images,
    onRemoveImage,
    onAddImage,
    onClickAttachFile,
    isNavigationDisabled,
  };
};

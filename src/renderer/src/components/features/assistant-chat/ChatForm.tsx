import { AnimatedLoader } from "@/components/shared/Loader";
import { ChatInput } from "@/components/ui/chat/chat-input";
import { ModelFactory } from "@global/factories/model.factory";
import { Assistant } from "@global/types/assistant";
import { ChatImageDropzone } from "@renderer/components/features/image/ImageDropzone";
import { ImagesDisplay } from "@renderer/components/features/image/ImagesDisplay";
import { ModelStatusCard } from "@renderer/components/features/model-status/ModelStatusCard";
import { useManageModel } from "@renderer/components/features/model-status/use-manage-model";
import { Button } from "@renderer/components/ui/button";
import { usePasteOnRightClick } from "@renderer/hooks/use-paste";
import { cn } from "@renderer/lib/utils";
import { useGlobalContext } from "@renderer/provider/GlobalProvider";
import { useRequirementsContext } from "@renderer/provider/RequirementsProvider";
import { Image, SendHorizonal } from "lucide-react";
import { ReactElement, useEffect, useRef, useState } from "react";

interface ChatFormProps {
  assistant: Assistant;
  images: File[];
  onRemoveImage: (image: File) => void;
  onAddImage: (image: File) => void;
  textInput: string;
  setTextInput: (value: string) => void;
  isLoading: boolean;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onClickAttachFile: () => void;
}

export const ChatForm = ({
  assistant,
  textInput,
  setTextInput,
  isLoading,
  handleSubmit,
  onClickAttachFile,
  images,
  onRemoveImage,
  onAddImage,
}: ChatFormProps): ReactElement => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  usePasteOnRightClick(inputRef, setTextInput);

  const { isModelInstalled } = useManageModel();
  const { isCheckingRequirements } = useRequirementsContext();

  const { setIsNavigationDisabled } = useGlobalContext();
  const [shouldShowDownloadingCard, setShouldShowDownloadingCard] =
    useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [isLoading]);

  const checkShouldShowDownloadingCard = (): void => {
    console.log("Checking should show downloading card");
    console.log("isModelInstalled", isModelInstalled(assistant.model));
    console.log("isCheckingRequirements", isCheckingRequirements);
    console.log("isLoading", isLoading);
    console.log("assistant.model", assistant.model);
    if (
      !isLoading &&
      !isModelInstalled(assistant.model) &&
      !isCheckingRequirements
    ) {
      setShouldShowDownloadingCard(true);
    } else {
      setShouldShowDownloadingCard(false);
    }
  };

  useEffect(() => {
    checkShouldShowDownloadingCard();
  }, [
    isLoading,
    isModelInstalled(assistant.model),
    isCheckingRequirements,
    assistant.model,
  ]);

  if (shouldShowDownloadingCard)
    return (
      <ModelStatusCard
        className="border-t border-0 rounded-none"
        description="You need to download the model before starting a chat with this assistant."
        shouldShowCheckButton={false}
        shouldRenderWhenDownloaded={false}
        model={ModelFactory({ name: assistant.model })}
        onStartedDownloading={() => {
          setIsNavigationDisabled(true);
        }}
        onFinishedDownloading={() => {
          console.log("Finished downloading model");
          setIsNavigationDisabled(false);
          checkShouldShowDownloadingCard();
        }}
      />
    );

  return (
    <form onSubmit={handleSubmit} className="border-t shadow max-w-full">
      <ChatImageDropzone
        onAddImage={onAddImage}
        enabled={assistant.allowImage && !isLoading}
      >
        <ImagesDisplay images={images} onRemoveImage={onRemoveImage} />
        <ChatInput
          placeholder="Type your message here..."
          value={textInput}
          disabled={isLoading}
          ref={inputRef}
          onKeyDown={(e) => {
            if (e.shiftKey && e.key === "Enter") {
              setTextInput(textInput + "\n");
              inputRef.current?.focus();
              return;
            }
            if (e.key === "Enter") {
              handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
            }
          }}
          onChange={(e) => setTextInput(e.target.value)}
          className="min-h-12 resize-none rounded-lg border-0 p-3 shadow-none focus-visible:ring-0"
        />
        <div className="flex items-center p-3 pt-0">
          {assistant.allowImage && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              title="Attach Image"
              className={cn(isLoading && "disabled")}
              disabled={isLoading}
              onClick={onClickAttachFile}
            >
              <Image className="size-4" />
            </Button>
          )}
          <Button size="sm" className="ml-auto gap-1.5">
            {isLoading ? (
              <>
                <AnimatedLoader className="size-3.5" />
              </>
            ) : (
              <>
                Send Message
                <SendHorizonal className="size-3.5" />
              </>
            )}
          </Button>
        </div>
      </ChatImageDropzone>
    </form>
  );
};

import { AnimatedLoader } from '@/components/shared/Loader'
import { ChatInput } from '@/components/ui/chat/chat-input'
import { ModelFactory } from '@global/factories/model.factory'
import { Assistant } from '@global/types/assistant'
import { ModelStatusCard } from '@renderer/components/features/model-status/ModelStatusCard'
import { useManageModel } from '@renderer/components/features/model-status/use-manage-model'
import { Button } from '@renderer/components/ui/button'
import { usePasteOnRightClick } from '@renderer/hooks/use-paste'
import { useGlobalContext } from '@renderer/provider/GlobalProvider'
import { useRequirementsContext } from '@renderer/provider/RequirementsProvider'
import { SendHorizonal } from 'lucide-react'
import { ReactElement, useEffect, useRef } from 'react'

interface ChatFormProps {
  assistant: Assistant

  textInput: string
  setTextInput: (value: string) => void
  isLoading: boolean
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}
export const ChatForm = ({
  assistant,
  textInput,
  setTextInput,
  isLoading,
  handleSubmit
}: ChatFormProps): ReactElement => {
  const inputRef = useRef<HTMLTextAreaElement>(null)
  usePasteOnRightClick(inputRef, setTextInput)

  const { isModelInstalled, saveModel } = useManageModel()
  const { isCheckingRequirements } = useRequirementsContext()

  const { setIsSidebarDisabled } = useGlobalContext()

  useEffect(() => {
    if (!isLoading) {
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }
  }, [isLoading])

  useEffect(() => {
    saveModel(assistant.model)
  }, [assistant.model])

  if (!isLoading && !isModelInstalled(assistant.model) && !isCheckingRequirements)
    return (
      <ModelStatusCard
        className="border-t border-0 rounded-none"
        description="This assistant requires the model to be downloaded before you can chat with it."
        shouldShowCheckButton={false}
        shouldRenderWhenDownloaded={false}
        model={ModelFactory({ name: assistant.model })}
        onStartedDownloading={() => {
          setIsSidebarDisabled(true)
        }}
        onFinishedDownloading={() => {
          setIsSidebarDisabled(false)
        }}
      />
    )
  return (
    <form onSubmit={handleSubmit} className="border-t shadow">
      <ChatInput
        placeholder="Type your message here..."
        value={textInput}
        disabled={isLoading}
        ref={inputRef}
        onKeyDown={(e) => {
          if (e.shiftKey && e.key === 'Enter') {
            setTextInput(textInput + '\n')
            inputRef.current?.focus()
            return
          }
          if (e.key === 'Enter') {
            handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>)
          }
        }}
        onChange={(e) => setTextInput(e.target.value)}
        className="min-h-12 resize-none rounded-lg border-0 p-3 shadow-none focus-visible:ring-0"
      />
      <div className="flex items-center p-3 pt-0">
        {/* Todo: implement Image upload */}
        {/* <Button variant="ghost" size="icon">
          <Paperclip className="size-4" />
          <span className="sr-only">Attach file</span>
        </Button> */}

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
    </form>
  )
}

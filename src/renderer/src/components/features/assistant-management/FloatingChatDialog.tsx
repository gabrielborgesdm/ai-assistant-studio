import { ChatComponent } from '@/components/features/assistant-chat'
import chatAssistant from '@global/resources/assistant-helper.json'
import { Button } from '@renderer/components/ui/button'
import { Card, CardContent } from '@renderer/components/ui/card'
import { MessageCircle } from 'lucide-react'
import { cn } from '@renderer/lib/utils'
import { ReactElement, useState } from 'react'

export const FloatingChatDialog = (): ReactElement => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div
        className={cn(
          ' p-0 m-0 left-0 right-0 top-[-20px] bottom-0 fixed z-0 bg-black/20 overflow-hidden',
          {
            hidden: !open
          }
        )}
        onClick={() => setOpen(false)}
      />
      <div className={'fixed bottom-4 right-20 w-[calc(50vw)] h-[calc(80vh)]'}>
        {open && (
          <Card className=" h-full">
            <CardContent className="h-full">
              <ChatComponent assistant={chatAssistant} shouldShowAvatar={false} />
            </CardContent>
          </Card>
        )}
      </div>
      <Button
        variant="outline"
        size="icon"
        type="button"
        className="fixed bottom-8 right-8"
        onClick={() => setOpen(!open)}
      >
        <MessageCircle />
      </Button>
    </>
  )
}

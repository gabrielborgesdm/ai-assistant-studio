import { Assistant } from '@global/types/assistant'
import { BackButton } from '@renderer/components/shared/BackButton'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@renderer/components/ui/card'
import { usePageContext } from '@renderer/provider/PageProvider'
import { useEffect } from 'react'
import { AssistantForm } from './AssistantForm'

export const AssistantManagement = ({
  assistant
}: {
  assistant?: Assistant
}): React.ReactElement => {
  const { activePage } = usePageContext()

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [activePage])

  return (
    <div className="min-h-screen w-full p-4 space-y-4 ">
      <BackButton />
      <div className="mx-auto w-full">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">Create AI Assistant</CardTitle>
            <CardDescription>
              Configure your AI assistant with custom settings and behavior
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <AssistantForm assistant={assistant} />
          </CardContent>
        </Card>
      </div>
      {/* <FloatingChatDialog /> */}
    </div>
  )
}

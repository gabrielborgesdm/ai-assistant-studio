import { Card, CardContent } from '@renderer/components/ui/card'
import { Bot, Settings, MessageSquare, Zap } from 'lucide-react'
import { ReactElement } from 'react'

export const WelcomeStep = (): ReactElement => {
  return (
    <div className="text-center space-y-8">
      <div className="space-y-4">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mx-auto flex items-center justify-center">
          <Bot className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
          Welcome to AI Assistant Studio
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto dark:text-white">
          Create, customize, and chat with your own AI assistants powered by local language models
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto dark:bg-secondary">
        <Card className="border-2 hover:border-blue-200 transition-colors dark:border-blue-200">
          <CardContent className="pt-6 text-center">
            <Settings className="h-8 w-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Fully Customizable</h3>
            <p className="text-sm text-slate-600 dark:text-white">
              Choose any Ollama model, craft custom prompts, and add specialized input fields for
              your unique use cases
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-purple-200 transition-colors dark:border-purple-200">
          <CardContent className="pt-6 text-center">
            <MessageSquare className="h-8 w-8 text-purple-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Multiple Conversations</h3>
            <p className="text-sm text-slate-600 dark:text-white">
              Create multiple chat sessions with each assistant, keeping your conversations
              organized and contextual
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-green-200 transition-colors dark:border-green-200">
          <CardContent className="pt-6 text-center">
            <Zap className="h-8 w-8 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Privacy First</h3>
            <p className="text-sm text-slate-600 dark:text-white">
              Everything runs locally on your machine. Your data stays private, and you can work
              offline
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-slate-50 rounded-lg p-6 max-w-2xl mx-auto dark:bg-secondary">
        <p className="text-slate-700 dark:text-white">
          <strong>Ready to get started?</strong> We&apos;ll help you set up Ollama and download the
          essential models to power your AI assistants.
        </p>
      </div>
    </div>
  )
}

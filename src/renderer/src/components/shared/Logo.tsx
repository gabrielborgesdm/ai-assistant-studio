import { Bot } from 'lucide-react'
import { ReactElement } from 'react'

export const Logo = (): ReactElement => (
  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mx-auto flex items-center justify-center">
    <Bot className="h-10 w-10 text-white" />
  </div>
)

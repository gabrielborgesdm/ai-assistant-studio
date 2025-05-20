import { SendHorizonal } from 'lucide-react'
import { AnimatedLoader } from './shared/Loader'

export interface FormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>
  input: string
  setInput: (input: string) => void
  isLoading: boolean
}

export const Form = ({ onSubmit, input, setInput, isLoading }: FormProps): React.ReactElement => {
  return (
    <form onSubmit={onSubmit} className="w-full py-5 px-4 border-t flex items-center gap-4">
      <input
        autoFocus
        disabled={isLoading}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className=" flex-grow"
        placeholder="Type something..."
      />
      <button
        disabled={isLoading}
        type="submit"
        title="Send"
        className={`w-15 h-full flex items-center justify-center content-center ${isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
      >
        {isLoading ? (
          <AnimatedLoader className="text-white" />
        ) : (
          <SendHorizonal className="text-white" />
        )}
      </button>
    </form>
  )
}

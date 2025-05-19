import { AnimatedLoader } from './shared/Loader'

export interface FormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>
  input: string
  setInput: (input: string) => void
  isLoading: boolean
}

export const Form = ({ onSubmit, input, setInput, isLoading }: FormProps): React.ReactElement => {
  return (
    <form
      onSubmit={onSubmit}
      className="w-full flex items-center justify-between gap-2 p-4 bg-gray-800  border-gray-700 rounded-md"
    >
      <input
        autoFocus
        disabled={isLoading}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="p-2 border border-gray-700 bg-gray-700 text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow placeholder-gray-400"
        placeholder="Type something..."
      />
      <button
        disabled={isLoading}
        type="submit"
        className={`w-20 h-full flex items-center justify-center content-center bg-blue-600 text-white rounded shadow ${isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-blue-700'} transition-opacity duration-300`}
      >
        {!isLoading ? <AnimatedLoader /> : 'Submit'}
      </button>
    </form>
  )
}

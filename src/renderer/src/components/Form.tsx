export interface FormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>
  input: string
  setInput: (input: string) => void
  isLoading: boolean
}

export const Form = ({ onSubmit, input, setInput, isLoading }: FormProps): React.ReactElement => {
  return (
    <form onSubmit={onSubmit} className="w-full flex items-center justify-between gap-2">
      <input
        autoFocus
        disabled={isLoading}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="p-2 border border-gray-700 bg-gray-700 text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow placeholder-gray-400"
        placeholder="Type something..."
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 shadow"
      >
        Submit
      </button>
    </form>
  )
}

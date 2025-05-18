import { JSX, useState } from 'react'
import { generate } from '@renderer/features/ollama/ollama.service'

export default function App(): JSX.Element {
  const [input, setInput] = useState('')
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e): Promise<void> => {
    e.preventDefault()
    setIsLoading(true)
    const prompt = input
    setInput('')
    setResponse('')
    setIsLoading(true)

    await generate(prompt, (res) => {
      if (!res) {
        setResponse('Error: An error occurred while generating the response.')
        return
      }
      console.log(res)
      setResponse((old) => `${old}${res.response}`)
    })

    setIsLoading(false)
  }

  return (
    <div className="p-4 w-screen font-sans flex flex-col items-center justify-between h-screen gap-4 overflow-hidden bg-gray-900 text-gray-100">
      <div className="relative w-full h-full flex-1">
        <p className="p-2 pt-11 text-gray-200 bg-gray-800 rounded select-text overflow-y-auto h-full w-full shadow-inner border border-gray-700">
          {response}
          {isLoading ? '...' : ''}
        </p>
        <button
          type="button"
          className="absolute top-2 left-2 px-2 py-1 text-xs bg-gray-700 text-gray-200 rounded hover:bg-gray-600 border border-gray-500 shadow"
          style={{ zIndex: 10 }}
          onClick={() => {
            if (response) navigator.clipboard.writeText(response)
          }}
          disabled={!response}
        >
          Copy
        </button>
      </div>
      <form onSubmit={handleSubmit} className="w-full flex items-center justify-between gap-2">
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
    </div>
  )
}

import { generate } from '@renderer/features/ollama/ollama.service'
import { FormEvent, ReactElement, useState } from 'react'
import { Structure } from './components/Structure'
import { Chat } from './components/Chat'
import { Form } from './components/Form'

export default function App(): ReactElement {
  const [input, setInput] = useState('')
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: FormEvent): Promise<void> => {
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
    <Structure>
      <Chat response={response} isLoading={isLoading} />
      <Form onSubmit={handleSubmit} input={input} setInput={setInput} isLoading={isLoading} />
    </Structure>
  )
}

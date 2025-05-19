import { generate } from '@renderer/features/ollama/ollama.service'
import { FormEvent, ReactElement, useEffect, useState } from 'react'
import { Layout } from './components/Layout'
import { Chat } from './components/Chat'
import { Form } from './components/Form'
import { useDataContext } from './context/DataContext'

export default function App(): ReactElement {
  const [input, setInput] = useState('')
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { selectedAction } = useDataContext()

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    if (!selectedAction) {
      console.error('No action selected')
      return
    }

    e.preventDefault()
    setIsLoading(true)
    const prompt = input
    setInput('')
    setResponse('')
    setIsLoading(true)

    await generate(prompt, selectedAction, (res) => {
      if (!res) {
        setResponse('Error: An error occurred while generating the response.')
        return
      }
      setResponse((old) => `${old}${res.response}`)
    })

    setIsLoading(false)
  }

  useEffect(() => {
    setResponse('')
  }, [selectedAction])

  return (
    <Layout>
      <Chat response={response} isLoading={isLoading} />
      <Form onSubmit={handleSubmit} input={input} setInput={setInput} isLoading={isLoading} />
    </Layout>
  )
}

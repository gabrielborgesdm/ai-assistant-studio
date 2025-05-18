import ollama, { GenerateRequest, GenerateResponse } from 'ollama'

export const generate = async (
  text: string,
  callback: (response: GenerateResponse | undefined) => void,
  options: GenerateRequest = {
    model: 'llama3.1:8b',
    prompt: `proofread: ${text}\nReturn only the proofread text, nothing else.`
    // format removed for streaming compatibility
  }
): Promise<void> => {
  try {
    const response = await ollama.generate({ ...options, stream: true })
    console.log('test 0')

    for await (const part of response) {
      console.log('test 1')
      callback(part)
    }
  } catch (error) {
    console.error('Error generating response:', error)
    callback(undefined)
  }
}

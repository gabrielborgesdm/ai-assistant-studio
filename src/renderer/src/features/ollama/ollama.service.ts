import { Action } from '@renderer/types/action'
import ollama, { GenerateResponse } from 'ollama'

export const generate = async (
  input: string,
  action: Action,
  callback: (response: GenerateResponse | undefined) => void
): Promise<void> => {
  try {
    console.log('Generating response for action:', action.title)
    const response = await ollama.generate({
      prompt: action.prompt.replace('{{text}}', input),
      model: action.model,
      ...action.options,
      stream: true
    })

    for await (const part of response) {
      callback(part)
    }
  } catch (error) {
    console.error('Error generating response:', error)
    callback(undefined)
  }
}

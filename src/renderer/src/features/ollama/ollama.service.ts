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
    const wasDownloaded = await downloadModel(action.model)
    if (wasDownloaded) {
      console.log('Model downloaded successfully, retrying generation')
      generate(input, action, callback)
    } else {
      console.error('Failed to download model:', action.model)
      callback(undefined)
    }
  }
}

export const downloadModel = async (modelName: string): Promise<boolean> => {
  try {
    console.log('Attempting to download model', modelName)
    const response = await ollama.pull({ model: modelName, stream: true })

    for await (const part of response) {
      console.log('Model download', part)
    }
    return true
  } catch (error) {
    console.error('Error generating response:', error)
  }
  return false
}

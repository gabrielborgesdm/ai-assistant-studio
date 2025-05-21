import { Action } from '@global/types/action'
import { ipcMain, IpcMainEvent } from 'electron'
import ollama from 'ollama'

export const generate = async (
  input: string,
  action: Action,
  event: IpcMainEvent
): Promise<void> => {
  const channel = 'generate-reply'
  try {
    console.log('Generating response for action:', action.title)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await (ollama as any).default.generate({
      prompt: action.prompt.replace('{{text}}', input),
      model: action.model,
      ...action.options,
      stream: true
    })

    for await (const part of response) {
      event.reply(channel, part)
    }
  } catch (error) {
    console.error('Error generating response:', error)
    event.reply(channel, { error: 'Error generating response' })
  }
}

// export const downloadModel = async (modelName: string): Promise<boolean> => {
//   try {
//     console.log('Attempting to download model', modelName)
//     const response = await ollama.pull({ model: modelName, stream: true })

//     for await (const part of response) {
//       console.log('Model download', part)
//     }
//     return true
//   } catch (error) {
//     console.error('Error generating response:', error)
//   }
//   return false
// }

ipcMain.on('generate', async (event, input: string, action: Action) => {
  console.log('Received generate request from renderer')
  await generate(input, action, event)
})

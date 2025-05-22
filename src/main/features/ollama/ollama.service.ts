import { GenerateEvent, GenerateEventCancel, GenerateEventReply } from '@global/const/ollama.event'
import { Action } from '@global/types/action'
import { ipcMain, IpcMainEvent } from 'electron'
import ollama from 'ollama'

export const generate = async (
  input: string,
  action: Action,
  event: IpcMainEvent,
  abort: AbortController
): Promise<void> => {
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
      // check if the event was cancelled, if so, break the loop
      if (abort.signal.aborted) {
        console.log('Generation aborted by user')
        break
      }
      event.reply(GenerateEventReply, part)
    }
  } catch (error) {
    console.error('Error generating response:', error)
    event.reply(GenerateEventReply, { error: 'Error generating response' })
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

ipcMain.on(GenerateEvent, async (event, input: string, action: Action) => {
  const abort = new AbortController()
  ipcMain.once(GenerateEventCancel, () => {
    console.log('Received cancel request from renderer')
    abort.abort()
  })
  console.log('Received generate request from renderer')

  await generate(input, action, event, abort)
  // Add a listener to the controller's signal that will be triggered when the user cancels the download
})

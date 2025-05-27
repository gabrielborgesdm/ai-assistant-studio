/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChatEvent, ChatEventCancel, ChatEventReply } from '@global/const/ollama.event'
import { Assistant, ActionHistory } from 'src/global/types/assistant'
import { OllamaMessageStreamResponse } from '@global/types/ollama'
import { isCustomRole } from '@global/utils/role.utils'
import { ipcMain, IpcMainEvent } from 'electron'
import ollama from 'ollama'

// Necessary workaround to import ollama in the main process
const getOllama = (): any => (ollama as any).default

export const streamOllamaChatResponse = async (
  action: Assistant,
  history: ActionHistory,
  event: IpcMainEvent,
  abort: AbortController
): Promise<void> => {
  try {
    console.log('Generating response for action:', action.title)

    // If it's ephemeral we keep only the last message
    if (action.ephemeral) {
      console.log('Ephemeral message, keeping only the last message')
      history.messages = history.messages.slice(history.messages.length - 1)
      console.log('History messages:', history.messages)
    }

    // If this is the first message (or ephemeral), we need to replace the message with the prompt
    if (history.messages.length === 1) {
      history.messages[0].content = action.prompt.replace('{{text}}', history.messages[0].content)
      console.log('First message, replacing with prompt:', history.messages[0].content)
    }

    const response = await await getOllama().chat({
      model: action.model,
      // Filter out custom roles from the history, as they are used for UI purposes only
      messages: history.messages.filter((message) => !isCustomRole(message.role)),
      stream: true,
      ...action.options
    })

    for await (const part of response) {
      // check if the event was cancelled, if so, break the loop
      if (abort.signal.aborted) {
        console.log('Chat request aborted by user')
        break
      }

      const replyPayload: OllamaMessageStreamResponse = {
        done: part.done,
        response: part.message.content
      }

      event.reply(ChatEventReply, replyPayload)
    }
  } catch (error: any) {
    console.error('Error generating response:', error.message)
    event.reply(ChatEventReply, { error: `Error: ${error.message}`, done: true })
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

ipcMain.on(ChatEvent, async (event, action: Assistant, history: ActionHistory) => {
  // Initialize the abort controller
  const abort = new AbortController()

  // Listen for the cancel event
  ipcMain.once(ChatEventCancel, () => {
    console.log('Received cancel request from renderer')
    abort.abort()
  })
  console.log('Received streamOllamaChatResponse request from renderer')

  // Call the function to stream the response passing the abort controller
  await streamOllamaChatResponse(action, history, event, abort)
})

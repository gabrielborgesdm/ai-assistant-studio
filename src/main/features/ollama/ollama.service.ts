/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChatEvent,
  ChatEventCancel,
  ChatEventReply,
  DownloadModelEvent,
  getDownloadModelEventCancel,
  getDownloadModelEventReply,
  ListModelsEvent,
  OllamaIsInstalledEvent
} from '@global/const/ollama.event'
import { ModelDownload } from '@global/types/model'
import { OllamaDownloadStreamResponse, OllamaMessageStreamResponse } from '@global/types/ollama'
import { getProgressPercentage } from '@global/utils/progress.utils'
import { isCustomRole } from '@global/utils/role.utils'
import { ipcMain, IpcMainEvent } from 'electron'
import ollama from 'ollama'
import { Assistant, AssistantHistory } from 'src/global/types/assistant'
import axios from 'axios'
import { processStreamBufferToJson } from '@global/utils/buffer.utils'

const OLLAMA_HOST = 'http://localhost:11434' // Default Ollama API host

// Necessary workaround to import ollama in the main process
const getOllama = (): any => (ollama as any).default
export const streamOllamaChatResponse = async (
  assistant: Assistant,
  history: AssistantHistory,
  event: IpcMainEvent,
  abort: AbortController
): Promise<void> => {
  try {
    console.log('Generating response for assistant:', assistant.title)

    // If it's ephemeral we keep only the last message
    if (assistant.ephemeral) {
      console.log('Ephemeral message, keeping only the last message')
      history.messages = history.messages.slice(history.messages.length - 1)
      console.log('History messages:', history.messages)
    }

    // If this is the first message (or ephemeral), we need to replace the message with the prompt
    if (history.messages.length === 1) {
      history.messages[0].content = assistant.prompt.replace(
        '{{text}}',
        history.messages[0].content
      )
      console.log('First message, replacing with prompt:', history.messages[0].content)
    }

    const response = await await getOllama().chat({
      model: assistant.model,
      // Filter out custom roles from the history, as they are used for UI purposes only
      messages: history.messages.filter((message) => !isCustomRole(message.role)),
      stream: true,
      ...assistant.options
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

export const checkOllamaRunning = async (): Promise<boolean> => {
  try {
    const ollama = getOllama()
    const response = await ollama.list()
    console.log('Ollama list response:', response)
    return true
  } catch (error) {
    console.error('Error checking Ollama installation:', error)
  }
  return false
}

export const listModels = async (): Promise<string[]> => {
  try {
    const ollama = getOllama()
    const response = await ollama.list()
    const models = response?.models?.map((model) => model.name)
    return models ?? []
  } catch (error) {
    console.error('Error listing models:', error)
  }
  return []
}

export const downloadModel = async (
  event: IpcMainEvent,
  eventReply: string,
  model: ModelDownload,
  abort: AbortController
): Promise<void> => {
  try {
    const response = await axios.post(
      `${OLLAMA_HOST}/api/pull`,
      { model: model.name },
      { responseType: 'stream', signal: abort.signal }
    )
    let progressAccumulator = 0
    for await (const chunk of response.data) {
      const part = await processStreamBufferToJson(chunk)
      if (!part) {
        throw new Error('No valid JSON object found in chunk')
      }

      console.log(part)
      const currentProgress = getProgressPercentage(part.completed, part.total)
      if (currentProgress > progressAccumulator) {
        progressAccumulator = currentProgress
        console.log('Progress accumulator:', progressAccumulator, typeof progressAccumulator)
      }
      const replyPayload: OllamaDownloadStreamResponse = {
        done: part.status === 'success',
        progress: progressAccumulator
      }

      event.reply(eventReply, replyPayload)

      if (part.status === 'success') {
        return
      }
    }
  } catch (error: any) {
    console.error('Error downloading model:', model.name, error.message)
    event.reply(eventReply, { error: error.message, done: true })
  }
}

ipcMain.on(ChatEvent, async (event, assistant: Assistant, history: AssistantHistory) => {
  // Initialize the abort controller
  const abort = new AbortController()

  // Listen for the cancel event
  ipcMain.once(ChatEventCancel, () => {
    console.log('Received cancel request from renderer')
    abort.abort()
  })
  console.log('Received streamOllamaChatResponse request from renderer')

  // Call the function to stream the response passing the abort controller
  await streamOllamaChatResponse(assistant, history, event, abort)
})

// I need to be able to run this in parallel according to the model name and cancel it if the user requests it
ipcMain.on(DownloadModelEvent, async (event, model: ModelDownload) => {
  const eventReply = getDownloadModelEventReply(model)
  const abort = new AbortController()

  // Listen for the cancel event
  ipcMain.once(getDownloadModelEventCancel(model), () => {
    console.log('Received cancel request from renderer', getDownloadModelEventCancel(model))
    abort.abort()
  })

  // Call the function to stream the response passing the abort controller
  await downloadModel(event, eventReply, model, abort)
})

ipcMain.handle(OllamaIsInstalledEvent, () => checkOllamaRunning())
ipcMain.handle(ListModelsEvent, () => listModels())

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
import { AssistantMessageFactory } from '@global/factories/assistant.factory'
import { Assistant, AssistantHistory, MessageRole } from '@global/types/assistant'
import { ModelDownload } from '@global/types/model'
import { OllamaDownloadStreamResponse, OllamaMessageStreamResponse } from '@global/types/ollama'
import { processStreamBufferToJson } from '@global/utils/buffer.utils'
import { getProgressPercentage } from '@global/utils/progress.utils'
import { isCustomRole } from '@global/utils/role.utils'
import axios from 'axios'
import { ipcMain, IpcMainEvent } from 'electron'
import ollama from 'ollama'

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
    addSystemBehaviorToHistory(history, assistant)
    removeAssistantMessageHistoryIfEphemeral(history, assistant)
    applyPromptToUserMessage(history, assistant)
    console.log('History:', history)

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

// If it's ephemeral we keep only the last message and the system message
const removeAssistantMessageHistoryIfEphemeral = (
  history: AssistantHistory,
  assistant: Assistant
): void => {
  if (assistant.ephemeral) {
    const systemMessages = history.messages.filter((message) => message.role === MessageRole.SYSTEM)
    const userMessage = history.messages[history.messages.length - 1]
    console.log('Ephemeral message, keeping only the system and last message')
    history.messages = [...systemMessages, userMessage]
  }
}
/*
 * The way we deal with the prompt instruction varies if the assistant is ephemeral (single task) or not
 * For non-ephemeral assistants, we only format the user message with the prompt in the first message, otherwise the conversation will be broken
 * For ephemeral assistants, we always format the user message with the prompt, to make sure the A.I. will follow the instructions
 * this approach is necessary because relying only on the system message is not enough to make the A.I. follow what is being asked
 */
const applyPromptToUserMessage = (history: AssistantHistory, assistant: Assistant): void => {
  const countUserMessages = history.messages.filter(
    (message) => message.role === MessageRole.USER
  ).length

  if (!assistant.ephemeral && countUserMessages > 1) {
    return
  }

  // If there is no prompt, we don't need to apply it, sometimes the user just give a system message or just want a general A.I. chat to chat with
  if (!assistant.prompt) {
    return
  }

  const templateVariable = '{{text}}'

  const hasTemplateVariable = assistant.prompt.includes(templateVariable)

  // If there is no template variable defined, we append the prompt the the user message
  if (!hasTemplateVariable) {
    history.messages[history.messages.length - 1].content =
      `${assistant.prompt}\n\n${history.messages[history.messages.length - 1].content}`
    return
  }

  // Otherwise, we replace the template variable with the user message
  history.messages[history.messages.length - 1].content = assistant.prompt.replace(
    templateVariable,
    history.messages[history.messages.length - 1].content
  )
}

// Adds the system behavior to the message history if it's not already there
const addSystemBehaviorToHistory = (history: AssistantHistory, assistant: Assistant): void => {
  if (!assistant.systemBehavior) {
    return
  }

  if (history.messages?.length > 0 && history.messages[0].role === MessageRole.SYSTEM) {
    return
  }

  history.messages.unshift(AssistantMessageFactory(MessageRole.SYSTEM, assistant.systemBehavior))
}

export const checkOllamaRunning = async (): Promise<boolean> => {
  try {
    const ollama = getOllama()
    const response = await ollama.list()
    console.log('Ollama list length:', response?.models?.length)
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

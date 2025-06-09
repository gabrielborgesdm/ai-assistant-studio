/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChatEvent,
  ChatEventCancel,
  DownloadModelEvent,
  getDownloadModelEventCancel,
  getDownloadModelEventReply,
  ListModelsEvent,
  OllamaIsInstalledEvent,
  SearchOnlineModelsEvent
} from '@global/const/ollama.event'
import { Assistant, AssistantHistory } from '@global/types/assistant'
import { ModelDownload } from '@global/types/model'
import { ipcMain } from 'electron'
import {
  streamOllamaChatResponse,
  downloadModel,
  checkOllamaRunning,
  listModels,
  searchOnlineModels
} from './ollama.service'

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

ipcMain.handle(SearchOnlineModelsEvent, (_event, query: string) => searchOnlineModels(query))

/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChatEvent,
  ChatEventCancel,
  DownloadModelEvent,
  getDownloadModelEventCancel,
  getDownloadModelEventReply,
  ListModelsEvent,
  OllamaIsInstalledEvent,
  SearchOnlineModelsEvent,
  WarmupOllamaEvent
} from '@global/const/ollama.event'
import { Assistant, AssistantHistory } from '@global/types/assistant'
import { ModelDownload } from '@global/types/model'
import OllamaService from '@main/features/ollama/ollama.service'
import { ipcMain } from 'electron'

export const setupOllamaController = (): void => {
  const ollamaService = new OllamaService()
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
    await ollamaService.streamOllamaChatResponse(assistant, history, event, abort)
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

    console.log('test', model)

    // Call the function to stream the response passing the abort controller
    await ollamaService.downloadModel(event, eventReply, model, abort)
  })

  ipcMain.handle(OllamaIsInstalledEvent, () => ollamaService.checkOllamaRunning())
  ipcMain.handle(ListModelsEvent, () => ollamaService.listModels())

  ipcMain.handle(SearchOnlineModelsEvent, (_event, query: string) =>
    ollamaService.searchOnlineModels(query)
  )

  ipcMain.handle(WarmupOllamaEvent, (_event, model: string) => ollamaService.warmupOllama(model))
}


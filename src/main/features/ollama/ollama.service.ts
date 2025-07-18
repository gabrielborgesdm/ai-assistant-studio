import { ChatEventReply } from '@global/const/ollama.event'
import { AssistantMessageFactory } from '@global/factories/assistant.factory'
import { Assistant, AssistantHistory, MessageRole } from '@global/types/assistant'
import { ModelDownload, OllamaModel } from '@global/types/model'
import { OllamaDownloadStreamResponse, OllamaMessageStreamResponse } from '@global/types/ollama'
import { processStreamBufferToJson } from '@global/utils/buffer.utils'
import { getProgressPercentage } from '@global/utils/progress.utils'
import { isCustomRole } from '@global/utils/role.utils'
import axios from 'axios'
import { IpcMainEvent } from 'electron'
import ollama from 'ollama'
import { searchOllamaModels } from 'ollama-models-search'
import defaultOllamaModels from '@global/resources/default-ollama-models.json'
import { OllamaModel as SearchOllamaModel } from 'ollama-models-search'
import { RagService } from '../rag/rag.service'

export default class OllamaService {
  OLLAMA_HOST: string = 'http://localhost:11434'
  ollama: any
  ragService: RagService

  constructor() {
    this.ollama = (ollama as any).default
    this.ragService = new RagService()
  }

  async streamOllamaChatResponse(
    assistant: Assistant,
    history: AssistantHistory,
    event: IpcMainEvent,
    abort: AbortController
  ): Promise<void> {
    try {
      this.addsystemBehaviourToHistory(history, assistant)
      this.removeAssistantMessageHistoryIfEphemeral(history, assistant)
      this.applyPromptToUserMessage(history, assistant)

      // If a contextPath is provided in the assistant's configuration,
      // use the RagService to retrieve relevant context from the specified directory.
      if (assistant.contextPath) {
        const userMessage = history.messages[history.messages.length - 1].content
        // Get the context from the RagService based on the user's message.
        const context = await this.ragService.getContext(assistant.contextPath, userMessage)

        // Prepend the retrieved context to the user's message to provide
        // the model with relevant information for generating a response.
        history.messages[history.messages.length - 1].content =
          `Here is some context to help you answer the user's question:\n\n${context}\n\n--------------------\n\n${userMessage}`
      }

      const response = await await this.ollama.chat({
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
  removeAssistantMessageHistoryIfEphemeral(history: AssistantHistory, assistant: Assistant): void {
    if (assistant.ephemeral) {
      const systemMessages = history.messages.filter(
        (message) => message.role === MessageRole.SYSTEM
      )
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
  applyPromptToUserMessage(history: AssistantHistory, assistant: Assistant): void {
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
  addsystemBehaviourToHistory(history: AssistantHistory, assistant: Assistant): void {
    if (!assistant.systemBehaviour) {
      return
    }

    if (history.messages?.length > 0 && history.messages[0].role === MessageRole.SYSTEM) {
      return
    }

    // Add the system behavior to the message history
    history.messages.unshift(AssistantMessageFactory(MessageRole.SYSTEM, assistant.systemBehaviour))
  }

  // Todo: check memory or running models before warming up
  async warmupOllama(model: string): Promise<void> {
    try {
      console.log('Warming up Ollama Model', model)
      await this.ollama.generate({
        model,
        messages: [{ role: 'user', content: 'Hi' }],
        stream: false,
        keep_alive: '30m'
      })
    } catch (error) {
      console.error('Error warming up Ollama:', error)
    }
  }

  async checkOllamaRunning(): Promise<boolean> {
    try {
      await this.ollama.list()
      return true
    } catch (error) {
      console.error('Error checking Ollama installation:', error)
    }
    return false
  }

  async listModels(): Promise<string[]> {
    try {
      const response = await this.ollama.list()
      const models = response?.models?.map((model) => model.name)
      return models ?? []
    } catch (error) {
      console.error('Error listing models:', error)
    }
    return []
  }

  async deleteModel(model: string): Promise<boolean> {
    try {
      const response = await this.ollama.delete({ model })
      console.log('Model deleted:', model)
      console.log(JSON.stringify(response, null, 2))
      return true
    } catch (error) {
      console.error('Error deleting model:', error)
      return false
    }
  }

  async downloadModel(
    event: IpcMainEvent,
    eventReply: string,
    model: ModelDownload,
    abort: AbortController
  ): Promise<void> {
    try {
      //Todo: use ollama npm pull and ollama.abort() to cancel the download
      const response = await axios.post(
        `${this.OLLAMA_HOST}/api/pull`,
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

        if (part.error) {
          console.error('Error downloading model:', model.name, part.error)
          throw new Error(part.error)
        }
      }
    } catch (error: any) {
      console.error('Error downloading model:', model.name, error.message)
      event.reply(eventReply, { error: error.message, done: true })
    }
  }

  async searchOnlineModels(query: string): Promise<OllamaModel[]> {
    try {
      const [response, isOffline] = await new Promise<[SearchOllamaModel[], boolean]>((resolve) => {
        // If the request takes too long, resolve with the default stored models (Scraped at 2025-06-10)
        const timeout = setTimeout(() => {
          console.log('Took too long to search models, returning default models')
          // Deep cloning the default models to avoid modifying the original json resource
          resolve([structuredClone(defaultOllamaModels) as SearchOllamaModel[], true])
        }, 4000)

        searchOllamaModels({ query }).then((models) => {
          console.log('Successfully searched for Ollama models')
          clearTimeout(timeout)
          resolve([models, false])
        })
      })

      let availableModels = response

      // If we are offline, we need to manually filter the models to match the query
      if (isOffline && query) {
        availableModels = availableModels.filter((model) =>
          model.name.includes(query.toLocaleLowerCase())
        )
      }

      const downloadedModels: { name: string; version: string }[] =
        (await this.listModels().then((models) => {
          return models.map((model) => {
            const [name, version] = model.split(':')
            return {
              name,
              version
            }
          })
        })) || []

      console.log('Downloaded models:', downloadedModels)

      const favoriteModels = downloadedModels
        .map((model) => model.name)
        .concat(['llama3.1', 'mistral-small', 'phi4', 'qwen2.5v'])

      // Step 1: Create a Map to assign each favorite model a priority index (for sorting)
      const priorityMap = new Map(favoriteModels.map((name, index) => [name, index]))

      // Step 2: Sort the response array based on the priority in favoriteModels
      // Models not in the favorites list get a large value (Infinity), so they appear last
      availableModels.sort((a, b) => {
        const aPriority = priorityMap.has(a.name) ? priorityMap.get(a.name)! : Infinity
        const bPriority = priorityMap.has(b.name) ? priorityMap.get(b.name)! : Infinity
        return aPriority - bPriority
      })

      // Step 3: Format the searched model to our needs
      const formattedResponse: OllamaModel[] = []
      for (let i = 0; i < availableModels.length; i++) {
        const model: OllamaModel = availableModels[i]

        // Add latest version to the top
        model.versions.unshift('latest')

        // Filter the versions of the model that are installed
        const versionsInstalled = downloadedModels.filter(
          (downloadedModel) => downloadedModel.name === model.name
        )

        // Assign them to the formatted item
        model.installedVersions = versionsInstalled.map(
          (downloadedModel) => downloadedModel.version
        )

        // Assign an id to the model for frontend purposes
        model.id = i
        formattedResponse.push(model)
      }

      return formattedResponse
    } catch (error: any) {
      console.error('Error searching models:', error)
      throw error
    }
  }
}

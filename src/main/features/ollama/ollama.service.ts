import { CONFIG } from "@global/config";
import defaultOllamaModels from "@global/resources/default-ollama-models.json";
import { ModelDownload, OllamaModel } from "@global/types/model";
import {
    LlmDownloadStreamResponse
} from "src/global/types/llm";
import { processStreamBufferToJson } from "@global/utils/buffer.utils";
import { getProgressPercentage } from "@global/utils/progress.utils";
import axios from "axios";
import { IpcMainEvent } from "electron";
import ollama from "ollama";
import {
    OllamaModel as SearchOllamaModel,
    searchOllamaModels,
} from "ollama-models-search";

export default class OllamaService {
    ollama: any;

    constructor() {
        this.ollama = (ollama as any).default;

    }

    async warmupOllama(model: string): Promise<void> {
        try {
          console.log("Warming up Ollama Model", model);
          await this.ollama.generate({
            model,
            messages: [{ role: "user", content: "Hi" }],
            stream: false,
            keep_alive: "30m",
          });
        } catch (error) {
          console.error("Error warming up Ollama:", error);
        }
      }
    
      async checkOllamaRunning(): Promise<boolean> {
        try {
          await this.ollama.list();
          return true;
        } catch (error) {
          console.error("Error checking Ollama installation:", error);
        }
        return false;
      }
    
      async listModels(): Promise<string[]> {
        try {
          const response = await this.ollama.list();
          const models = response?.models?.map((model) => model.name);
          return models ?? [];
        } catch (error) {
          console.error("Error listing models:", error);
        }
        return [];
      }
    
      async deleteModel(model: string): Promise<boolean> {
        try {
          const response = await this.ollama.delete({ model });
          console.log("Model deleted:", model);
          console.log(JSON.stringify(response, null, 2));
          return true;
        } catch (error) {
          console.error("Error deleting model:", error);
          return false;
        }
      }
    
      async downloadModel(
        event: IpcMainEvent,
        eventReply: string,
        model: ModelDownload,
        abort: AbortController,
      ): Promise<void> {
        try {
          //Todo: use ollama npm pull and ollama.abort() to cancel the download
          const response = await axios.post(
            `${CONFIG.OLLAMA_HOST}/api/pull`,
            { model: model.name },
            { responseType: "stream", signal: abort.signal },
          );
          let progressAccumulator = 0;
          for await (const chunk of response.data) {
            const part = await processStreamBufferToJson(chunk);
            if (!part) {
              throw new Error("No valid JSON object found in chunk");
            }
    
            console.log(part);
            const currentProgress = getProgressPercentage(
              part.completed,
              part.total,
            );
            if (currentProgress > progressAccumulator) {
              progressAccumulator = currentProgress;
              console.log(
                "Progress accumulator:",
                progressAccumulator,
                typeof progressAccumulator,
              );
            }
            const replyPayload: LlmDownloadStreamResponse = {
              done: part.status === "success",
              progress: progressAccumulator,
            };
    
            event.reply(eventReply, replyPayload);
    
            if (part.status === "success") {
              return;
            }
    
            if (part.error) {
              console.error("Error downloading model:", model.name, part.error);
              throw new Error(part.error);
            }
          }
        } catch (error: any) {
          console.error("Error downloading model:", model.name, error.message);
          event.reply(eventReply, { error: error.message, done: true });
        }
      }
    
      async searchOnlineModels(query: string): Promise<OllamaModel[]> {
        try {
          const [response, isOffline] = await new Promise<
            [SearchOllamaModel[], boolean]
          >((resolve) => {
            // If the request takes too long, resolve with the default stored models (Scraped at 2025-06-10)
            const timeout = setTimeout(() => {
              console.log(
                "Took too long to search models, returning default models",
              );
              // Deep cloning the default models to avoid modifying the original json resource
              resolve([
                structuredClone(defaultOllamaModels) as SearchOllamaModel[],
                true,
              ]);
            }, 4000);
    
            searchOllamaModels({ query }).then((models) => {
              console.log("Successfully searched for Ollama models");
              clearTimeout(timeout);
              resolve([models, false]);
            });
          });
    
          let availableModels = response;
    
          // If we are offline, we need to manually filter the models to match the query
          if (isOffline && query) {
            availableModels = availableModels.filter((model) =>
              model.name.includes(query.toLocaleLowerCase()),
            );
          }
    
          const downloadedModels: { name: string; version: string }[] =
            (await this.listModels().then((models) => {
              return models.map((model) => {
                const [name, version] = model.split(":");
                return {
                  name,
                  version,
                };
              });
            })) || [];
    
          console.log("Downloaded models:", downloadedModels);
    
          const favoriteModels = downloadedModels
            .map((model) => model.name)
            .concat(["llama3.1", "mistral-small", "phi4", "qwen2.5v"]);
    
          // Step 1: Create a Map to assign each favorite model a priority index (for sorting)
          const priorityMap = new Map(
            favoriteModels.map((name, index) => [name, index]),
          );
    
          // Step 2: Sort the response array based on the priority in favoriteModels
          // Models not in the favorites list get a large value (Infinity), so they appear last
          availableModels.sort((a, b) => {
            const aPriority = priorityMap.has(a.name)
              ? priorityMap.get(a.name)!
              : Infinity;
            const bPriority = priorityMap.has(b.name)
              ? priorityMap.get(b.name)!
              : Infinity;
            return aPriority - bPriority;
          });
    
          // Step 3: Format the searched model to our needs
          const formattedResponse: OllamaModel[] = [];
          for (let i = 0; i < availableModels.length; i++) {
            const model: OllamaModel = availableModels[i];
    
            // Add latest version to the top
            model.versions.unshift("latest");
    
            // Filter the versions of the model that are installed
            const versionsInstalled = downloadedModels.filter(
              (downloadedModel) => downloadedModel.name === model.name,
            );
    
            // Assign them to the formatted item
            model.installedVersions = versionsInstalled.map(
              (downloadedModel) => downloadedModel.version,
            );
    
            // Assign an id to the model for frontend purposes
            model.id = i;
            formattedResponse.push(model);
          }
    
          return formattedResponse;
        } catch (error: any) {
          console.error("Error searching models:", error);
          throw error;
        }
      }
}

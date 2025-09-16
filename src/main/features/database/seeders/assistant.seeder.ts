import { AssistantRepository } from "@main/features/assistants/model/assistant.repository";
import { Assistant } from "@main/features/assistants/model/assistant.model";
import defaultAssistants from "@global/resources/default-assistants.json";

export class AssistantSeeder {
  private assistantRepository: AssistantRepository;

  constructor() {
    this.assistantRepository = new AssistantRepository();
  }

  async seed(): Promise<void> {
    try {
      console.log("Starting assistant seeding...");

      // Check if we already have assistants
      const existingAssistants = await this.assistantRepository.getAllAssistants();

      // Get existing assistant IDs
      const existingIds = new Set(existingAssistants.map(a => a.id));

      // Seed default assistants if they don't exist
      for (const defaultAssistant of defaultAssistants) {
        if (!existingIds.has(defaultAssistant.id)) {
          const assistantData: Partial<Assistant> = {
            id: defaultAssistant.id,
            title: defaultAssistant.title,
            description: defaultAssistant.description,
            model: defaultAssistant.model.includes(":")
              ? defaultAssistant.model
              : `${defaultAssistant.model}:latest`,
            prompt: defaultAssistant.prompt || undefined,
            systemBehaviour: defaultAssistant.systemBehaviour || undefined,
            ephemeral: defaultAssistant.ephemeral || false,
            allowImage: defaultAssistant.allowImage || false,
            downloaded: false, // Will be updated when checking Ollama
            options: undefined,
            contextPath: undefined
          };

          await this.assistantRepository.createAssistant(assistantData);
          console.log(`Seeded default assistant: ${defaultAssistant.title}`);
        } else {
          console.log(`Assistant already exists: ${defaultAssistant.title}`);
        }
      }

      console.log("Assistant seeding completed");
    } catch (error) {
      console.error("Error seeding assistants:", error);
      throw error;
    }
  }

  async updateModelDownloadStatus(installedModels: string[]): Promise<void> {
    try {
      const assistants = await this.assistantRepository.getAllAssistants();

      for (const assistant of assistants) {
        const isDownloaded = installedModels.some(model =>
          model === assistant.model ||
          model.startsWith(assistant.model.split(':')[0])
        );

        if (assistant.downloaded !== isDownloaded) {
          await this.assistantRepository.updateAssistant(assistant.id, {
            downloaded: isDownloaded
          });
        }
      }
    } catch (error) {
      console.error("Error updating model download status:", error);
    }
  }
}
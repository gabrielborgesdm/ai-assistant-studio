import { AssistantDataFactory } from "@global/factories/assistant.factory";
import { Assistant, AssistantFormData } from "@global/types/assistant";
import { AssistantRepository } from "@main/features/assistants/model/assistant.repository";
import { DatabaseSeeder } from "@main/features/database/seeders/database.seeder";
import OllamaService from "@main/features/ollama/ollama.service";

export default class AssistantService {
  assistantRepository: AssistantRepository;
  private ollamaService: OllamaService;
  private databaseSeeder: DatabaseSeeder;

  constructor() {
    this.assistantRepository = new AssistantRepository();
    this.ollamaService = new OllamaService();
    this.databaseSeeder = new DatabaseSeeder();
  }

  getAssistants = async (): Promise<Assistant[]> => {
    return this.assistantRepository.getAllAssistants();
  };

  getAssistantById = async (assistantId: string): Promise<Assistant | null> => {
    return this.assistantRepository.getAssistant(assistantId);
  };

  saveAssistant = async (
    assistantData: AssistantFormData,
    assistantId: string | undefined,
  ): Promise<Assistant | null> => {
    // This is to ensure that base models are saved with the latest tag
    // In the near future I'll probably implement a proper versioning system
    let model = assistantData.model;
    if (!model.includes(":")) {
      model = `${model}:latest`;
    }

    const assistantPayload = AssistantDataFactory(
      { ...assistantData, model },
      assistantId,
    );
    if (assistantId) {
      return await this.assistantRepository.updateAssistant(
        assistantId,
        assistantPayload,
      );
    }

    return await this.assistantRepository.createAssistant(assistantPayload);
  };

  deleteAssistant = async (assistantId: string): Promise<void> => {
    await this.assistantRepository.deleteAssistant(assistantId);
  };

  refreshModelDownloadStatus = async (): Promise<void> => {
    try {
      const installedModels = await this.ollamaService.listModels();
      await this.databaseSeeder.updateModelStatuses(installedModels);
      console.log("Assistant model download status refreshed");
    } catch (error) {
      console.error("Failed to refresh model download status:", error);
      throw error;
    }
  };
}

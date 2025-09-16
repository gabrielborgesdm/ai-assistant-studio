import { AssistantSeeder } from "./assistant.seeder";
import { ConfigRepository } from "@main/features/electron/model/config.repository";

export class DatabaseSeeder {
  private assistantSeeder: AssistantSeeder;
  private configRepository: ConfigRepository;

  constructor() {
    this.assistantSeeder = new AssistantSeeder();
    this.configRepository = new ConfigRepository();
  }

  async seedAll(): Promise<void> {
    try {
      console.log("Starting database seeding process...");

      // Check if we've already seeded using config flag
      const isSeeded = await this.configRepository.isDatabaseSeeded();

      if (!isSeeded) {
        // First time seeding
        console.log("First time setup detected, seeding database...");

        // Seed assistants
        await this.assistantSeeder.seed();

        // Mark as seeded
        await this.configRepository.markDatabaseAsSeeded();

        console.log("Database seeding completed successfully");
      } else {
        console.log("Database already seeded, skipping...");
      }
    } catch (error) {
      console.error("Error during database seeding:", error);
      throw error;
    }
  }

  async updateModelStatuses(installedModels: string[]): Promise<void> {
    await this.assistantSeeder.updateModelDownloadStatus(installedModels);
  }
}
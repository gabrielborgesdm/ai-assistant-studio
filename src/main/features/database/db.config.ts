import "reflect-metadata";
import { DataSource } from "typeorm";

import { Config } from "@main/features/electron/model/config.model";
import { Assistant } from "@main/features/assistants/model/assistant.model";
import { Conversation } from "@main/features/conversation/model/conversation.model";
import { Message } from "@main/features/messages/model/messages.model";
import { DatabaseSeeder } from "@main/features/database/seeders/database.seeder";
import OllamaService from "@main/features/ollama/ollama.service";
import { app } from "electron";
import path from "path";

/*
 * This file is responsible for initializing the database and handling
 * the IPC calls to the db services.
 * It uses lowdb to create a JSON file based database.
 * The database is stored in the user data directory of the app.
 */

export const AppDataSource = new DataSource({
  type: "better-sqlite3",
  database: path.join(app.getPath("userData"), "app.db"),
  synchronize: true,
  entities: [Config, Assistant, Conversation, Message],
});

export async function initDB(): Promise<void> {
  // --- SQL (TypeORM) init ---
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
    console.log(
      "TypeORM initialized with entities:",
      AppDataSource.entityMetadatas.map((e) => e.name),
    );

    // --- Run database seeders ---
    const seeder = new DatabaseSeeder();
    await seeder.seedAll();

    // --- Update model download status ---
    try {
      const ollamaService = new OllamaService();
      const installedModels = await ollamaService.listModels();
      await seeder.updateModelStatuses(installedModels);
      console.log("Model download status updated");
    } catch (error) {
      console.error("Failed to update model status (Ollama might not be running):", error);
    }
  }

}

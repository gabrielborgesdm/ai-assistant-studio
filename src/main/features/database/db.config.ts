import "reflect-metadata";
import { DataSource } from "typeorm";

import defaultAssistants from "@global/resources/default-assistants.json";
import { Assistant, AssistantHistory } from "@global/types/assistant";
import { DBType } from "@main/features/database/db.type";
import { app } from "electron";
import fs from "fs/promises";
import { JSONFilePreset } from "lowdb/node";
import path from "path";
import { Config } from "./models/config";
console.log("config", Config);

/*
 * This file is responsible for initializing the database and handling
 * the IPC calls to the db services.
 * It uses lowdb to create a JSON file based database.
 * The database is stored in the user data directory of the app.
 */

const initialData: {
  assistants: Assistant[];
  history: AssistantHistory[];
} = {
  assistants: defaultAssistants,
  history: [],
};

let db: DBType;

export const AppDataSource = new DataSource({
  type: "better-sqlite3",
  database: path.join(app.getPath("userData"), "app.db"),
  synchronize: true,
  entities: [Config],
});

export async function initDB(): Promise<DBType> {
  const file = path.join(app.getPath("userData"), "db.json");
  // for debug purposes, remove the db file if env var is set
  if (process.env.VITE_DEBUG_CLEANUP) {
    console.log("Removing database file for debug purposes");
    try {
      await fs.rm(file).then(() => console.log("Database file removed"));
    } catch (error) {
      console.error("Error removing database file:", error);
    }
  }

  db = await JSONFilePreset(file, initialData);
  await db.read();

  // --- SQL (TypeORM) init ---
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
    console.log(
      "TypeORM initialized with entities:",
      AppDataSource.entityMetadatas.map((e) => e.name),
    );
  }

  return db;
}

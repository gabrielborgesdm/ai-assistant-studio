import { DBType } from "@main/features/database/db.type";
import { BrowserWindow } from "electron";
import ElectronSettingsService from "@main/features/electron/electron-settings.service";
import { ConfigRepository } from "@main/features/database/repository/config-repository";


export const setupStartup = async (
  mainWindow: BrowserWindow | null,
  db: DBType,
): Promise<void> => {
  if (!mainWindow || !db) {
    throw new Error("Main window is not initialized");
  }

  await db.read();
  const configRepository = new ConfigRepository();
  try {
    const config = await configRepository.getConfig();
    console.log('config', config);
    if (!config) {
      console.log("No config found");
      return;
    }
  } catch (error) {
    console.error("Failed to get config:", error);
    return;
  }

  new ElectronSettingsService(mainWindow, db);

};

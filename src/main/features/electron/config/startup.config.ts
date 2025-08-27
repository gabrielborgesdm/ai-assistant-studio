import ElectronSettingsService from "@main/features/electron/electron-settings.service";
import { ConfigRepository } from "@main/features/electron/model/config.repository";
import { BrowserWindow } from "electron";

export const setupStartup = async (
  mainWindow: BrowserWindow | null,
): Promise<void> => {
  if (!mainWindow) {
    throw new Error("Main window is not initialized");
  }

  const configRepository = new ConfigRepository();
  try {
    const config = await configRepository.getConfig();
    if (!config) {
      console.log("No config found");
      return;
    }
  } catch (error) {
    console.error("Failed to get config:", error);
    return;
  }

  new ElectronSettingsService(mainWindow);

};

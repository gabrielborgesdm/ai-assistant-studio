import ElectronSettingsService from "@main/features/electron/electron-settings.service";
import { ConfigRepository } from "@main/features/electron/model/config.repository";
import { BrowserWindow } from "electron";

export const setupShortcut = async (
  mainWindow: BrowserWindow | null,
): Promise<void> => {
  if (!mainWindow) {
    throw new Error("Main window is not initialized");
  }

  const configRepository = new ConfigRepository();
  try {
    const config = await configRepository.getConfig();
    console.log("config", config);
    const shortcutService = new ElectronSettingsService(mainWindow);

    if (!config?.shortcut) {
      console.log("No shortcut found");
      return;
    }
    shortcutService.registerShortcut(config.shortcut);
  } catch (error) {
    console.error("Failed to get config:", error);
    return;
  }
};

import { DBType } from "@main/features/database/db.type";
import { BrowserWindow } from "electron";
import ElectronSettingsService from "@main/features/electron/electron-settings.service";

export const setupShortcut = async (
  mainWindow: BrowserWindow | null,
  db: DBType,
): Promise<void> => {
  if (!mainWindow || !db) {
    throw new Error("Main window is not initialized");
  }

  await db.read();
  const config = db.data?.config;
  if (!config.shortcut) {
    console.log("No shortcut found");
    return;
  }

  const shortcutService = new ElectronSettingsService(mainWindow, db);
  shortcutService.registerShortcut(config.shortcut);
};

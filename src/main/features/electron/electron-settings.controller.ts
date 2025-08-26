import {
  GetConfigEvent,
  GetOsEvent,
  RegisterShortcutEvent,
  RegisterStartupEvent,
} from "@global/const/config.event";
import ElectronSettingsService from "@main/features/electron/electron-settings.service";
import { BrowserWindow, ipcMain } from "electron";
import { DBType } from "@main/features/database/db.type";

export const setupElectronSettingsController = (
  db: DBType,
  mainWindow: BrowserWindow | null,
): void => {
  if (!mainWindow) {
    throw new Error("Main window is not initialized");
  }
  const shortcutService = new ElectronSettingsService(mainWindow, db);

  ipcMain.handle(RegisterShortcutEvent, (_event, accelerator: string) => {
    console.log("Registering shortcut:", accelerator);
    return shortcutService.registerShortcut(accelerator);
  });

  ipcMain.handle(RegisterStartupEvent, (_event, runAtStartup: boolean) => {
    return shortcutService.registerOpenAtStartup(runAtStartup);
  });

  ipcMain.handle(GetConfigEvent, () => shortcutService.getConfig());
  ipcMain.handle(GetOsEvent, () => shortcutService.getOs());
};

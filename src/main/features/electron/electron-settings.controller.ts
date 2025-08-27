import {
  GetConfigEvent,
  GetOsEvent,
  RegisterShortcutEvent,
  RegisterStartupEvent,
} from "@global/const/config.event";
import ElectronSettingsService from "@main/features/electron/electron-settings.service";
import { BrowserWindow, ipcMain } from "electron";

export const setupElectronSettingsController = (
  mainWindow: BrowserWindow | null,
): void => {
  if (!mainWindow) {
    throw new Error("Main window is not initialized");
  }
  const shortcutService = new ElectronSettingsService(mainWindow);

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

import { globalShortcut, BrowserWindow } from "electron";
import { DBType } from "@main/features/database/db.type";
import { app } from "electron";
import { ConfigRepository } from "@main/features/database/repository/config-repository";
import { Config } from "@global/types/config";

export default class ElectronSettingsService {
  mainWindow: BrowserWindow;
  db: DBType;
  configRepository: ConfigRepository;

  constructor(mainWindow: BrowserWindow, db: DBType) {
    this.mainWindow = mainWindow;
    this.db = db;
    this.configRepository = new ConfigRepository();
  }

  registerShortcut(accelerator: string | undefined): string | undefined {
    // Unregister all shortcuts
    console.log("Unregistering all shortcuts");
    globalShortcut.unregisterAll();

    console.log(`Registering shortcut: ${accelerator}`);

    try {
      this.configRepository.saveConfig({ shortcut: accelerator });
      console.log(`Shortcut registered: ${accelerator}`);
    } catch (error) {
      console.error("Failed to update shortcut config:", error);
    }

    if (!accelerator) return;

    const success = globalShortcut.register(accelerator, () => {
      this.toggleWindow();
    });

    if (!success) {
      console.error(`Failed to register shortcut: ${accelerator}`);
      return;
    }

    return accelerator;
  }

  registerOpenAtStartup(runAtStartup: boolean): boolean {
    console.log(`Registering open at startup: ${runAtStartup}`);

    try {
      this.configRepository.saveConfig({ runAtStartup });
      console.log(`Open at startup registered: ${runAtStartup}`);
    } catch (error) {
      console.error("Failed to update runAtStartup config:", error);
    }

    try {
      app.setLoginItemSettings({
        openAtLogin: runAtStartup,
        args: ["--hidden"],
      });
    } catch (error) {
      console.error("Failed to update runAtStartup config:", error);
    }

    return runAtStartup;
  }

  async getConfig(): Promise<Config | undefined> {
    const config = await this.configRepository.getConfig();
    if (!config) return await this.configRepository.saveConfig({});

    return config;
  }

  async getOs(): Promise<string> {
    return process.platform;
  }

  toggleWindow(): void {
    if (!this.mainWindow) return;
    if (this.mainWindow.isVisible()) {
      this.mainWindow.hide();
    } else {
      this.mainWindow.show();
      this.mainWindow.focus();
    }
  }
}

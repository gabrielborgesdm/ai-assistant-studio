import { Config } from "@global/types/config";
import { ConfigRepository } from "@main/features/electron/model/config.repository";
import { app, BrowserWindow, globalShortcut } from "electron";

export default class ElectronSettingsService {
  mainWindow: BrowserWindow;
  configRepository: ConfigRepository;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
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

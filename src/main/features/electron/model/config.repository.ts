
// repositories/ConfigRepository.ts
import { AppDataSource } from "@main/features/database/db.config";
import { Config } from "@main/features/electron/model/config.model";

export class ConfigRepository {
  private repo = AppDataSource.getRepository(Config);

  async getConfig(): Promise<Config | null> {
    const config = await this.repo.findOne({ where: { id: 1 } });

    return config;
  }

  async saveConfig(config: Partial<Config>): Promise<Config> {
    let existing = await this.repo.findOne({ where: { id: 1 } });

    if (!existing) {
      console.log("No config found, creating initial config");
      // create initial config
      existing = this.repo.create({
        id: 1,
        windowWidth: config.windowWidth ?? 800,
        windowHeight: config.windowHeight ?? 600,
        shortcut: config.shortcut ?? "Ctrl+Shift+X",
        runAtStartup: config.runAtStartup ?? false,
        databaseSeeded: config.databaseSeeded ?? false,
      });
    } else {
      // update existing config
      this.repo.merge(existing, config);
    }

    return this.repo.save(existing);
  }

  async isDatabaseSeeded(): Promise<boolean> {
    const config = await this.getConfig();
    return config?.databaseSeeded ?? false;
  }

  async markDatabaseAsSeeded(): Promise<void> {
    await this.saveConfig({ databaseSeeded: true });
  }
}

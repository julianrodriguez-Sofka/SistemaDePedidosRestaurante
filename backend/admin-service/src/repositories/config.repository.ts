import { ConfigModel, IConfig } from '../models/config.model';

export class ConfigRepository {
  async get(): Promise<IConfig | null> {
    return await ConfigModel.findOne();
  }

  async createOrUpdate(configData: Partial<IConfig>): Promise<IConfig> {
    const existing = await ConfigModel.findOne();
    if (existing) {
      Object.assign(existing, configData);
      return await existing.save();
    } else {
      const config = new ConfigModel(configData);
      return await config.save();
    }
  }
}
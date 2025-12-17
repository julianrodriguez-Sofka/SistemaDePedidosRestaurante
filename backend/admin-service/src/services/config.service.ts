import { ConfigRepository } from '../repositories/config.repository';
import { IConfig } from '../models/config.model';

export class ConfigService {
  private configRepository: ConfigRepository;

  constructor() {
    this.configRepository = new ConfigRepository();
  }

  async getConfig(): Promise<IConfig | null> {
    return await this.configRepository.get();
  }

  async updateConfig(configData: Partial<IConfig>): Promise<IConfig> {
    return await this.configRepository.createOrUpdate(configData);
  }
}
import { Request, Response, NextFunction } from 'express';
import { ConfigService } from '../services/config.service';

export class ConfigController {
  private configService: ConfigService;

  constructor() {
    this.configService = new ConfigService();
  }

  getConfig = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const config = await this.configService.getConfig();
      res.status(200).json({ success: true, data: config });
    } catch (error) {
      next(error);
    }
  };

  updateConfig = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const config = await this.configService.updateConfig(req.body);
      res.status(200).json({ success: true, data: config });
    } catch (error) {
      next(error);
    }
  };
}
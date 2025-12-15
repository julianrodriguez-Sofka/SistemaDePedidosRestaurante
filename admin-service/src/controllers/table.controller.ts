import { Request, Response, NextFunction } from 'express';
import { TableService } from '../services/table.service';

export class TableController {
  private tableService: TableService;

  constructor() {
    this.tableService = new TableService();
  }

  createTable = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const table = await this.tableService.createTable(req.body);
      res.status(201).json({ success: true, data: table });
    } catch (error) {
      next(error);
    }
  };

  getAllTables = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tables = await this.tableService.getAllTables();
      res.status(200).json({ success: true, data: tables });
    } catch (error) {
      next(error);
    }
  };

  getTableById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const table = await this.tableService.getTableById(req.params.id);
      if (!table) {
        res.status(404).json({ success: false, message: 'Table not found' });
        return;
      }
      res.status(200).json({ success: true, data: table });
    } catch (error) {
      next(error);
    }
  };

  updateTable = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const table = await this.tableService.updateTable(req.params.id, req.body);
      if (!table) {
        res.status(404).json({ success: false, message: 'Table not found' });
        return;
      }
      res.status(200).json({ success: true, data: table });
    } catch (error) {
      next(error);
    }
  };

  updateTableStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { status } = req.body;
      const table = await this.tableService.updateTableStatus(req.params.id, status);
      if (!table) {
        res.status(404).json({ success: false, message: 'Table not found' });
        return;
      }
      res.status(200).json({ success: true, data: table });
    } catch (error) {
      next(error);
    }
  };

  deleteTable = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.tableService.deleteTable(req.params.id);
      if (!result) {
        res.status(404).json({ success: false, message: 'Table not found' });
        return;
      }
      res.status(200).json({ success: true, message: 'Table deleted successfully' });
    } catch (error) {
      next(error);
    }
  };
}
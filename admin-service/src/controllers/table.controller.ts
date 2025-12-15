import { Request, Response, NextFunction } from 'express';
import { TableService } from '../services/table.service';
import { broadcastEvent } from '../services/websocket.service';

export class TableController {
  private tableService: TableService;

  constructor() {
    this.tableService = new TableService();
  }

  createTable = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const table = await this.tableService.createTable(req.body);
      
      // Emitir evento de mesa creada
      broadcastEvent({
        type: 'table.created',
        data: table
      });
      
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
      
      // Emitir evento de mesa actualizada
      broadcastEvent({
        type: 'table.updated',
        data: table
      });
      
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
      
      // Emitir evento de cambio de estado de mesa
      broadcastEvent({
        type: 'table.statusChanged',
        data: table
      });
      
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
      
      // Emitir evento de mesa eliminada
      broadcastEvent({
        type: 'table.deleted',
        data: { id: req.params.id }
      });
      
      res.status(200).json({ success: true, message: 'Table deleted successfully' });
    } catch (error) {
      next(error);
    }
  };
}
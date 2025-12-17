import { TableRepository } from '../repositories/table.repository';
import { ITable } from '../models/table.model';
import { broadcastEvent } from './websocket.service';

export class TableService {
  private tableRepository: TableRepository;
  private cleaningTimers: Map<string, NodeJS.Timeout> = new Map();

  constructor() {
    this.tableRepository = new TableRepository();
  }

  async createTable(tableData: Partial<ITable>): Promise<ITable> {
    // Verificar que no exista una mesa con el mismo número
    const existing = await this.tableRepository.findByNumber(tableData.number!);
    if (existing) {
      throw new Error('Table number already exists');
    }

    return await this.tableRepository.create(tableData);
  }

  async getAllTables(): Promise<ITable[]> {
    return await this.tableRepository.findAll();
  }

  async getTableById(id: string): Promise<ITable | null> {
    return await this.tableRepository.findById(id);
  }

  async updateTable(id: string, tableData: Partial<ITable>): Promise<ITable | null> {
    return await this.tableRepository.update(id, tableData);
  }

  async updateTableStatus(id: string, status: string): Promise<ITable | null> {
    const validStatuses = ['available', 'occupied', 'reserved', 'cleaning'];
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status');
    }

    // Si hay un timer previo para esta mesa, cancelarlo
    if (this.cleaningTimers.has(id)) {
      clearTimeout(this.cleaningTimers.get(id)!);
      this.cleaningTimers.delete(id);
    }

    // Actualizar el estado
    const table = await this.tableRepository.updateStatus(id, status);

    // Si el estado es 'cleaning', programar cambio automático a 'available' después de 30 segundos
    if (status === 'cleaning' && table) {
      console.log(`🧹 Mesa ${table.number} en limpieza. Cambiará a disponible en 30 segundos...`);
      
      const timer = setTimeout(async () => {
        try {
          const updatedTable = await this.tableRepository.updateStatus(id, 'available');
          if (updatedTable) {
            console.log(`✅ Mesa ${updatedTable.number} ahora está disponible después de limpieza`);
            
            // Emitir evento de cambio de estado automático
            broadcastEvent({
              type: 'table.statusChanged',
              data: updatedTable
            });
          }
          this.cleaningTimers.delete(id);
        } catch (error) {
          console.error(`❌ Error al cambiar estado automático de mesa ${id}:`, error);
        }
      }, 30000); // 30 segundos

      this.cleaningTimers.set(id, timer);
    }

    return table;
  }

  async deleteTable(id: string): Promise<boolean> {
    // Cancelar timer si existe
    if (this.cleaningTimers.has(id)) {
      clearTimeout(this.cleaningTimers.get(id)!);
      this.cleaningTimers.delete(id);
    }
    
    return await this.tableRepository.delete(id);
  }
}
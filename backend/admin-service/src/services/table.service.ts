import { TableRepository } from '../repositories/table.repository';
import { ITable } from '../models/table.model';

export class TableService {
  private tableRepository: TableRepository;

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

    return await this.tableRepository.updateStatus(id, status);
  }

  async deleteTable(id: string): Promise<boolean> {
    return await this.tableRepository.delete(id);
  }
}
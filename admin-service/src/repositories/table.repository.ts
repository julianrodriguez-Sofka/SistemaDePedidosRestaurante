import { TableModel, ITable } from '../models/table.model';

export class TableRepository {
  async create(tableData: Partial<ITable>): Promise<ITable> {
    const table = new TableModel(tableData);
    return await table.save();
  }

  async findAll(): Promise<ITable[]> {
    return await TableModel.find().sort({ number: 1 });
  }

  async findById(id: string): Promise<ITable | null> {
    return await TableModel.findById(id);
  }

  async findByNumber(number: number): Promise<ITable | null> {
    return await TableModel.findOne({ number });
  }

  async update(id: string, tableData: Partial<ITable>): Promise<ITable | null> {
    return await TableModel.findByIdAndUpdate(id, tableData, { new: true });
  }

  async updateStatus(id: string, status: string): Promise<ITable | null> {
    return await TableModel.findByIdAndUpdate(id, { status }, { new: true });
  }

  async delete(id: string): Promise<boolean> {
    const result = await TableModel.findByIdAndDelete(id);
    return !!result;
  }
}
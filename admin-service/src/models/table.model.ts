import mongoose, { Schema, Document } from 'mongoose';

export interface ITable extends Document {
  number: number;
  status: 'available' | 'occupied' | 'reserved' | 'cleaning';
  capacity: number;
  location: string;
  currentOrder?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TableSchema: Schema = new Schema(
  {
    number: { type: Number, required: true, unique: true },
    status: { 
      type: String, 
      required: true, 
      enum: ['available', 'occupied', 'reserved', 'cleaning'],
      default: 'available'
    },
    capacity: { type: Number, required: true, min: 1, default: 4 },
    location: { type: String, required: true },
    currentOrder: { type: String }
  },
  { timestamps: true }
);

export const TableModel = mongoose.model<ITable>('Table', TableSchema);
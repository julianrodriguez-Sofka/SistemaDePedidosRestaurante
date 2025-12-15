import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  id: number;
  name: string;
  description: string;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema: Schema = new Schema(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: '' },
    enabled: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const CategoryModel = mongoose.model<ICategory>('Category', CategorySchema);

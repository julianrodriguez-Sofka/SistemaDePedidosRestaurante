import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  id: number;
  name: string;
  price: number;
  desc: string;
  image: string;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true, unique: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    desc: { type: String, default: '' },
    image: { type: String, required: true },
    enabled: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const ProductModel = mongoose.model<IProduct>('Product', ProductSchema);
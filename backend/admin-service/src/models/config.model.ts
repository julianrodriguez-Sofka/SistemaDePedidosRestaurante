import mongoose, { Schema, Document } from 'mongoose';

export interface IConfig extends Document {
  name: string;
  address: string;
  phone: string;
  schedule: string;
  email: string;
  updatedAt: Date;
}

const ConfigSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    schedule: { type: String, required: true },
    email: { type: String, required: true }
  },
  { timestamps: true }
);

export const ConfigModel = mongoose.model<IConfig>('Config', ConfigSchema);
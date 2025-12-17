import mongoose, { Schema, Document } from 'mongoose';

export interface IConfig extends Document {
  restaurantName: string;
  address: string;
  phone: string;
  email: string;
  schedule: {
    monday: { open: string; close: string; closed: boolean };
    tuesday: { open: string; close: string; closed: boolean };
    wednesday: { open: string; close: string; closed: boolean };
    thursday: { open: string; close: string; closed: boolean };
    friday: { open: string; close: string; closed: boolean };
    saturday: { open: string; close: string; closed: boolean };
    sunday: { open: string; close: string; closed: boolean };
  };
  preparationTimes: {
    default: number;
    express: number;
    complex: number;
  };
  updatedAt: Date;
}

const DayScheduleSchema = new Schema({
  open: { type: String, default: '09:00' },
  close: { type: String, default: '22:00' },
  closed: { type: Boolean, default: false }
}, { _id: false });

const ConfigSchema: Schema = new Schema(
  {
    restaurantName: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    schedule: {
      monday: { type: DayScheduleSchema, default: () => ({}) },
      tuesday: { type: DayScheduleSchema, default: () => ({}) },
      wednesday: { type: DayScheduleSchema, default: () => ({}) },
      thursday: { type: DayScheduleSchema, default: () => ({}) },
      friday: { type: DayScheduleSchema, default: () => ({}) },
      saturday: { type: DayScheduleSchema, default: () => ({}) },
      sunday: { type: DayScheduleSchema, default: () => ({}) }
    },
    preparationTimes: {
      default: { type: Number, default: 15 },
      express: { type: Number, default: 10 },
      complex: { type: Number, default: 30 }
    }
  },
  { timestamps: true }
);

export const ConfigModel = mongoose.model<IConfig>('Config', ConfigSchema);
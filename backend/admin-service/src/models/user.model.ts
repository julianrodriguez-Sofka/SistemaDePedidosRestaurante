import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  password: string;
  email: string;
  roles: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    roles: { type: [String], default: ['waiter'], enum: ['admin', 'waiter', 'chef'] },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const UserModel = mongoose.model<IUser>('User', UserSchema);
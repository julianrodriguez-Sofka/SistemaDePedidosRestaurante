import { UserModel, IUser } from '../models/user.model';

export class UserRepository {
  async create(userData: Partial<IUser>): Promise<IUser> {
    const user = new UserModel(userData);
    return await user.save();
  }

  async findAll(): Promise<IUser[]> {
    return await UserModel.find({ isActive: true }).select('-password');
  }

  async findById(id: string): Promise<IUser | null> {
    return await UserModel.findById(id).select('-password');
  }

  async findByUsername(username: string): Promise<IUser | null> {
    return await UserModel.findOne({ username });
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await UserModel.findOne({ email });
  }

  async update(id: string, userData: Partial<IUser>): Promise<IUser | null> {
    return await UserModel.findByIdAndUpdate(id, userData, { new: true }).select('-password');
  }

  async delete(id: string): Promise<boolean> {
    const result = await UserModel.findByIdAndUpdate(id, { isActive: false });
    return !!result;
  }
}
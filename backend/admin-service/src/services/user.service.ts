import bcrypt from 'bcryptjs';
import { UserRepository } from '../repositories/user.repository';
import { IUser } from '../models/user.model';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async createUser(userData: Partial<IUser>): Promise<IUser> {
    // Verificar si el usuario ya existe
    const existingUsername = await this.userRepository.findByUsername(userData.username!);
    if (existingUsername) {
      throw new Error('Username already exists');
    }

    const existingEmail = await this.userRepository.findByEmail(userData.email!);
    if (existingEmail) {
      throw new Error('Email already exists');
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(userData.password!, 10);
    userData.password = hashedPassword;

    return await this.userRepository.create(userData);
  }

  async getAllUsers(): Promise<IUser[]> {
    return await this.userRepository.findAll();
  }

  async getUserById(id: string): Promise<IUser | null> {
    return await this.userRepository.findById(id);
  }

  async updateUser(id: string, userData: Partial<IUser>): Promise<IUser | null> {
    // Si se actualiza la contraseña, hashearla
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }
    return await this.userRepository.update(id, userData);
  }

  async deleteUser(id: string): Promise<boolean> {
    return await this.userRepository.delete(id);
  }

  async assignRole(userId: string, roles: string[]): Promise<IUser | null> {
    return await this.userRepository.update(userId, { roles });
  }
}
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { UserRepository } from '../repositories/user.repository';

export class AuthController {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { username, password } = req.body;

      // Validar que username y password estén presentes
      if (!username || !password) {
        res.status(400).json({ success: false, message: 'Username and password are required' });
        return;
      }

      // Buscar usuario
      const user = await this.userRepository.findByUsername(username);
      if (!user) {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
        return;
      }

      // Verificar que el usuario esté activo
      if (!user.isActive) {
        res.status(403).json({ success: false, message: 'Account is inactive' });
        return;
      }

      // Verificar contraseña
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
        return;
      }

      // Generar token JWT (válido para TODOS los roles)
      const token = jwt.sign(
        { userId: user._id, username: user.username, roles: user.roles },
        process.env.JWT_SECRET!,
        { expiresIn: '8h' }
      );

      res.status(200).json({
        success: true,
        data: {
          token,
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            roles: user.roles
          }
        }
      });
    } catch (error) {
      next(error);
    }
  };
}
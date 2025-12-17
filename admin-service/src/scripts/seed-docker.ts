import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { UserModel } from '../models/user.model';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seed...');

    // Conectar a MongoDB usando la URI del entorno
    const mongoUri = process.env.MONGO_URI || 'mongodb://mongo:27017/restaurant_admin';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Verificar si ya existen usuarios
    const existingUsers = await UserModel.countDocuments();

    if (existingUsers > 0) {
      console.log(`⚠️  Database already has ${existingUsers} users!`);
      console.log('Skipping seed to avoid duplicates.');
      return;
    }

    // Crear usuario administrador por defecto
    const hashedPasswordAdmin = await bcrypt.hash('admin123', 10);

    const adminUser = new UserModel({
      username: 'admin',
      email: 'admin@restaurant.com',
      password: hashedPasswordAdmin,
      roles: ['admin', 'waiter', 'chef'],
      isActive: true,
    });

    await adminUser.save();

    // Crear usuario chef
    const hashedPasswordChef = await bcrypt.hash('chef123', 10);

    const chefUser = new UserModel({
      username: 'chef1',
      email: 'chef@restaurant.com',
      password: hashedPasswordChef,
      roles: ['chef'],
      isActive: true,
    });

    await chefUser.save();

    // Crear usuario waiter
    const hashedPasswordWaiter = await bcrypt.hash('waiter123', 10);

    const waiterUser = new UserModel({
      username: 'waiter1',
      email: 'waiter@restaurant.com',
      password: hashedPasswordWaiter,
      roles: ['waiter'],
      isActive: true,
    });

    await waiterUser.save();

    console.log('\n✅ ¡Base de datos inicializada exitosamente!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 CREDENCIALES DE ACCESO:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n👤 ADMINISTRADOR:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('   Email:    admin@restaurant.com');
    console.log('   Roles:    admin, waiter, chef');
    console.log('\n👨‍🍳 CHEF:');
    console.log('   Username: chef1');
    console.log('   Password: chef123');
    console.log('   Email:    chef@restaurant.com');
    console.log('   Roles:    chef');
    console.log('\n🧑‍💼 MESERO:');
    console.log('   Username: waiter1');
    console.log('   Password: waiter123');
    console.log('   Email:    waiter@restaurant.com');
    console.log('   Roles:    waiter');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('⚠️  IMPORTANTE: Cambia estas contraseñas en producción!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
};

// Ejecutar el seed
seedDatabase();

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { UserModel } from '../models/user.model';
import { CategoryModel } from '../models/category.model';
import { connectDatabase } from '../config/database';
import dotenv from 'dotenv';
import path from 'path';

// Cargar variables de entorno desde .env.local (para desarrollo local)
const envPath = path.resolve(__dirname, '../../.env.local');
dotenv.config({ path: envPath });

const seedAdminUser = async () => {
  try {
    console.log('🌱 Starting database seed...');

    // Conectar a la base de datos
    await connectDatabase();

    // Verificar si ya existe un usuario admin
    const existingAdmin = await UserModel.findOne({ username: 'admin' });

    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      console.log('Username: admin');
      console.log('Email:', existingAdmin.email);
      return;
    }

    // Crear usuario administrador por defecto
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const adminUser = new UserModel({
      username: 'admin',
      email: 'admin@restaurant.com',
      password: hashedPassword,
      roles: ['admin', 'waiter', 'chef'],
      isActive: true,
    });

    await adminUser.save();

    console.log('✅ Admin user created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 DEFAULT CREDENTIALS:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('Email:    admin@restaurant.com');
    console.log('Roles:    admin, waiter, chef');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('⚠️  IMPORTANT: Change this password in production!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // Crear usuarios de ejemplo adicionales
    const chefPassword = await bcrypt.hash('chef123', 10);
    const waiterPassword = await bcrypt.hash('waiter123', 10);

    const chefUser = new UserModel({
      username: 'chef1',
      email: 'chef@restaurant.com',
      password: chefPassword,
      roles: ['chef'],
      isActive: true,
    });

    const waiterUser = new UserModel({
      username: 'waiter1',
      email: 'waiter@restaurant.com',
      password: waiterPassword,
      roles: ['waiter'],
      isActive: true,
    });

    await chefUser.save();
    await waiterUser.save();

    console.log('\n✅ Additional test users created:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('CHEF USER:');
    console.log('Username: chef1');
    console.log('Password: chef123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('WAITER USER:');
    console.log('Username: waiter1');
    console.log('Password: waiter123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // Crear categorías por defecto para HU-004
    console.log('\n📁 Creating default categories...');
    const defaultCategories = [
      { id: 1, name: 'Platos Fuertes', description: 'Platos principales del menú', enabled: true },
      { id: 2, name: 'Bebidas', description: 'Bebidas frías y calientes', enabled: true },
      { id: 3, name: 'Entradas', description: 'Aperitivos y entradas', enabled: true },
      { id: 4, name: 'Postres', description: 'Postres y dulces', enabled: true },
      { id: 5, name: 'General', description: 'Categoría general', enabled: true },
    ];

    for (const categoryData of defaultCategories) {
      const existingCategory = await CategoryModel.findOne({ name: categoryData.name });
      if (!existingCategory) {
        await CategoryModel.create(categoryData);
        console.log(`✅ Category created: ${categoryData.name}`);
      } else {
        console.log(`⚠️  Category already exists: ${categoryData.name}`);
      }
    }

    console.log('\n✅ Categories setup complete!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
    process.exit(0);
  }
};

// Ejecutar el seed
seedAdminUser();

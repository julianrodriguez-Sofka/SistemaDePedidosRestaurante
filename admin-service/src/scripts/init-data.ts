import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const initializeData = async () => {
  try {
    console.log('🚀 Inicializando datos del restaurante...\n');

    // Conectar a MongoDB
    const mongoUri = process.env.MONGO_URI || 'mongodb://mongo:27017/restaurant_admin';
    await mongoose.connect(mongoUri);
    console.log('✅ Conectado a MongoDB\n');

    // Crear esquemas básicos
    const ProductSchema = new mongoose.Schema({
      id: { type: Number, required: true, unique: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      desc: { type: String, required: true },
      image: { type: String, required: true },
      enabled: { type: Boolean, default: true },
      preparationTime: { type: Number, default: 10 }
    }, { timestamps: true });

    const TableSchema = new mongoose.Schema({
      number: { type: Number, required: true, unique: true },
      status: { 
        type: String, 
        enum: ['available', 'occupied', 'reserved', 'cleaning'],
        default: 'available'
      },
      capacity: { type: Number, required: true, default: 4 }
    }, { timestamps: true });

    const ConfigSchema = new mongoose.Schema({
      restaurantName: { type: String, required: true },
      address: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, required: true },
      schedule: {
        monday: { open: String, close: String, closed: Boolean },
        tuesday: { open: String, close: String, closed: Boolean },
        wednesday: { open: String, close: String, closed: Boolean },
        thursday: { open: String, close: String, closed: Boolean },
        friday: { open: String, close: String, closed: Boolean },
        saturday: { open: String, close: String, closed: Boolean },
        sunday: { open: String, close: String, closed: Boolean }
      },
      preparationTimes: {
        default: Number,
        express: Number,
        complex: Number
      }
    }, { timestamps: true });

    const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
    const Table = mongoose.models.Table || mongoose.model('Table', TableSchema);
    const Config = mongoose.models.Config || mongoose.model('Config', ConfigSchema);

    // Verificar si ya existen productos
    const existingProducts = await Product.countDocuments();
    
    if (existingProducts === 0) {
      console.log('📦 Creando productos de ejemplo...');
      
      const products = [
        {
          id: 1,
          name: 'Hamburguesa Clásica',
          price: 25000,
          desc: 'Deliciosa hamburguesa con carne 100% res, lechuga, tomate y queso',
          image: '/images/hamburguesa.jpg',
          enabled: true,
          preparationTime: 15
        },
        {
          id: 2,
          name: 'Pizza Margarita',
          price: 30000,
          desc: 'Pizza artesanal con salsa de tomate, mozzarella y albahaca fresca',
          image: '/images/pizza.jpg',
          enabled: true,
          preparationTime: 20
        },
        {
          id: 3,
          name: 'Ensalada César',
          price: 18000,
          desc: 'Lechuga romana, crutones, parmesano y aderezo césar',
          image: '/images/ensalada.jpg',
          enabled: true,
          preparationTime: 8
        },
        {
          id: 4,
          name: 'Pasta Carbonara',
          price: 28000,
          desc: 'Pasta fresca con salsa cremosa, tocino y parmesano',
          image: '/images/pasta.jpg',
          enabled: true,
          preparationTime: 18
        },
        {
          id: 5,
          name: 'Limonada Natural',
          price: 8000,
          desc: 'Refrescante limonada natural con hierbabuena',
          image: '/images/limonada.jpg',
          enabled: true,
          preparationTime: 3
        },
        {
          id: 6,
          name: 'Café Americano',
          price: 6000,
          desc: 'Café recién preparado con granos colombianos',
          image: '/images/cafe.jpg',
          enabled: true,
          preparationTime: 5
        }
      ];

      await Product.insertMany(products);
      console.log(`✅ ${products.length} productos creados\n`);
    } else {
      console.log(`⚠️  Ya existen ${existingProducts} productos en la base de datos\n`);
    }

    // Verificar si ya existen mesas
    const existingTables = await Table.countDocuments();
    
    if (existingTables === 0) {
      console.log('🪑 Creando mesas...');
      
      const tables = [];
      for (let i = 1; i <= 10; i++) {
        tables.push({
          number: i,
          status: 'available',
          capacity: i <= 4 ? 2 : i <= 8 ? 4 : 6
        });
      }

      await Table.insertMany(tables);
      console.log(`✅ ${tables.length} mesas creadas\n`);
    } else {
      console.log(`⚠️  Ya existen ${existingTables} mesas en la base de datos\n`);
    }

    // Verificar si ya existe configuración
    const existingConfig = await Config.countDocuments();
    
    if (existingConfig === 0) {
      console.log('⚙️  Creando configuración del restaurante...');
      
      const defaultSchedule = {
        open: '11:00',
        close: '22:00',
        closed: false
      };
      
      const config = new Config({
        restaurantName: 'Restaurante El Buen Sabor',
        address: 'Calle Principal #123, Ciudad',
        phone: '+57 300 123 4567',
        email: 'contacto@elbuensabor.com',
        schedule: {
          monday: defaultSchedule,
          tuesday: defaultSchedule,
          wednesday: defaultSchedule,
          thursday: defaultSchedule,
          friday: defaultSchedule,
          saturday: defaultSchedule,
          sunday: defaultSchedule
        },
        preparationTimes: {
          default: 15,
          express: 10,
          complex: 30
        }
      });

      await config.save();
      console.log('✅ Configuración creada\n');
    } else {
      console.log('⚠️  Ya existe configuración del restaurante\n');
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ ¡Datos iniciales creados exitosamente!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  } catch (error) {
    console.error('❌ Error inicializando datos:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Conexión cerrada');
    process.exit(0);
  }
};

// Ejecutar inicialización
initializeData();

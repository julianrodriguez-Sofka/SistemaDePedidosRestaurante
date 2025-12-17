const mongoose = require('mongoose');

// Conectar a MongoDB
mongoose.connect('mongodb://localhost:27017/restaurant_admin', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Conectado a MongoDB');
  seedTables();
}).catch(err => {
  console.error('Error conectando a MongoDB:', err);
});

const TableSchema = new mongoose.Schema({
  number: { type: Number, required: true, unique: true },
  capacity: { type: Number, required: true },
  location: { type: String, required: true },
  status: {
    type: String,
    enum: ['available', 'occupied', 'reserved', 'cleaning'],
    default: 'available'
  },
  currentOrder: { type: String },
}, { timestamps: true });

const Table = mongoose.model('Table', TableSchema);

async function seedTables() {
  try {
    // Eliminar todas las mesas existentes
    await Table.deleteMany({});
    console.log('Mesas existentes eliminadas');

    // Crear mesas de prueba
    const tables = [
      { number: 1, capacity: 2, location: 'Window Side', status: 'available' },
      { number: 2, capacity: 2, location: 'Main Hall', status: 'available' },
      { number: 3, capacity: 6, location: 'Main Hall', status: 'available' },
      { number: 4, capacity: 4, location: 'Main Hall', status: 'occupied', currentOrder: 'ORD-001' },
      { number: 5, capacity: 4, location: 'Center', status: 'available' },
      { number: 6, capacity: 6, location: 'Terrace', status: 'occupied', currentOrder: 'ORD-002' },
      { number: 7, capacity: 2, location: 'Main Hall', status: 'available' },
      { number: 8, capacity: 2, location: 'Main Hall', status: 'reserved' },
      { number: 9, capacity: 2, location: 'Main Hall', status: 'available' },
      { number: 10, capacity: 2, location: 'Main Hall', status: 'cleaning' },
      { number: 11, capacity: 4, location: 'VIP Area', status: 'reserved' },
      { number: 12, capacity: 8, location: 'VIP Area', status: 'available' },
    ];

    await Table.insertMany(tables);
    console.log('✅ Mesas creadas exitosamente:');
    console.log(`  - ${tables.length} mesas creadas`);
    console.log(`  - ${tables.filter(t => t.status === 'available').length} disponibles`);
    console.log(`  - ${tables.filter(t => t.status === 'occupied').length} ocupadas`);
    console.log(`  - ${tables.filter(t => t.status === 'reserved').length} reservadas`);
    console.log(`  - ${tables.filter(t => t.status === 'cleaning').length} en limpieza`);
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error creando mesas:', error);
    mongoose.connection.close();
  }
}

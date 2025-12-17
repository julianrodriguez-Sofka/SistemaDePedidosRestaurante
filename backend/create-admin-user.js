const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Conectar a MongoDB
mongoose.connect('mongodb://localhost:27017/restaurant_admin', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Definir el esquema de usuario
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  roles: [{ type: String }],
  isActive: { type: Boolean, default: true }
});

const User = mongoose.model('User', userSchema);

async function createAdminUser() {
  try {
    // Verificar si ya existe
    const existingAdmin = await User.findOne({ username: 'admin' });
    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      process.exit(0);
    }

    // Crear usuario admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = new User({
      username: 'admin',
      password: hashedPassword,
      name: 'Administrator',
      email: 'admin@restaurant.com',
      roles: ['admin'],
      isActive: true
    });

    await admin.save();
    console.log('✅ Admin user created successfully!');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('   Email: admin@restaurant.com');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    process.exit(1);
  }
}

createAdminUser();

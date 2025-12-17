db = db.getSiblingDB('restaurant_admin');

// Crear usuario admin con password hasheado (bcrypt de 'admin123')
const adminUser = {
  username: 'admin',
  password: '$2a$10$YourHashedPasswordHere', // Temporal, luego lo actualizamos
  name: 'Administrator',
  email: 'admin@restaurant.com',
  roles: ['admin'],
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
};

// Verificar si ya existe
const existing = db.users.findOne({ username: 'admin' });

if (existing) {
  print('✅ Admin user already exists');
  print(`Email: ${existing.email}`);
  print(`Roles: ${existing.roles.join(', ')}`);
} else {
  db.users.insertOne(adminUser);
  print('✅ Admin user created!');
  print('Username: admin');
  print('Email: admin@restaurant.com');
  print('Roles: admin');
  print('\n⚠️ IMPORTANTE: Debes cambiar la contraseña usando el admin-service API');
}

print('\n=== All Users ===');
db.users.find({}, { password: 0 }).forEach(user => {
  print(`\nUsername: ${user.username}`);
  print(`Email: ${user.email}`);
  print(`Roles: ${user.roles ? user.roles.join(', ') : 'none'}`);
});

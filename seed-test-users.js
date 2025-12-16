// Script para crear usuarios de prueba
// Ejecutar: node seed-test-users.js

const axios = require('axios');

const ADMIN_API_URL = 'http://localhost:4001/api';

// Credenciales del administrador principal
const adminCredentials = {
  username: 'admin',
  password: 'admin123'
};

// Usuarios de prueba a crear
const testUsers = [
  {
    username: 'chef1',
    password: 'chef123',
    name: 'Carlos Chef',
    email: 'chef1@restaurant.com',
    roles: ['chef']
  },
  {
    username: 'chef2',
    password: 'chef123',
    name: 'María Chef',
    email: 'chef2@restaurant.com',
    roles: ['chef']
  },
  {
    username: 'waiter1',
    password: 'waiter123',
    name: 'Juan Mesero',
    email: 'waiter1@restaurant.com',
    roles: ['waiter']
  },
  {
    username: 'waiter2',
    password: 'waiter123',
    name: 'Ana Mesera',
    email: 'waiter2@restaurant.com',
    roles: ['waiter']
  },
  {
    username: 'multirole',
    password: 'multi123',
    name: 'Pedro MultiRol',
    email: 'multi@restaurant.com',
    roles: ['chef', 'waiter']
  }
];

async function seedTestUsers() {
  try {
    console.log('🔐 Iniciando sesión como administrador...');
    
    // Login como admin
    const loginResponse = await axios.post(`${ADMIN_API_URL}/auth/login`, adminCredentials);
    const token = loginResponse.data.data.token;
    
    console.log('✅ Sesión iniciada correctamente\n');

    // Crear usuarios de prueba
    for (const user of testUsers) {
      try {
        console.log(`📝 Creando usuario: ${user.username} (${user.roles.join(', ')})`);
        
        await axios.post(
          `${ADMIN_API_URL}/users`,
          user,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        console.log(`✅ Usuario ${user.username} creado exitosamente`);
      } catch (error) {
        if (error.response?.status === 400 && error.response?.data?.message?.includes('already exists')) {
          console.log(`⚠️  Usuario ${user.username} ya existe, omitiendo...`);
        } else {
          console.error(`❌ Error creando ${user.username}:`, error.response?.data?.message || error.message);
        }
      }
    }

    console.log('\n🎉 Proceso completado!');
    console.log('\n📋 Credenciales de prueba:');
    console.log('═'.repeat(50));
    testUsers.forEach(user => {
      console.log(`👤 ${user.name}`);
      console.log(`   Usuario: ${user.username}`);
      console.log(`   Contraseña: ${user.password}`);
      console.log(`   Roles: ${user.roles.join(', ')}`);
      console.log('─'.repeat(50));
    });

  } catch (error) {
    console.error('❌ Error:', error.response?.data?.message || error.message);
    console.log('\n💡 Asegúrate de que:');
    console.log('   1. El admin-service esté corriendo en puerto 4001');
    console.log('   2. Existe un usuario admin con las credenciales especificadas');
    console.log('   3. MongoDB esté accesible');
  }
}

seedTestUsers();

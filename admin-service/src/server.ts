import { createApp } from './app';
import { connectDatabase } from './config/database';

const PORT = process.env.PORT || 4000;

async function startServer(): Promise<void> {
  try {
    // Conectar a la base de datos
    await connectDatabase();

    // Crear la aplicación
    const app = createApp();

    // Iniciar el servidor
    app.listen(PORT, () => {
      console.log(`🚀 Admin Service running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();// ...existing code...

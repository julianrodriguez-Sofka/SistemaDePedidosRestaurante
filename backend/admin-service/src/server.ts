import { createApp } from './app';
import { connectDatabase } from './config/database';
import { createServer } from 'http';
import { initializeWebSocket } from './services/websocket.service';

const PORT = process.env.PORT || 4000;

async function startServer(): Promise<void> {
  try {
    // Conectar a la base de datos
    await connectDatabase();

    // Crear la aplicación
    const app = createApp();

    // Crear servidor HTTP
    const server = createServer(app);

    // Inicializar WebSocket
    initializeWebSocket(server);

    // Iniciar el servidor
    server.listen(PORT, () => {
      console.log(`🚀 Admin Service running on port ${PORT}`);
      console.log(`🔌 WebSocket available at ws://localhost:${PORT}/ws`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

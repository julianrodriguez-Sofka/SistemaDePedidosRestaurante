import axios from 'axios';

const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || 'http://python-ms:8000';

export async function triggerTableCleaning(tableNumber: string): Promise<void> {
  try {
    console.log(`🧹 Activando limpieza de mesa ${tableNumber}...`);
    
    // Llamar al servicio Python para iniciar el timer de limpieza
    await axios.post(`${PYTHON_SERVICE_URL}/api/tables/${tableNumber}/cleaning`, {}, {
      timeout: 5000
    });
    
    console.log(`✅ Timer de limpieza activado para mesa ${tableNumber}`);
  } catch (error) {
    console.error(`❌ Error al activar limpieza de mesa ${tableNumber}:`, error);
    // No lanzamos el error para que no afecte el flujo principal
  }
}

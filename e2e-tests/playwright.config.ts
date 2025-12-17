import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false, // Tests secuenciales para evitar conflictos
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1, // Un worker para tests secuenciales
  reporter: [
    ['html', { outputFolder: '../test-results/html-report' }],
    ['json', { outputFile: '../test-results/results.json' }],
    ['junit', { outputFile: '../test-results/junit.xml' }],
    ['list']
  ],
  use: {
    baseURL: 'http://localhost:5173', // Frontend mesero en puerto 5173
    trace: 'on', // Siempre capturar trace para evidencia
    screenshot: 'on', // Screenshots en cada acción
    video: 'on', // Video completo de cada test
    actionTimeout: 10000,
  },

  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 }
      },
    }
  ],

  // Los servicios deben estar corriendo con docker-compose up -d
});

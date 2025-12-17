import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

/**
 * SMOKE TESTS - Validación rápida de servicios
 */

function saveTestLog(testName: string, data: any) {
  const logsDir = path.join(__dirname, '../../test-results/logs');
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }
  const logFile = path.join(logsDir, `${testName}_${Date.now()}.json`);
  fs.writeFileSync(logFile, JSON.stringify(data, null, 2));
  console.log(`📝 Log guardado: ${logFile}`);
}

test.describe('🔍 Smoke Tests - Verificación de Servicios', () => {
  
  test('SMOKE-01: Frontend Mesero está disponible', async ({ page }) => {
    const testName = 'SMOKE-01';
    const startTime = Date.now();
    
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('domcontentloaded');
    
    const loadTime = Date.now() - startTime;
    await page.screenshot({ path: `../test-results/${testName}_frontend_mesero.png`, fullPage: true });
    
    expect(page.url()).toContain('localhost:5173');
    
    saveTestLog(testName, {
      resultado: 'PASSED',
      descripcion: 'Frontend Mesero disponible',
      url: page.url(),
      tiempo_carga_ms: loadTime,
      timestamp: new Date().toISOString()
    });
  });

  test('SMOKE-02: Admin Frontend está disponible', async ({ page }) => {
    const testName = 'SMOKE-02';
    const startTime = Date.now();
    
    await page.goto('http://localhost:5174');
    await page.waitForLoadState('domcontentloaded');
    
    const loadTime = Date.now() - startTime;
    await page.screenshot({ path: `../test-results/${testName}_admin_frontend.png`, fullPage: true });
    
    expect(page.url()).toContain('localhost:5174');
    
    saveTestLog(testName, {
      resultado: 'PASSED',
      descripcion: 'Admin Frontend disponible',
      url: page.url(),
      tiempo_carga_ms: loadTime,
      timestamp: new Date().toISOString()
    });
  });

  test('SMOKE-03: API Gateway está respondiendo', async ({ request }) => {
    const testName = 'SMOKE-03';
    const startTime = Date.now();
    
    const response = await request.get('http://localhost:3000/health').catch(() => null);
    const responseTime = Date.now() - startTime;
    
    const status = response ? response.status() : 0;
    const isHealthy = status >= 200 && status < 300;
    
    saveTestLog(testName, {
      resultado: isHealthy || status === 404 ? 'PASSED' : 'FAILED',
      descripcion: 'API Gateway health check (acepta 2xx o 404 si /health no existe)',
      status: status,
      tiempo_respuesta_ms: responseTime,
      timestamp: new Date().toISOString()
    });
    
    // Gateway responde aunque no tenga endpoint /health específico
    expect(isHealthy || status === 404).toBeTruthy();
  });

  test('SMOKE-04: Admin Service está respondiendo', async ({ request }) => {
    const testName = 'SMOKE-04';
    const startTime = Date.now();
    
    const response = await request.get('http://localhost:4001/health').catch(() => null);
    const responseTime = Date.now() - startTime;
    
    const status = response ? response.status() : 0;
    const isHealthy = status >= 200 && status < 300;
    
    saveTestLog(testName, {
      resultado: isHealthy ? 'PASSED' : 'FAILED',
      descripcion: 'Admin Service health check',
      status: status,
      tiempo_respuesta_ms: responseTime,
      timestamp: new Date().toISOString()
    });
    
    expect(isHealthy).toBeTruthy();
  });
});

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import dotenv from 'dotenv';
import { createServer } from 'node:http';
import { getRequestListener } from '@hono/node-server';
import bookingRouter from './routes/booking.js';
import patientsRouter from './routes/patients.js';
import professionalsRouter from './routes/professionals.js';
import appointmentsRouter from './routes/appointments.js';
import medicalRecordsRouter from './routes/medical-records.js';
import financialRouter from './routes/financial.js';
import categoriesRouter from './routes/categories.js';
import accountsRouter from './routes/accounts.js';
import ehrRouter from './routes/ehr.js';
import filesRouter from './routes/files.js';
import documentsRouter from './routes/documents.js';
import authRouter from './routes/auth-routes.js';
import usersRouter from './routes/users.js';

dotenv.config();

const app = new Hono();

// CORS middleware
// CORS middleware
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://gestordeclinica-production.up.railway.app', // Frontend em produção
  ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [])
];

app.use('/*', cors({
  origin: (origin, c) => {
    const method = c.req.method;
    console.log(`[CORS DEBUG] Method: ${method}, Origin: ${origin}`);
    // Permissive: allow any origin by returning it
    return origin || 'http://localhost:3000';
  },
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
}));

// Health check
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Gestor de Clínica API'
  });
});

// Auth routes (public - no middleware)
app.route('/api/auth', authRouter);
app.route('/api/booking', bookingRouter); // Public route

// API routes
app.route('/api/patients', patientsRouter);
app.route('/api/professionals', professionalsRouter);
app.route('/api/appointments', appointmentsRouter);
app.route('/api/medical-records', medicalRecordsRouter);
app.route('/api/financial', financialRouter);
app.route('/api/categories', categoriesRouter);
app.route('/api/accounts', accountsRouter);
app.route('/api/users', usersRouter);

// EHR Module Routes
app.route('/api', ehrRouter);
app.route('/api/files', filesRouter);
app.route('/api/documents', documentsRouter);

// Serve static files in production
import { serveStatic } from '@hono/node-server/serve-static';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

// API routes must be defined before static files
// ... (API routes are already defined above)

// Serve frontend static files
app.use('/*', serveStatic({
  root: resolve('../frontend/dist')
}));

// SPA fallback - verify if file exists first to avoid loops
app.get('*', async (c) => {
  // If it's an API request that wasn't handled, return 404 (handled by api routes or next notFound)
  if (c.req.path.startsWith('/api')) {
    return c.json({ error: 'Not Found' }, 404);
  }

  try {
    const indexHtml = await readFile(resolve('../frontend/dist/index.html'));
    return c.html(indexHtml.toString());
  } catch (e) {
    return c.text('Frontend not built or found. Run `npm run build` in frontend directory.', 404);
  }
});

// 404 handler for API
app.notFound((c) => {
  return c.json({ error: 'Not Found' }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error('❌ Error:', err);
  return c.json({
    error: 'Internal Server Error',
    message: err.message
  }, 500);
});

const port = parseInt(process.env.PORT || process.env.API_PORT || '3001');

// Create HTTP server directly
const listener = getRequestListener(app.fetch);
const server = createServer(listener);

// Keep the process alive
const keepAlive = setInterval(() => { }, 1000 * 60 * 60);

server.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});

server.on('error', (err: any) => {
  console.error('❌ Server error:', err);
  clearInterval(keepAlive);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Shutting down...');
  clearInterval(keepAlive);
  server.close();
});

process.on('SIGINT', () => {
  console.log('🛑 Shutting down...');
  clearInterval(keepAlive);
  server.close();
});

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import dotenv from 'dotenv';
import { createServer } from 'node:http';
import { getRequestListener } from '@hono/node-server';
import { readFile } from 'node:fs/promises';
import { resolve, extname, join } from 'node:path';
import { existsSync } from 'node:fs';
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

// Serve frontend static files + SPA fallback
const FRONTEND_DIST = resolve('../frontend/dist');
const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html; charset=UTF-8',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.map': 'application/json',
};

app.get('*', async (c) => {
  const reqPath = c.req.path;

  // API routes that weren't matched return 404
  if (reqPath.startsWith('/api')) {
    return c.json({ error: 'Not Found' }, 404);
  }

  // Try to serve a static file first
  const ext = extname(reqPath);
  if (ext) {
    const filePath = join(FRONTEND_DIST, reqPath);
    if (existsSync(filePath)) {
      try {
        const content = await readFile(filePath);
        const mimeType = MIME_TYPES[ext.toLowerCase()] || 'application/octet-stream';
        c.header('Content-Type', mimeType);
        return c.body(content as unknown as string, 200);
      } catch {
        // fall through
      }
    }
    // Static asset not found
    return c.text('Not Found', 404);
  }

  // SPA: serve index.html for all non-asset routes
  const indexPath = join(FRONTEND_DIST, 'index.html');
  if (existsSync(indexPath)) {
    const html = await readFile(indexPath, 'utf8');
    return c.html(html);
  }

  return c.text('Frontend not built. Run npm run build in the frontend directory.', 503);
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

server.listen(port, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${port} (0.0.0.0)`);
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

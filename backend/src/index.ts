import { Hono } from 'hono';
import { cors } from 'hono/cors';
import dotenv from 'dotenv';
import { createServer, IncomingMessage, ServerResponse } from 'node:http';
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
app.use('/*', cors({
  origin: (origin) => {
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
app.route('/api/booking', bookingRouter);

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

// 404 handler for unmatched API routes
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

// Static file serving configuration
const FRONTEND_DIST = resolve('../frontend/dist');
console.log(`📁 Frontend dist path: ${FRONTEND_DIST}`);
console.log(`📁 Frontend dist exists: ${existsSync(FRONTEND_DIST)}`);
console.log(`📁 index.html exists: ${existsSync(join(FRONTEND_DIST, 'index.html'))}`);

const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
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

// Hono listener for API routes
const honoListener = getRequestListener(app.fetch);

// Handle static file request with raw Node.js (reliable Content-Length)
async function serveStatic(req: IncomingMessage, res: ServerResponse): Promise<boolean> {
  const rawPath = req.url?.split('?')[0] || '/';
  const ext = extname(rawPath);

  if (ext) {
    // Request for a file with extension
    const filePath = join(FRONTEND_DIST, rawPath);
    if (existsSync(filePath)) {
      try {
        const content = await readFile(filePath);
        const mimeType = MIME_TYPES[ext.toLowerCase()] || 'application/octet-stream';
        console.log(`[STATIC] ${rawPath} → ${mimeType} (${content.byteLength} bytes)`);
        res.writeHead(200, {
          'Content-Type': mimeType,
          'Content-Length': String(content.byteLength),
          'Cache-Control': 'public, max-age=31536000, immutable',
        });
        res.end(content);
        return true;
      } catch (err) {
        console.error(`[STATIC] Error reading ${filePath}:`, err);
      }
    }
    // Static file not found → 404
    console.log(`[STATIC] Not found: ${rawPath}`);
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
    return true;
  }

  // No extension → SPA route → serve index.html
  if (!rawPath.startsWith('/api') && !rawPath.startsWith('/health')) {
    const indexPath = join(FRONTEND_DIST, 'index.html');
    if (existsSync(indexPath)) {
      const content = await readFile(indexPath);
      console.log(`[SPA] ${rawPath} → index.html (${content.byteLength} bytes)`);
      res.writeHead(200, {
        'Content-Type': 'text/html; charset=UTF-8',
        'Content-Length': String(content.byteLength),
        'Cache-Control': 'no-cache',
      });
      res.end(content);
      return true;
    }
    // Frontend not built
    console.error(`[ERROR] Frontend not found at ${FRONTEND_DIST}`);
    res.writeHead(503, { 'Content-Type': 'text/plain' });
    res.end('Frontend not built. Run npm run build in the frontend directory.');
    return true;
  }

  return false; // Let Hono handle it
}

const port = parseInt(process.env.PORT || process.env.API_PORT || '3001');

// Create HTTP server: static files via Node.js, API via Hono
const server = createServer(async (req, res) => {
  try {
    const handled = await serveStatic(req, res);
    if (!handled) {
      // Pass to Hono
      return honoListener(req, res);
    }
  } catch (err) {
    console.error('[SERVER] Unhandled error:', err);
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error');
    }
  }
});

// Keep the process alive
const keepAlive = setInterval(() => { }, 1000 * 60 * 60);

// Handle uncaught errors to prevent silent crashes
process.on('uncaughtException', (err) => {
  console.error('[FATAL] Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason) => {
  console.error('[FATAL] Unhandled Rejection:', reason);
});

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

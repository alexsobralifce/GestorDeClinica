import { Hono } from 'hono';
import fs from 'fs';
import path from 'path';
import pool from '../db/connection';
import { authMiddleware } from '../middleware/auth';
import { storage } from '../services/storage';

const app = new Hono();

app.use('*', authMiddleware);

// POST /files/presigned-url
app.post('/presigned-url', async (c) => {
  const { filename, mime_type } = await c.req.json();

  if (!filename || !mime_type) {
    return c.json({ error: 'Missing filename or mime_type' }, 400);
  }

  try {
    const result = await storage.getPresignedUrl(filename, mime_type);
    return c.json(result);
  } catch (err: any) {
    console.error('Error generating presigned URL:', err);
    return c.json({ error: err.message }, 500);
  }
});

// POST /files/upload/:key (Local storage specific endpoint to receive the file content)
app.put('/upload/:key', async (c) => {
  const key = c.req.param('key');
  const buffer = await c.req.arrayBuffer();

  // Save to local file system
  const filePath = path.resolve(process.cwd(), 'uploads', key);
  try {
    fs.writeFileSync(filePath, Buffer.from(buffer));
    return c.json({ status: 'ok' });
  } catch (err: any) {
    console.error('Error saving file:', err);
    return c.json({ error: err.message }, 500);
  }
});

// POST /files (Finalize and register metadata)
app.post('/', async (c) => {
  const { key, context, user_metadata } = await c.req.json();
  const user = c.get('user');

  try {
    const fileInfo = await storage.finalizeUpload(key);

    // Calculate hash (omitted for MVP speed, using placeholder)
    const hash = 'sha256-placeholder';

    await pool.query('BEGIN');

    const result = await pool.query(`
      INSERT INTO files (
        storage_path, filename, mime_type, size_bytes, hash_sha256, uploaded_by, metadata
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `, [
      fileInfo.path,
      key, // filename is key for now
      'application/octet-stream', // Should detect from file or pass from client
      fileInfo.size,
      hash,
      user.id,
      JSON.stringify(user_metadata || {})
    ]);

    const fileId = result.rows[0].id;

    await pool.query('COMMIT');
    return c.json({ id: fileId }, 201);
  } catch (err: any) {
    await pool.query('ROLLBACK');
    console.error('Error registering file:', err);
    return c.json({ error: err.message }, 500);
  }
});

export default app;

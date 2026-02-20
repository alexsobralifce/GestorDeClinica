import { Hono } from 'hono';
import pool from '../db/connection.js';

const app = new Hono();

// GET all professionals
app.get('/', async (c) => {
  try {
    const result = await pool.query(`
      SELECT * FROM professionals 
      WHERE active = true
      ORDER BY name ASC
    `);
    return c.json(result.rows);
  } catch (error: any) {
    console.error('Error fetching professionals:', error);
    return c.json({ error: error.message }, 500);
  }
});

// GET professional by ID
app.get('/:id', async (c) => {
  try {
    const { id } = c.req.param();
    const result = await pool.query(
      'SELECT * FROM professionals WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return c.json({ error: 'Professional not found' }, 404);
    }

    return c.json(result.rows[0]);
  } catch (error: any) {
    console.error('Error fetching professional:', error);
    return c.json({ error: error.message }, 500);
  }
});

// POST create professional
app.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const {
      name, specialty, registration_number, phone, email, schedule, color
    } = body;

    const result = await pool.query(`
      INSERT INTO professionals (
        name, specialty, registration_number, phone, email, schedule, color
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [name, specialty, registration_number, phone, email, schedule, color]);

    return c.json(result.rows[0], 201);
  } catch (error: any) {
    console.error('Error creating professional:', error);
    return c.json({ error: error.message }, 500);
  }
});

// PUT update professional
app.put('/:id', async (c) => {
  try {
    const { id } = c.req.param();
    const body = await c.req.json();
    const {
      name, specialty, registration_number, phone, email, schedule, color, active
    } = body;

    const result = await pool.query(`
      UPDATE professionals SET
        name = $1, specialty = $2, registration_number = $3,
        phone = $4, email = $5, schedule = $6, color = $7, active = $8
      WHERE id = $9
      RETURNING *
    `, [name, specialty, registration_number, phone, email, schedule, color, active, id]);

    if (result.rows.length === 0) {
      return c.json({ error: 'Professional not found' }, 404);
    }

    return c.json(result.rows[0]);
  } catch (error: any) {
    console.error('Error updating professional:', error);
    return c.json({ error: error.message }, 500);
  }
});

// DELETE professional (soft delete)
app.delete('/:id', async (c) => {
  try {
    const { id } = c.req.param();
    const result = await pool.query(
      'UPDATE professionals SET active = false WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return c.json({ error: 'Professional not found' }, 404);
    }

    return c.json({ message: 'Professional deactivated successfully' });
  } catch (error: any) {
    console.error('Error deleting professional:', error);
    return c.json({ error: error.message }, 500);
  }
});

export default app;

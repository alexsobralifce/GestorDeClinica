import { Hono } from 'hono';
import pool from '../db/connection.js';

const app = new Hono();

// GET all patients
app.get('/', async (c) => {
  try {
    const result = await pool.query(`
      SELECT * FROM patients 
      ORDER BY created_at DESC
    `);
    return c.json(result.rows);
  } catch (error: any) {
    console.error('Error fetching patients:', error);
    return c.json({ error: error.message }, 500);
  }
});

// GET patient by ID
app.get('/:id', async (c) => {
  try {
    const { id } = c.req.param();
    const result = await pool.query(
      'SELECT * FROM patients WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return c.json({ error: 'Patient not found' }, 404);
    }

    return c.json(result.rows[0]);
  } catch (error: any) {
    console.error('Error fetching patient:', error);
    return c.json({ error: error.message }, 500);
  }
});

// POST create patient
app.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const {
      name, cpf, birth_date, gender, phone, email, address,
      allergies, medical_conditions, emergency_contact_name,
      emergency_contact_phone, notes
    } = body;

    const result = await pool.query(`
      INSERT INTO patients (
        name, cpf, birth_date, gender, phone, email, address,
        allergies, medical_conditions, emergency_contact_name,
        emergency_contact_phone, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `, [
      name, cpf, birth_date, gender, phone, email, address,
      allergies, medical_conditions, emergency_contact_name,
      emergency_contact_phone, notes
    ]);

    return c.json(result.rows[0], 201);
  } catch (error: any) {
    console.error('Error creating patient:', error);
    return c.json({ error: error.message }, 500);
  }
});

// PUT update patient
app.put('/:id', async (c) => {
  try {
    const { id } = c.req.param();
    const body = await c.req.json();
    const {
      name, cpf, birth_date, gender, phone, email, address,
      allergies, medical_conditions, emergency_contact_name,
      emergency_contact_phone, notes
    } = body;

    const result = await pool.query(`
      UPDATE patients SET
        name = $1, cpf = $2, birth_date = $3, gender = $4,
        phone = $5, email = $6, address = $7, allergies = $8,
        medical_conditions = $9, emergency_contact_name = $10,
        emergency_contact_phone = $11, notes = $12
      WHERE id = $13
      RETURNING *
    `, [
      name, cpf, birth_date, gender, phone, email, address,
      allergies, medical_conditions, emergency_contact_name,
      emergency_contact_phone, notes, id
    ]);

    if (result.rows.length === 0) {
      return c.json({ error: 'Patient not found' }, 404);
    }

    return c.json(result.rows[0]);
  } catch (error: any) {
    console.error('Error updating patient:', error);
    return c.json({ error: error.message }, 500);
  }
});

// DELETE patient
app.delete('/:id', async (c) => {
  try {
    const { id } = c.req.param();
    const result = await pool.query(
      'DELETE FROM patients WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return c.json({ error: 'Patient not found' }, 404);
    }

    return c.json({ message: 'Patient deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting patient:', error);
    return c.json({ error: error.message }, 500);
  }
});

export default app;

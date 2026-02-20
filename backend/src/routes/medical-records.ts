import { Hono } from 'hono';
import pool from '../db/connection.js';

const app = new Hono();

// GET all medical records (with optional patient filter)
app.get('/', async (c) => {
  try {
    const { patient_id } = c.req.query();

    let query = `
      SELECT 
        mr.*,
        p.name as patient_name,
        pr.name as professional_name,
        pr.specialty
      FROM medical_records mr
      JOIN patients p ON mr.patient_id = p.id
      JOIN professionals pr ON mr.professional_id = pr.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (patient_id) {
      query += ' AND mr.patient_id = $1';
      params.push(patient_id);
    }

    query += ' ORDER BY mr.record_date DESC, mr.created_at DESC';

    const result = await pool.query(query, params);
    return c.json(result.rows);
  } catch (error: any) {
    console.error('Error fetching medical records:', error);
    return c.json({ error: error.message }, 500);
  }
});

// GET medical record by ID
app.get('/:id', async (c) => {
  try {
    const { id } = c.req.param();
    const result = await pool.query(`
      SELECT 
        mr.*,
        p.name as patient_name,
        pr.name as professional_name,
        pr.specialty
      FROM medical_records mr
      JOIN patients p ON mr.patient_id = p.id
      JOIN professionals pr ON mr.professional_id = pr.id
      WHERE mr.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return c.json({ error: 'Medical record not found' }, 404);
    }

    return c.json(result.rows[0]);
  } catch (error: any) {
    console.error('Error fetching medical record:', error);
    return c.json({ error: error.message }, 500);
  }
});

// POST create medical record
app.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const {
      patient_id, professional_id, appointment_id, record_date,
      specialty, chief_complaint, diagnosis, treatment, prescription,
      notes, attachments
    } = body;

    const result = await pool.query(`
      INSERT INTO medical_records (
        patient_id, professional_id, appointment_id, record_date,
        specialty, chief_complaint, diagnosis, treatment, prescription,
        notes, attachments
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `, [
      patient_id, professional_id, appointment_id, record_date,
      specialty, chief_complaint, diagnosis, treatment, prescription,
      notes, attachments || []
    ]);

    return c.json(result.rows[0], 201);
  } catch (error: any) {
    console.error('Error creating medical record:', error);
    return c.json({ error: error.message }, 500);
  }
});

// PUT update medical record
app.put('/:id', async (c) => {
  try {
    const { id } = c.req.param();
    const body = await c.req.json();
    const {
      patient_id, professional_id, appointment_id, record_date,
      specialty, chief_complaint, diagnosis, treatment, prescription,
      notes, attachments
    } = body;

    const result = await pool.query(`
      UPDATE medical_records SET
        patient_id = $1, professional_id = $2, appointment_id = $3,
        record_date = $4, specialty = $5, chief_complaint = $6,
        diagnosis = $7, treatment = $8, prescription = $9,
        notes = $10, attachments = $11
      WHERE id = $12
      RETURNING *
    `, [
      patient_id, professional_id, appointment_id, record_date,
      specialty, chief_complaint, diagnosis, treatment, prescription,
      notes, attachments, id
    ]);

    if (result.rows.length === 0) {
      return c.json({ error: 'Medical record not found' }, 404);
    }

    return c.json(result.rows[0]);
  } catch (error: any) {
    console.error('Error updating medical record:', error);
    return c.json({ error: error.message }, 500);
  }
});

// DELETE medical record
app.delete('/:id', async (c) => {
  try {
    const { id } = c.req.param();
    const result = await pool.query(
      'DELETE FROM medical_records WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return c.json({ error: 'Medical record not found' }, 404);
    }

    return c.json({ message: 'Medical record deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting medical record:', error);
    return c.json({ error: error.message }, 500);
  }
});

export default app;

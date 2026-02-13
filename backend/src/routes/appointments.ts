import { Hono } from 'hono';
import pool from '../db/connection';

const app = new Hono();

// GET all appointments (with optional filters)
app.get('/', async (c) => {
  try {
    const { date, professional_id, patient_id, status } = c.req.query();

    let query = `
      SELECT 
        a.*,
        p.name as patient_name,
        pr.name as professional_name,
        pr.specialty
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN professionals pr ON a.professional_id = pr.id
      WHERE 1=1
    `;
    const params: any[] = [];
    let paramIndex = 1;

    if (date) {
      query += ` AND a.appointment_date = $${paramIndex}`;
      params.push(date);
      paramIndex++;
    }

    if (professional_id) {
      query += ` AND a.professional_id = $${paramIndex}`;
      params.push(professional_id);
      paramIndex++;
    }

    if (patient_id) {
      query += ` AND a.patient_id = $${paramIndex}`;
      params.push(patient_id);
      paramIndex++;
    }

    if (status) {
      query += ` AND a.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    query += ' ORDER BY a.appointment_date DESC, a.start_time DESC';

    const result = await pool.query(query, params);
    return c.json(result.rows);
  } catch (error: any) {
    console.error('Error fetching appointments:', error);
    return c.json({ error: error.message }, 500);
  }
});

// GET appointment by ID
app.get('/:id', async (c) => {
  try {
    const { id } = c.req.param();
    const result = await pool.query(`
      SELECT 
        a.*,
        p.name as patient_name,
        pr.name as professional_name,
        pr.specialty
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN professionals pr ON a.professional_id = pr.id
      WHERE a.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return c.json({ error: 'Appointment not found' }, 404);
    }

    return c.json(result.rows[0]);
  } catch (error: any) {
    console.error('Error fetching appointment:', error);
    return c.json({ error: error.message }, 500);
  }
});

// POST create appointment
app.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const {
      patient_id, professional_id, appointment_date, start_time,
      end_time, duration, status, specialty, notes
    } = body;

    const result = await pool.query(`
      INSERT INTO appointments (
        patient_id, professional_id, appointment_date, start_time,
        end_time, duration, status, specialty, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `, [
      patient_id, professional_id, appointment_date, start_time,
      end_time, duration, status || 'scheduled', specialty, notes
    ]);

    return c.json(result.rows[0], 201);
  } catch (error: any) {
    console.error('Error creating appointment:', error);
    return c.json({ error: error.message }, 500);
  }
});

// PUT update appointment
app.put('/:id', async (c) => {
  try {
    const { id } = c.req.param();
    const body = await c.req.json();
    const {
      patient_id, professional_id, appointment_date, start_time,
      end_time, duration, status, specialty, notes
    } = body;

    const result = await pool.query(`
      UPDATE appointments SET
        patient_id = $1, professional_id = $2, appointment_date = $3,
        start_time = $4, end_time = $5, duration = $6, status = $7,
        specialty = $8, notes = $9
      WHERE id = $10
      RETURNING *
    `, [
      patient_id, professional_id, appointment_date, start_time,
      end_time, duration, status, specialty, notes, id
    ]);

    if (result.rows.length === 0) {
      return c.json({ error: 'Appointment not found' }, 404);
    }

    return c.json(result.rows[0]);
  } catch (error: any) {
    console.error('Error updating appointment:', error);
    return c.json({ error: error.message }, 500);
  }
});

// DELETE appointment
app.delete('/:id', async (c) => {
  try {
    const { id } = c.req.param();
    const result = await pool.query(
      'DELETE FROM appointments WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return c.json({ error: 'Appointment not found' }, 404);
    }

    return c.json({ message: 'Appointment deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting appointment:', error);
    return c.json({ error: error.message }, 500);
  }
});

export default app;

import { Hono } from 'hono';
import pool from '../db/connection';

const app = new Hono();

// GET /professionals - List active professionals with name/specialty/id
app.get('/professionals', async (c) => {
  try {
    const result = await pool.query(`
      SELECT id, name, specialty, phone 
      FROM professionals 
      WHERE active = true 
      ORDER BY name ASC
    `);
    return c.json(result.rows);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// GET /slots - Get available 30-min slots for a professional on a date
app.get('/slots', async (c) => {
  try {
    const { professional_id, date } = c.req.query();
    if (!professional_id || !date) return c.json({ error: 'Missing params' }, 400);

    const dow = new Date(date).getDay(); // 0=Sun, 6=Sat
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayKey = days[dow];

    // 1. Get professional schedule
    const profRes = await pool.query('SELECT schedule FROM professionals WHERE id = $1', [professional_id]);
    if (profRes.rows.length === 0) return c.json({ error: 'Professional not found' }, 404);

    const schedule = profRes.rows[0].schedule || {};
    // schedule format example: { "monday": {"start": "08:00", "end": "18:00"} }

    const workHours = schedule[dayKey];
    if (!workHours) return c.json([]); // No work today

    // 2. Get existing appointments
    const apptsRes = await pool.query(`
      SELECT start_time, duration 
      FROM appointments 
      WHERE professional_id = $1 AND appointment_date = $2 AND status != 'cancelled'
    `, [professional_id, date]);

    const busySlots = new Set(apptsRes.rows.map(a => a.start_time.slice(0, 5)));

    // 3. Generate 30-min slots
    const slots: string[] = [];

    // Support both simple object {start, end} and array of objects [{start, end}] if needed, 
    // but seed uses simple object. We'll handle single object for now based on seed.
    const ranges = Array.isArray(workHours) ? workHours : [workHours];

    for (const range of ranges) {
      if (!range.start || !range.end) continue;

      let [h, m] = range.start.split(':').map(Number);
      const [endH, endM] = range.end.split(':').map(Number);

      while (h < endH || (h === endH && m < endM)) {
        const timeStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;

        // Check if slot is taken
        if (!busySlots.has(timeStr)) {
          slots.push(timeStr);
        }

        // Increment 30 mins
        m += 30;
        if (m >= 60) { h++; m -= 60; }
      }
    }

    return c.json(slots);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// POST /register - Find or create patient by CPF
app.post('/register', async (c) => {
  try {
    const { name, cpf, email, phone } = await c.req.json();

    // Check if exists by CPF
    const existing = await pool.query('SELECT id FROM patients WHERE cpf = $1', [cpf]);

    if (existing.rows.length > 0) {
      // Update info
      const updated = await pool.query(`
        UPDATE patients SET name = $1, email = $2, phone = $3, updated_at = NOW() 
        WHERE cpf = $4 RETURNING id
      `, [name, email, phone, cpf]);
      return c.json({ id: updated.rows[0].id });
    } else {
      // Create new
      const created = await pool.query(`
        INSERT INTO patients (name, cpf, email, phone) 
        VALUES ($1, $2, $3, $4) RETURNING id
      `, [name, cpf, email, phone]);
      return c.json({ id: created.rows[0].id });
    }
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// POST /appointment - Create the appointment
app.post('/appointment', async (c) => {
  try {
    const { patient_id, professional_id, date, time } = await c.req.json();

    // Double check availability
    const busy = await pool.query(`
      SELECT id FROM appointments 
      WHERE professional_id = $1 AND appointment_date = $2 AND start_time = $3 AND status != 'cancelled'
    `, [professional_id, date, time]);

    if (busy.rows.length > 0) {
      return c.json({ error: 'Horário indisponível' }, 409);
    }

    // Determine end time (default 30 min duration)
    let [h, m] = time.split(':').map(Number);
    m += 30;
    if (m >= 60) { h++; m -= 60; }
    const endTime = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;

    const result = await pool.query(`
      INSERT INTO appointments (
        patient_id, professional_id, appointment_date, start_time, end_time, duration, status, notes
      ) VALUES ($1, $2, $3, $4, $5, 30, 'scheduled', 'Agendamento online')
      RETURNING id
    `, [patient_id, professional_id, date, time, endTime]);

    return c.json({ id: result.rows[0].id }, 201);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

export default app;

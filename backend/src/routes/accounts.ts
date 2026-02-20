import { Hono } from 'hono';
import pool from '../db/connection.js';

const app = new Hono();

// ─── CONTAS A PAGAR ────────────────────────────────────────────────────────────

// GET /accounts/payable — list with filters
app.get('/payable', async (c) => {
  try {
    const { status, start_date, end_date, category_id } = c.req.query();
    let query = `
      SELECT 
        ap.*,
        cat.name as category_name,
        cat.color as category_color
      FROM accounts_payable ap
      LEFT JOIN categories cat ON ap.category_id = cat.id
      WHERE 1=1
    `;
    const params: any[] = [];
    let idx = 1;

    if (status) { query += ` AND ap.status = $${idx++}`; params.push(status); }
    if (start_date) { query += ` AND ap.due_date >= $${idx++}`; params.push(start_date); }
    if (end_date) { query += ` AND ap.due_date <= $${idx++}`; params.push(end_date); }
    if (category_id) { query += ` AND ap.category_id = $${idx++}`; params.push(category_id); }

    query += ' ORDER BY ap.due_date ASC, ap.created_at DESC';
    const result = await pool.query(query, params);
    return c.json(result.rows);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// GET /accounts/payable/dashboard — KPIs
app.get('/payable/dashboard', async (c) => {
  try {
    const result = await pool.query(`
      SELECT
        COALESCE(SUM(original_amount - paid_amount) FILTER (WHERE status NOT IN ('paid','cancelled')), 0) as total_open,
        COALESCE(SUM(original_amount - paid_amount) FILTER (WHERE status NOT IN ('paid','cancelled') AND due_date < CURRENT_DATE), 0) as total_overdue,
        COALESCE(SUM(original_amount - paid_amount) FILTER (WHERE status NOT IN ('paid','cancelled') AND due_date = CURRENT_DATE), 0) as due_today,
        COALESCE(SUM(original_amount - paid_amount) FILTER (WHERE status NOT IN ('paid','cancelled') AND due_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'), 0) as due_next_7_days,
        COUNT(*) FILTER (WHERE status = 'pending') as pending_count,
        COUNT(*) FILTER (WHERE status NOT IN ('paid','cancelled') AND due_date < CURRENT_DATE) as overdue_count
      FROM accounts_payable
    `);
    return c.json(result.rows[0]);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// POST /accounts/payable
app.post('/payable', async (c) => {
  try {
    const user = c.get('user');
    const body = await c.req.json();
    const {
      creditor_name, creditor_document, creditor_type, creditor_bank_data,
      original_amount, due_date, category_id, is_recurring, frequency,
      notes, tags, requires_approval
    } = body;

    const result = await pool.query(`
      INSERT INTO accounts_payable (
        creditor_name, creditor_document, creditor_type, creditor_bank_data,
        original_amount, due_date, category_id, is_recurring, frequency,
        notes, tags, requires_approval, created_by
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
      RETURNING *
    `, [
      creditor_name, creditor_document, creditor_type || 'supplier',
      creditor_bank_data ? JSON.stringify(creditor_bank_data) : null,
      original_amount, due_date, category_id, is_recurring || false,
      frequency, notes, tags, requires_approval || false, user?.id
    ]);
    return c.json(result.rows[0], 201);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// PATCH /accounts/payable/:id/pay — register payment
app.patch('/payable/:id/pay', async (c) => {
  try {
    const { id } = c.req.param();
    const { paid_amount, payment_method, payment_date, payment_proof } = await c.req.json();

    const result = await pool.query(`
      UPDATE accounts_payable SET
        paid_amount = COALESCE($1, original_amount),
        payment_method = $2,
        payment_date = COALESCE($3, CURRENT_DATE),
        payment_proof = $4,
        status = CASE 
          WHEN COALESCE($1, original_amount) >= original_amount THEN 'paid'
          ELSE 'pending'
        END,
        updated_at = NOW()
      WHERE id = $5
      RETURNING *
    `, [paid_amount, payment_method, payment_date, payment_proof, id]);

    if (result.rows.length === 0) return c.json({ error: 'Account not found' }, 404);
    return c.json(result.rows[0]);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// DELETE /accounts/payable/:id
app.delete('/payable/:id', async (c) => {
  try {
    const { id } = c.req.param();
    await pool.query(`UPDATE accounts_payable SET status = 'cancelled', updated_at = NOW() WHERE id = $1`, [id]);
    return c.json({ message: 'Cancelled successfully' });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// ─── CONTAS A RECEBER ──────────────────────────────────────────────────────────

// GET /accounts/receivable
app.get('/receivable', async (c) => {
  try {
    const { status, debtor_type, start_date, end_date } = c.req.query();
    let query = `
      SELECT 
        ar.*,
        p.name as patient_name_lookup,
        cat.name as category_name,
        cat.color as category_color,
        CASE WHEN ar.status NOT IN ('paid','cancelled') AND ar.due_date < CURRENT_DATE
          THEN (CURRENT_DATE - ar.due_date)
          ELSE 0
        END as days_overdue
      FROM accounts_receivable ar
      LEFT JOIN patients p ON ar.patient_id = p.id
      LEFT JOIN categories cat ON ar.category_id = cat.id
      WHERE 1=1
    `;
    const params: any[] = [];
    let idx = 1;

    if (status === 'overdue') {
      query += ` AND ar.status NOT IN ('paid','cancelled') AND ar.due_date < CURRENT_DATE`;
    } else if (status === 'today') {
      query += ` AND ar.due_date = CURRENT_DATE AND ar.status NOT IN ('paid','cancelled')`;
    } else if (status) {
      query += ` AND ar.status = $${idx++}`; params.push(status);
    }
    if (debtor_type) { query += ` AND ar.debtor_type = $${idx++}`; params.push(debtor_type); }
    if (start_date) { query += ` AND ar.due_date >= $${idx++}`; params.push(start_date); }
    if (end_date) { query += ` AND ar.due_date <= $${idx++}`; params.push(end_date); }

    query += ' ORDER BY ar.due_date ASC, ar.created_at DESC';
    const result = await pool.query(query, params);
    return c.json(result.rows);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// GET /accounts/receivable/dashboard
app.get('/receivable/dashboard', async (c) => {
  try {
    const result = await pool.query(`
      SELECT
        COALESCE(SUM(original_amount - paid_amount) FILTER (WHERE status NOT IN ('paid','cancelled')), 0) as total_open,
        COALESCE(SUM(original_amount - paid_amount) FILTER (WHERE status NOT IN ('paid','cancelled') AND due_date < CURRENT_DATE), 0) as total_overdue,
        COALESCE(SUM(original_amount - paid_amount) FILTER (WHERE status NOT IN ('paid','cancelled') AND due_date = CURRENT_DATE), 0) as due_today,
        COALESCE(SUM(original_amount - paid_amount) FILTER (WHERE status NOT IN ('paid','cancelled') AND due_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'), 0) as due_next_7_days,
        COUNT(*) FILTER (WHERE status = 'pending') as pending_count,
        COUNT(*) FILTER (WHERE status NOT IN ('paid','cancelled') AND due_date < CURRENT_DATE) as overdue_count,
        CASE 
          WHEN COUNT(*) FILTER (WHERE status NOT IN ('cancelled')) > 0
          THEN ROUND(100.0 * COUNT(*) FILTER (WHERE status NOT IN ('paid','cancelled') AND due_date < CURRENT_DATE) / COUNT(*) FILTER (WHERE status NOT IN ('cancelled')), 1)
          ELSE 0
        END as default_rate
      FROM accounts_receivable
    `);
    return c.json(result.rows[0]);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// POST /accounts/receivable
app.post('/receivable', async (c) => {
  try {
    const user = c.get('user');
    const body = await c.req.json();
    const {
      debtor_type, patient_id, debtor_name, debtor_document,
      debtor_email, debtor_phone, original_amount, due_date,
      category_id, appointment_id, notes,
      installment_number, total_installments, parent_id
    } = body;

    const result = await pool.query(`
      INSERT INTO accounts_receivable (
        debtor_type, patient_id, debtor_name, debtor_document,
        debtor_email, debtor_phone, original_amount, due_date,
        category_id, appointment_id, notes,
        installment_number, total_installments, parent_id, created_by
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
      RETURNING *
    `, [
      debtor_type || 'patient', patient_id, debtor_name, debtor_document,
      debtor_email, debtor_phone, original_amount, due_date,
      category_id, appointment_id, notes,
      installment_number, total_installments, parent_id, user?.id
    ]);
    return c.json(result.rows[0], 201);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// PATCH /accounts/receivable/:id/receive
app.patch('/receivable/:id/receive', async (c) => {
  try {
    const { id } = c.req.param();
    const { paid_amount, payment_method, payment_date } = await c.req.json();

    const result = await pool.query(`
      UPDATE accounts_receivable SET
        paid_amount = COALESCE($1, original_amount),
        payment_method = $2,
        payment_date = COALESCE($3, CURRENT_DATE),
        status = CASE 
          WHEN COALESCE($1, original_amount) >= original_amount THEN 'paid'
          ELSE 'partial'
        END,
        updated_at = NOW()
      WHERE id = $4
      RETURNING *
    `, [paid_amount, payment_method, payment_date, id]);

    if (result.rows.length === 0) return c.json({ error: 'Account not found' }, 404);
    return c.json(result.rows[0]);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

export default app;

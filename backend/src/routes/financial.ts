import { Hono } from 'hono';
import pool from '../db/connection';

const app = new Hono();

// GET all financial transactions (with optional filters)
app.get('/', async (c) => {
  try {
    const { type, status, start_date, end_date } = c.req.query();

    let query = `
      SELECT 
        ft.*,
        c.name as category_name,
        c.color as category_color,
        p.name as patient_name,
        pr.name as professional_name
      FROM financial_transactions ft
      LEFT JOIN categories c ON ft.category_id = c.id
      LEFT JOIN patients p ON ft.patient_id = p.id
      LEFT JOIN professionals pr ON ft.professional_id = pr.id
      WHERE 1=1
    `;
    const params: any[] = [];
    let paramIndex = 1;

    if (type) {
      query += ` AND ft.type = $${paramIndex}`;
      params.push(type);
      paramIndex++;
    }

    if (status) {
      query += ` AND ft.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    if (start_date) {
      query += ` AND ft.transaction_date >= $${paramIndex}`;
      params.push(start_date);
      paramIndex++;
    }

    if (end_date) {
      query += ` AND ft.transaction_date <= $${paramIndex}`;
      params.push(end_date);
      paramIndex++;
    }

    query += ' ORDER BY ft.transaction_date DESC, ft.created_at DESC';

    const result = await pool.query(query, params);
    return c.json(result.rows);
  } catch (error: any) {
    console.error('Error fetching financial transactions:', error);
    return c.json({ error: error.message }, 500);
  }
});

// GET financial summary/statistics
app.get('/summary', async (c) => {
  try {
    const { start_date, end_date } = c.req.query();

    let dateFilter = '';
    const params: any[] = [];

    if (start_date && end_date) {
      dateFilter = 'WHERE transaction_date BETWEEN $1 AND $2';
      params.push(start_date, end_date);
    }

    const result = await pool.query(`
      SELECT 
        SUM(CASE WHEN type = 'income' AND status = 'paid' THEN amount ELSE 0 END) as total_income,
        SUM(CASE WHEN type = 'expense' AND status = 'paid' THEN amount ELSE 0 END) as total_expenses,
        SUM(CASE WHEN type = 'income' AND status = 'pending' THEN amount ELSE 0 END) as pending_income,
        SUM(CASE WHEN type = 'expense' AND status = 'pending' THEN amount ELSE 0 END) as pending_expenses,
        COUNT(CASE WHEN type = 'income' THEN 1 END) as income_count,
        COUNT(CASE WHEN type = 'expense' THEN 1 END) as expense_count
      FROM financial_transactions
      ${dateFilter}
    `, params);

    return c.json(result.rows[0]);
  } catch (error: any) {
    console.error('Error fetching financial summary:', error);
    return c.json({ error: error.message }, 500);
  }
});

// GET transaction by ID
app.get('/:id', async (c) => {
  try {
    const { id } = c.req.param();
    const result = await pool.query(`
      SELECT 
        ft.*,
        c.name as category_name,
        p.name as patient_name,
        pr.name as professional_name
      FROM financial_transactions ft
      LEFT JOIN categories c ON ft.category_id = c.id
      LEFT JOIN patients p ON ft.patient_id = p.id
      LEFT JOIN professionals pr ON ft.professional_id = pr.id
      WHERE ft.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return c.json({ error: 'Transaction not found' }, 404);
    }

    return c.json(result.rows[0]);
  } catch (error: any) {
    console.error('Error fetching transaction:', error);
    return c.json({ error: error.message }, 500);
  }
});

// POST create transaction
app.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const {
      type, category_id, description, amount, transaction_date,
      due_date, payment_date, status, payment_method, patient_id,
      professional_id, appointment_id, notes
    } = body;

    const result = await pool.query(`
      INSERT INTO financial_transactions (
        type, category_id, description, amount, transaction_date,
        due_date, payment_date, status, payment_method, patient_id,
        professional_id, appointment_id, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `, [
      type, category_id, description, amount, transaction_date,
      due_date, payment_date, status || 'pending', payment_method,
      patient_id, professional_id, appointment_id, notes
    ]);

    return c.json(result.rows[0], 201);
  } catch (error: any) {
    console.error('Error creating transaction:', error);
    return c.json({ error: error.message }, 500);
  }
});

// PUT update transaction
app.put('/:id', async (c) => {
  try {
    const { id } = c.req.param();
    const body = await c.req.json();
    const {
      type, category_id, description, amount, transaction_date,
      due_date, payment_date, status, payment_method, patient_id,
      professional_id, appointment_id, notes
    } = body;

    const result = await pool.query(`
      UPDATE financial_transactions SET
        type = $1, category_id = $2, description = $3, amount = $4,
        transaction_date = $5, due_date = $6, payment_date = $7,
        status = $8, payment_method = $9, patient_id = $10,
        professional_id = $11, appointment_id = $12, notes = $13
      WHERE id = $14
      RETURNING *
    `, [
      type, category_id, description, amount, transaction_date,
      due_date, payment_date, status, payment_method, patient_id,
      professional_id, appointment_id, notes, id
    ]);

    if (result.rows.length === 0) {
      return c.json({ error: 'Transaction not found' }, 404);
    }

    return c.json(result.rows[0]);
  } catch (error: any) {
    console.error('Error updating transaction:', error);
    return c.json({ error: error.message }, 500);
  }
});

// DELETE transaction
app.delete('/:id', async (c) => {
  try {
    const { id } = c.req.param();
    const result = await pool.query(
      'DELETE FROM financial_transactions WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return c.json({ error: 'Transaction not found' }, 404);
    }

    return c.json({ message: 'Transaction deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting transaction:', error);
    return c.json({ error: error.message }, 500);
  }
});

export default app;

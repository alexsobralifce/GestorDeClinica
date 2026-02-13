import { Hono } from 'hono';
import pool from '../db/connection';

const app = new Hono();

// GET all categories
app.get('/', async (c) => {
  try {
    const { type } = c.req.query();

    let query = 'SELECT * FROM categories WHERE 1=1';
    const params: any[] = [];

    if (type) {
      query += ' AND type = $1';
      params.push(type);
    }

    query += ' ORDER BY name ASC';

    const result = await pool.query(query, params);
    return c.json(result.rows);
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    return c.json({ error: error.message }, 500);
  }
});

// GET category by ID
app.get('/:id', async (c) => {
  try {
    const { id } = c.req.param();
    const result = await pool.query(
      'SELECT * FROM categories WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return c.json({ error: 'Category not found' }, 404);
    }

    return c.json(result.rows[0]);
  } catch (error: any) {
    console.error('Error fetching category:', error);
    return c.json({ error: error.message }, 500);
  }
});

// POST create category
app.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const { name, type, color, icon } = body;

    const result = await pool.query(`
      INSERT INTO categories (name, type, color, icon)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [name, type, color, icon]);

    return c.json(result.rows[0], 201);
  } catch (error: any) {
    console.error('Error creating category:', error);
    return c.json({ error: error.message }, 500);
  }
});

// PUT update category
app.put('/:id', async (c) => {
  try {
    const { id } = c.req.param();
    const body = await c.req.json();
    const { name, type, color, icon } = body;

    const result = await pool.query(`
      UPDATE categories SET
        name = $1, type = $2, color = $3, icon = $4
      WHERE id = $5
      RETURNING *
    `, [name, type, color, icon, id]);

    if (result.rows.length === 0) {
      return c.json({ error: 'Category not found' }, 404);
    }

    return c.json(result.rows[0]);
  } catch (error: any) {
    console.error('Error updating category:', error);
    return c.json({ error: error.message }, 500);
  }
});

// DELETE category
app.delete('/:id', async (c) => {
  try {
    const { id } = c.req.param();
    const result = await pool.query(
      'DELETE FROM categories WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return c.json({ error: 'Category not found' }, 404);
    }

    return c.json({ message: 'Category deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting category:', error);
    return c.json({ error: error.message }, 500);
  }
});

export default app;

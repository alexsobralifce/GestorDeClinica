import { Hono } from 'hono';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db/connection.js';
import dotenv from 'dotenv';

dotenv.config();

const usersRouter = new Hono();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

// Middleware: verify JWT and require ADMIN role
async function requireAdmin(c: any, next: () => Promise<void>) {
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return c.json({ error: 'Token não fornecido' }, 401);
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    if (decoded.role !== 'ADMIN') {
      return c.json({ error: 'Acesso restrito a administradores' }, 403);
    }

    c.set('user', decoded);
    return await next();
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return c.json({ error: 'Token inválido ou expirado' }, 401);
    }
    return c.json({ error: 'Erro de autenticação' }, 500);
  }
}

// GET /api/users — List all users (admin only)
usersRouter.get('/', requireAdmin, async (c) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, role, modules, active, created_at, updated_at FROM users ORDER BY name'
    );
    return c.json(result.rows);
  } catch (error) {
    console.error('List users error:', error);
    return c.json({ error: 'Erro ao listar usuários' }, 500);
  }
});

// GET /api/users/:id — Get single user (admin only)
usersRouter.get('/:id', requireAdmin, async (c) => {
  try {
    const { id } = c.req.param();
    const result = await pool.query(
      'SELECT id, name, email, role, modules, active, created_at, updated_at FROM users WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return c.json({ error: 'Usuário não encontrado' }, 404);
    }

    return c.json(result.rows[0]);
  } catch (error) {
    console.error('Get user error:', error);
    return c.json({ error: 'Erro ao buscar usuário' }, 500);
  }
});

// POST /api/users — Create user (admin only)
usersRouter.post('/', requireAdmin, async (c) => {
  try {
    const { name, email, password, role, modules } = await c.req.json();

    // Validation
    if (!name || !email || !password) {
      return c.json({ error: 'Nome, email e senha são obrigatórios' }, 400);
    }

    if (password.length < 6) {
      return c.json({ error: 'Senha deve ter no mínimo 6 caracteres' }, 400);
    }

    // Check if email already exists
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase().trim()]);
    if (existing.rows.length > 0) {
      return c.json({ error: 'Este email já está cadastrado' }, 409);
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Determine modules: ADMIN gets all
    const userRole = role || 'USER';
    const userModules = userRole === 'ADMIN'
      ? ['dashboard', 'agenda', 'pacientes', 'prontuario', 'financeiro', 'bi', 'admin']
      : (modules || ['dashboard']);

    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, role, modules, active)
       VALUES ($1, $2, $3, $4, $5, true)
       RETURNING id, name, email, role, modules, active, created_at`,
      [name.trim(), email.toLowerCase().trim(), password_hash, userRole, userModules]
    );

    return c.json(result.rows[0], 201);
  } catch (error) {
    console.error('Create user error:', error);
    return c.json({ error: 'Erro ao criar usuário' }, 500);
  }
});

// PUT /api/users/:id — Update user (admin only)
usersRouter.put('/:id', requireAdmin, async (c) => {
  try {
    const { id } = c.req.param();
    const { name, email, password, role, modules, active } = await c.req.json();

    // Check user exists
    const existing = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return c.json({ error: 'Usuário não encontrado' }, 404);
    }

    // Check email uniqueness if changed
    if (email && email.toLowerCase().trim() !== existing.rows[0].email) {
      const emailCheck = await pool.query('SELECT id FROM users WHERE email = $1 AND id != $2', [email.toLowerCase().trim(), id]);
      if (emailCheck.rows.length > 0) {
        return c.json({ error: 'Este email já está cadastrado' }, 409);
      }
    }

    // Build update query dynamically
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (name !== undefined) { updates.push(`name = $${paramIndex++}`); values.push(name.trim()); }
    if (email !== undefined) { updates.push(`email = $${paramIndex++}`); values.push(email.toLowerCase().trim()); }
    if (role !== undefined) { updates.push(`role = $${paramIndex++}`); values.push(role); }
    if (modules !== undefined) { updates.push(`modules = $${paramIndex++}`); values.push(modules); }
    if (active !== undefined) { updates.push(`active = $${paramIndex++}`); values.push(active); }

    // Hash new password if provided
    if (password && password.length >= 6) {
      const hash = await bcrypt.hash(password, 10);
      updates.push(`password_hash = $${paramIndex++}`);
      values.push(hash);
    }

    if (updates.length === 0) {
      return c.json({ error: 'Nenhum campo para atualizar' }, 400);
    }

    values.push(id);
    const result = await pool.query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramIndex}
       RETURNING id, name, email, role, modules, active, created_at, updated_at`,
      values
    );

    return c.json(result.rows[0]);
  } catch (error) {
    console.error('Update user error:', error);
    return c.json({ error: 'Erro ao atualizar usuário' }, 500);
  }
});

// DELETE /api/users/:id — Deactivate user (admin only)
usersRouter.delete('/:id', requireAdmin, async (c) => {
  try {
    const { id } = c.req.param();

    // Don't allow deleting yourself
    const user = c.get('user') as any;
    if (user?.id === id) {
      return c.json({ error: 'Não é possível desativar seu próprio usuário' }, 400);
    }

    const result = await pool.query(
      `UPDATE users SET active = false WHERE id = $1
       RETURNING id, name, email, role, modules, active`,
      [id]
    );

    if (result.rows.length === 0) {
      return c.json({ error: 'Usuário não encontrado' }, 404);
    }

    return c.json({ message: 'Usuário desativado', user: result.rows[0] });
  } catch (error) {
    console.error('Delete user error:', error);
    return c.json({ error: 'Erro ao desativar usuário' }, 500);
  }
});

export default usersRouter;

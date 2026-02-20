import { Hono } from 'hono';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db/connection.js';
import dotenv from 'dotenv';

dotenv.config();

const authRouter = new Hono();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
const JWT_EXPIRES_IN = '8h';

// POST /api/auth/login
authRouter.post('/login', async (c) => {
  try {
    const { email, password } = await c.req.json();

    if (!email || !password) {
      return c.json({ error: 'Email e senha são obrigatórios' }, 400);
    }

    // Find user by email
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND active = true',
      [email.toLowerCase().trim()]
    );

    if (result.rows.length === 0) {
      return c.json({ error: 'Email ou senha inválidos' }, 401);
    }

    const user = result.rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return c.json({ error: 'Email ou senha inválidos' }, 401);
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        modules: user.modules,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return c.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        modules: user.modules,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return c.json({ error: 'Erro interno ao realizar login' }, 500);
  }
});

// GET /api/auth/me — Get current user from token
authRouter.get('/me', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return c.json({ error: 'Token não fornecido' }, 401);
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    // Fetch fresh user data from DB
    const result = await pool.query(
      'SELECT id, name, email, role, modules, active FROM users WHERE id = $1',
      [decoded.id]
    );

    if (result.rows.length === 0 || !result.rows[0].active) {
      return c.json({ error: 'Usuário não encontrado ou inativo' }, 401);
    }

    const user = result.rows[0];
    return c.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        modules: user.modules,
      },
    });
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return c.json({ error: 'Token inválido ou expirado' }, 401);
    }
    console.error('Auth/me error:', error);
    return c.json({ error: 'Erro interno' }, 500);
  }
});

export default authRouter;

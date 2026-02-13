import { createMiddleware } from 'hono/factory';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

// Extend Hono variables to include user
declare module 'hono' {
  interface ContextVariableMap {
    user: {
      id: string;
      name: string;
      email: string;
      role: 'ADMIN' | 'USER';
      modules: string[];
    };
  }
}

export const authMiddleware = createMiddleware(async (c, next) => {
  const authHeader = c.req.header('Authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'Token não fornecido' }, 401);
  }

  try {
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    c.set('user', {
      id: decoded.id,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role,
      modules: decoded.modules || [],
    });

    return await next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return c.json({ error: 'Token expirado' }, 401);
    }
    return c.json({ error: 'Token inválido' }, 401);
  }
});

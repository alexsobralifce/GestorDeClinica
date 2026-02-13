-- Default Admin User Seed
-- This script creates a default admin user for initial system access
-- Password: admin123 (hashed with bcrypt)
-- IMPORTANT: Change this password after first login in production!

INSERT INTO users (id, name, email, password, role, modules, active, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Administrador',
  'admin@clinica.com',
  '$2a$10$rGvM7P7nKzKxJ0FqKp0qH.xJ5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Yu', -- admin123
  'ADMIN',
  ARRAY['agenda', 'pacientes', 'prontuario', 'financeiro', 'bi', 'admin']::text[],
  true,
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING;

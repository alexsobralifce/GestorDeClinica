import pool from '../connection';
import bcrypt from 'bcryptjs';

/**
 * Seed default admin user
 * Email: admin@clinica.com
 * Password: admin123
 * 
 * IMPORTANT: This should only be used for initial setup.
 * Change the password immediately after first login in production!
 */
export async function seedDefaultAdmin() {
  try {
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const result = await pool.query(
      `INSERT INTO users (id, name, email, password, role, modules, active, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
       ON CONFLICT (email) DO NOTHING
       RETURNING id`,
      [
        '00000000-0000-0000-0000-000000000001',
        'Administrador',
        'admin@clinica.com',
        hashedPassword,
        'ADMIN',
        ['agenda', 'pacientes', 'prontuario', 'financeiro', 'bi', 'admin'],
        true
      ]
    );

    if (result.rowCount && result.rowCount > 0) {
      console.log('✅ Default admin user created: admin@clinica.com');
      console.log('⚠️  IMPORTANT: Change the default password in production!');
    } else {
      console.log('ℹ️  Default admin user already exists');
    }
  } catch (error) {
    console.error('❌ Error creating default admin user:', error);
    throw error;
  }
}

// Run if called directly (ESM compatible)
import { fileURLToPath } from 'url';

const isMainModule = process.argv[1] === fileURLToPath(import.meta.url);

if (isMainModule) {
  seedDefaultAdmin()
    .then(() => {
      console.log('Seeding complete');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}

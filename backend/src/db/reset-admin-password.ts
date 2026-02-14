import pg from 'pg';
import bcrypt from 'bcryptjs';

const { Pool } = pg;

async function resetAdminPassword() {
  // 1. Get connection string from args or env
  const connectionString = process.argv[2] || process.env.DATABASE_URL;

  if (!connectionString) {
    console.error('❌ Error: No connection string provided.');
    console.error('   Usage: npx tsx src/db/reset-admin-password.ts "postgresql://..."');
    process.exit(1);
  }

  // 2. Create a specific pool for this operation
  const pool = new Pool({
    connectionString,
    ssl: connectionString.includes('localhost') ? false : { rejectUnauthorized: false }
  });

  const email = 'admin@clinica.com';
  const newPassword = 'admin123';

  console.log(`🔌 Connecting to: ${connectionString.replace(/:[^:@]+@/, ':****@')}`);
  console.log(`🔐 Resetting password for ${email}...`);

  try {
    const client = await pool.connect();

    // Generate new hash
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user
    const result = await client.query(
      `UPDATE users 
       SET password_hash = $1, updated_at = NOW() 
       WHERE email = $2
       RETURNING id, name, email`,
      [hashedPassword, email]
    );

    if (result.rowCount === 0) {
      console.log('❌ User not found! Creating default admin...');
      // If user doesn't exist, create it (fallback)
      await client.query(
        `INSERT INTO users (name, email, password_hash, role, modules, active)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          'Administrador',
          email,
          hashedPassword,
          'ADMIN',
          ['agenda', 'pacientes', 'prontuario', 'financeiro', 'bi', 'admin'],
          true
        ]
      );
      console.log('✅ Default admin created successfully.');
    } else {
      console.log('✅ Password updated successfully!');
      console.log('   User:', result.rows[0]);
    }

    console.log(`\n🔑 New Credentials:`);
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${newPassword}`);

    client.release();

  } catch (error: any) {
    console.error('❌ Error resetting password:', error.message);
  } finally {
    await pool.end();
  }
}

resetAdminPassword();

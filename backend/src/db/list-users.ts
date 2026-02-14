import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

dotenv.config();

// Ensure we are using the connection string provided in arguments or .env
const connectionString = process.argv[2] || process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ No connection string provided!');
  console.error('   Usage: npx tsx src/db/list-users.ts "postgresql://..."');
  console.error('   Or set DATABASE_URL in .env');
  process.exit(1);
}

const pool = new pg.Pool({
  connectionString,
  ssl: connectionString.includes('localhost') ? false : { rejectUnauthorized: false },
});

async function listUsers() {
  try {
    console.log(`🔌 Connecting to database...`);
    const client = await pool.connect();

    console.log('✅ Connected successfully!');
    console.log('\n👥 Fetching registered users...');

    const res = await client.query(`
      SELECT id, name, email, role, created_at 
      FROM users 
      ORDER BY created_at DESC
    `);

    if (res.rows.length === 0) {
      console.log('   (No users found in the database)');
    } else {
      console.table(res.rows);
    }

    client.release();
  } catch (err: any) {
    console.error('❌ Error fetching users:', err.message);
  } finally {
    await pool.end();
  }
}

listUsers();

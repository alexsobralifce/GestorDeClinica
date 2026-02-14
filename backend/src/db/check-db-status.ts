import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Ensure we are using the connection string provided in arguments or .env
const connectionString = process.argv[2] || process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ No connection string provided!');
  console.error('   Usage: npx tsx src/db/check-db-status.ts "postgresql://..."');
  console.error('   Or set DATABASE_URL in .env');
  process.exit(1);
}

const pool = new pg.Pool({
  connectionString: connectionString as string,
  ssl: connectionString.includes('localhost') ? false : { rejectUnauthorized: false },
});

async function checkDb() {
  try {
    console.log(`🔌 Connecting to: ${connectionString.replace(/:[^:@]+@/, ':****@')}`);
    const client = await pool.connect();
    console.log('✅ Connection established successfully!');

    // Check current database name
    const resDb = await client.query('SELECT current_database()');
    console.log(`📂 Connected to database: ${resDb.rows[0].current_database}`);

    // List all tables
    console.log('\n📋 Listing tables in public schema...');
    const resTables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    if (resTables.rows.length === 0) {
      console.log('   (No tables found - Database is empty)');
    } else {
      resTables.rows.forEach(row => {
        console.log(`   - ${row.table_name}`);
      });
    }

    client.release();
  } catch (err: any) {
    console.error('❌ Connection failed:', err.message);
    if (err.code === 'ENOTFOUND') {
      console.error('   👉 Host not found. Check if the URL is correct.');
    } else if (err.code === '28P01') {
      console.error('   👉 Authentication failed. Check username/password.');
    }
  } finally {
    await pool.end();
  }
}

checkDb();

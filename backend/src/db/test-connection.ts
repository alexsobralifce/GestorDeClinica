import pool from './connection.js';

async function testConnection() {
  try {
    console.log('🔍 Testing database connection...');

    const client = await pool.connect();
    console.log('✅ Connected to database');

    const result = await client.query('SELECT NOW()');
    console.log('✅ Query executed successfully');
    console.log('📅 Server time:', result.rows[0].now);

    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    console.log('\n📊 Tables in database:');
    tablesResult.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });

    client.release();
    console.log('\n✅ Database connection test passed!');

    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection test failed:', error);
    process.exit(1);
  }
}

testConnection();

import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Validate required environment variables
function validateEnvironment() {
  const errors: string[] = [];

  if (!process.env.DATABASE_URL) {
    errors.push('DATABASE_URL is not set');
  }

  if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
    errors.push('JWT_SECRET is required in production');
  }

  if (process.env.NODE_ENV === 'production' && process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    errors.push('JWT_SECRET must be at least 32 characters long in production');
  }

  if (errors.length > 0) {
    console.error('❌ Environment validation failed:');
    errors.forEach(err => console.error(`   - ${err}`));
    console.error('\n💡 Tips:');
    console.error('   - Make sure DATABASE_URL is set in Railway Variables');
    console.error('   - Copy the exact connection string from PostgreSQL service → Connect tab');
    console.error('   - Generate JWT_SECRET with: openssl rand -base64 64');
    throw new Error('Missing required environment variables');
  }
}

// Run validation in production
if (process.env.NODE_ENV === 'production') {
  validateEnvironment();
}

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres123@localhost:5432/gestor_clinica';

// Log connection info (hide password for security)
const maskedUrl = connectionString.replace(/:[^:@]+@/, ':****@');
console.log(`🔌 Connecting to database: ${maskedUrl}`);

const pool = new Pool({
  connectionString,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
  // Connection pool settings
  max: 20, // Maximum number of clients in pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 10000, // Return error after 10 seconds if can't connect
});

// Test connection immediately
pool.on('connect', () => {
  console.log('✅ Database connected successfully');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected database error:', err);
  if (err.message.includes('password authentication failed')) {
    console.error('\n💡 DATABASE_URL password is incorrect!');
    console.error('   Go to Railway → PostgreSQL service → Connect tab');
    console.error('   Copy the EXACT "Postgres Connection URL" and set it as DATABASE_URL in backend service');
  }
});

export default pool;

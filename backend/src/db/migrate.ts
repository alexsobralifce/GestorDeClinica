import fs from 'fs';
import path from 'path';
import pool from './connection';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function migrate() {
  const client = await pool.connect();

  try {
    console.log('Starting migration...');

    // Create migrations table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Get list of executed migrations
    const { rows: executedMigrations } = await client.query(
      'SELECT name FROM migrations'
    );
    const executedMigrationNames = new Set(executedMigrations.map((row) => row.name));

    // Get list of migration files
    const migrationsDir = path.join(__dirname, 'migrations');
    const migrationFiles = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith('.sql'))
      .sort();

    for (const file of migrationFiles) {
      if (!executedMigrationNames.has(file)) {
        console.log(`Executing migration: ${file}`);

        const filePath = path.join(migrationsDir, file);
        const sql = fs.readFileSync(filePath, 'utf8');

        try {
          await client.query('BEGIN');
          await client.query(sql);
          await client.query(
            'INSERT INTO migrations (name) VALUES ($1)',
            [file]
          );
          await client.query('COMMIT');
          console.log(`✅ Migration ${file} executed successfully.`);
        } catch (err) {
          await client.query('ROLLBACK');
          console.error(`❌ Error executing migration ${file}:`, err);
          throw err;
        }
      } else {
        console.log(`Skipping already executed migration: ${file}`);
      }
    }

    console.log('All migrations completed successfully.');
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();

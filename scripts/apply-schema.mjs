import { readFile } from 'node:fs/promises';
import { Client } from 'pg';
import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const schemaPath = path.resolve(__dirname, '../db/schema.sql');

const sql = await readFile(schemaPath, 'utf8');

const connectionString = process.env.DATABASE_URL;

const client = connectionString
  ? new Client({ connectionString, ssl: { rejectUnauthorized: false } })
  : new Client({
      host: 'db.cojrmycyagfosqpxyswd.supabase.co',
      port: 5432,
      database: 'postgres',
      user: 'postgres',
      password: 'CGBindia!@#123',
      ssl: { rejectUnauthorized: false }
    });

console.log('Applying schema from', schemaPath);

try {
  await client.connect();
  await client.query(sql);
  console.log('Schema applied successfully');
} catch (error) {
  console.error('Failed to apply schema');
  console.error(error);
  process.exitCode = 1;
} finally {
  await client.end();
}

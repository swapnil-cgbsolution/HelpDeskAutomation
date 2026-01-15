import { Pool, QueryResultRow } from 'pg';
import { env } from '../config/env';

export const pool = new Pool({
  connectionString: env.databaseUrl,
  ssl: { rejectUnauthorized: false }
});

export const query = async <T extends QueryResultRow = QueryResultRow>(text: string, params: unknown[] = []) => {
  const result = await pool.query<T>(text, params);
  return result.rows;
};

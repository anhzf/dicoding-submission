import { Pool, type PoolConfig } from 'pg';

const testConfig: PoolConfig = {
  host: import.meta.env.VITE_PGHOST_TEST,
  port: Number(import.meta.env.VITE_PGPORT_TEST) || 5432,
  user: import.meta.env.VITE_PGUSER_TEST,
  password: import.meta.env.VITE_PGPASSWORD_TEST,
  database: import.meta.env.VITE_PGDATABASE_TEST,
};

const pool = import.meta.env.NODE_ENV === 'test'
  ? new Pool(testConfig)
  : new Pool();

export default pool;

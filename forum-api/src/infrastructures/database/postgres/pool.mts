import pg from 'pg';

const pool = new pg.Pool({
  connectionString: process.env.PG_CONNECTION_STRING,
});

export default pool;

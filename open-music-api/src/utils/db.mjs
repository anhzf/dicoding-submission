import pg from 'pg';
import config from '../config.mjs';

export const getPool = () => new pg.Pool({
  host: config.pg.host,
  port: config.pg.port,
  user: config.pg.user,
  password: config.pg.password,
  database: config.pg.database,
});

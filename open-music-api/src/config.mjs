import dotenv from 'dotenv';

dotenv.config();

const config = Object.freeze({
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || 9000,

  pg: {
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
  },

  accessTokenKey: process.env.ACCESS_TOKEN_KEY,
  refreshTokenKey: process.env.REFRESH_TOKEN_KEY,
  // in seconds
  tokenMaxAge: process.env.TOKEN_MAX_AGE || 3600,

  authStrategy: 'default',
});

export default config;

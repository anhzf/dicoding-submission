import dotenv from 'dotenv';

dotenv.config();

const config = Object.freeze({
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || 9000,

  pg: {
    /** @type {string} */
    host: process.env.PGHOST,
    /** @type {number} */
    port: process.env.PGPORT,
    /** @type {string} */
    user: process.env.PGUSER,
    /** @type {string} */
    password: process.env.PGPASSWORD,
    /** @type {string} */
    database: process.env.PGDATABASE,
  },

  accessTokenKey: process.env.ACCESS_TOKEN_KEY,
  refreshTokenKey: process.env.REFRESH_TOKEN_KEY,
  // in seconds
  tokenMaxAge: process.env.TOKEN_MAX_AGE || 3600,

  auth: { strategy: 'default' },

  rabbitMq: {
    /** @type {string} */
    server: process.env.RABBITMQ_SERVER,
  },

  redis: {
    server: process.env.REDIS_SERVER,
  },
});

export default config;

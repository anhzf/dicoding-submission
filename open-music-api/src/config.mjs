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
});

export default config;

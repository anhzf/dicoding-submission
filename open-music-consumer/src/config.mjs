import dotenv from 'dotenv';

dotenv.config();

const config = {
  pg: {
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
  },

  rabbitMq: {
    server: process.env.RABBITMQ_SERVER,
  },

  mail: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
    from: `Open Music <${process.env.SMTP_USER}>`,
  },
};

export default config;

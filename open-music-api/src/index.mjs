import dotenv from 'dotenv';
import consola from 'consola';
import { createServer } from './server.mjs';

dotenv.config();

process.on('unhandledRejection', (err) => {
  consola.error(err);
  process.exit(1);
});

createServer();

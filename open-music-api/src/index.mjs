import consola from 'consola';
import { createServer } from './server.mjs';

process.on('unhandledRejection', (err) => {
  consola.error(err);
  process.exit(1);
});

createServer();

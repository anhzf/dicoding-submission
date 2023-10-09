import { createServer } from './server.mjs';

createServer();

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

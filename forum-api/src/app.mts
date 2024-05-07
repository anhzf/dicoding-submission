import { configDotenv } from 'dotenv';
import createServer from './infrastructures/http/createServer.mjs';
import container from './infrastructures/container.mjs';

configDotenv();

(async () => {
  const server = await createServer(container);
  await server.start();
  console.log(`server start at ${server.info.uri}`);
})();

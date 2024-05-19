/* c8 ignore start */
import 'dotenv/config';
import container from './infrastructures/container.mjs';
import createServer from './infrastructures/http/createServer.mjs';

(async () => {
  const server = await createServer(container);
  await server.start();

  console.log(`server start at ${server.info.uri}`);
})();
/* c8 ignore stop */

import Hapi from '@hapi/hapi';
import config from './config.mjs';
import { routes } from './routes.mjs';

export const createServer = async () => {
  const server = Hapi.server({
    port: config.port,
    host: config.host,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  server.route(routes);

  await server.start();

  console.log('Server running on %s', server.info.uri);

  return server;
};

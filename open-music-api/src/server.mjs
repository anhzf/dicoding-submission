import Hapi from '@hapi/hapi';
import config from './config.mjs';
import { AlbumPlugin, AlbumPsqlService } from './modules/album/index.mjs';
import { SongPlugin, SongPsqlService } from './modules/song/index.mjs';

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

  await server.register({
    plugin: AlbumPlugin,
    options: {
      service: new AlbumPsqlService(),
    },
  });

  await server.register({
    plugin: SongPlugin,
    options: {
      service: new SongPsqlService(),
    },
  });

  await server.start();

  // eslint-disable-next-line no-console
  console.log('Server running on %s', server.info.uri);

  return server;
};

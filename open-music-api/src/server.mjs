import Hapi from '@hapi/hapi';
import { consola } from 'consola';
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

  const albumService = new AlbumPsqlService();
  const songService = new SongPsqlService();

  await server.register([{
    plugin: AlbumPlugin,
    options: {
      service: albumService,
      songService,
    },
  }, {
    plugin: SongPlugin,
    options: {
      service: songService,
    },
  }]);

  await server.start();

  consola.box('Server running on %s', server.info.uri);

  return server;
};

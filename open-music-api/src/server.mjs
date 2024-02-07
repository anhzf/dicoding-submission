import Hapi from '@hapi/hapi';
import config from './config.mjs';
import { AlbumPlugin, AlbumPsqlService } from './modules/album/index.mjs';
import { SongPlugin, SongPsqlService } from './modules/song/index.mjs';
import { consola } from './utils/terminal.mjs';

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

  server.ext('onPreResponse', (req, h) => {
    const { response } = req;

    if (response instanceof Error) {
      consola.error(response);
      consola.debug(response);

      return h.response({
        status: 'fail',
        message: response.message || 'Terjadi kegagalan pada server',
      }).code(response.statusCode || 500);
    }

    return h.continue;
  });

  await server.start();

  consola.box('Server running on %s', server.info.uri);

  return server;
};

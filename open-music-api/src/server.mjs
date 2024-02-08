import Hapi from '@hapi/hapi';
import { plugin as JwtPlugin } from '@hapi/jwt';
import config from './config.mjs';
import { AlbumPlugin, AlbumPsqlService } from './modules/album/index.mjs';
import { AuthPlugin, AuthPsqlService } from './modules/auth/index.mjs';
import { SongPlugin, SongPsqlService } from './modules/song/index.mjs';
import { TokenManager } from './modules/tokenize/index.mjs';
import { UserPlugin, UserPsqlService } from './modules/user/index.mjs';
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

  await server.register([
    { plugin: JwtPlugin },
  ]);

  server.auth.strategy('default', 'jwt', {
    keys: config.accessTokenKey,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: config.tokenMaxAge,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  const albumService = new AlbumPsqlService();
  const songService = new SongPsqlService();
  const userService = new UserPsqlService();
  const authService = new AuthPsqlService();

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
  }, {
    plugin: UserPlugin,
    options: {
      service: userService,
    },
  }, {
    plugin: AuthPlugin,
    options: {
      service: authService,
      userService,
      tokenManager: TokenManager,
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

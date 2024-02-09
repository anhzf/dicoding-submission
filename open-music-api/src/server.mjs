import Hapi from '@hapi/hapi';
import { plugin as JwtPlugin } from '@hapi/jwt';
import config from './config.mjs';
import ClientError from './errors/client.mjs';
import { AlbumPlugin, AlbumPsqlService } from './modules/album/index.mjs';
import { AuthPlugin, AuthPsqlService } from './modules/auth/index.mjs';
import { PlaylistPlugin, PlaylistPsqlService } from './modules/playlist/index.mjs';
import { SongPlugin, SongPsqlService } from './modules/song/index.mjs';
import { TokenManager } from './modules/tokenize/index.mjs';
import { UserPlugin, UserPsqlService } from './modules/user/index.mjs';
import { consola } from './utils/terminal.mjs';
import { PlaylistCollaborationPsqlService } from './modules/playlist-collaborations/index.mjs';

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

  const authService = new AuthPsqlService();
  const collaborationService = new PlaylistCollaborationPsqlService();
  const playlistService = new PlaylistPsqlService(collaborationService);
  const albumService = new AlbumPsqlService();
  const songService = new SongPsqlService();
  const userService = new UserPsqlService();

  await server.register([{
    plugin: AuthPlugin,
    options: {
      service: authService,
      userService,
      tokenManager: TokenManager,
    },
  }, {
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
    plugin: PlaylistPlugin,
    options: {
      service: playlistService,
    },
  }]);

  server.ext('onPreResponse', (req, h) => {
    const { response } = req;

    if (response instanceof ClientError) {
      return h.response({
        status: 'fail',
        message: response.message || 'Terjadi kegagalan pada server',
      }).code(response.statusCode || 400);
    }

    if (response instanceof Error) {
      return h.response({
        status: 'fail',
        message: response.message || 'Terjadi kegagalan pada server',
      }).code(response.output.statusCode || 500);
    }

    return h.continue;
  });

  await server.start();

  consola.box('Server running on %s', server.info.uri);

  return server;
};
import Hapi from '@hapi/hapi';
import { plugin as InertPlugin } from '@hapi/inert';
import { plugin as JwtPlugin } from '@hapi/jwt';
import config from './config.mjs';
import ClientError from './errors/client.mjs';
import { AlbumPlugin, AlbumPsqlService } from './modules/album/index.mjs';
import { AuthPlugin, AuthPsqlService } from './modules/auth/index.mjs';
import MessagingRabbitMqService from './modules/messaging/service-rabbitmq.mjs';
import {
  PlaylistCollaborationPlugin, PlaylistCollaborationPsqlService,
} from './modules/playlist-collaboration/index.mjs';
import PlaylistExportPlugin from './modules/playlist-export/plugin.mjs';
import { PlaylistPlugin, PlaylistPsqlService } from './modules/playlist/index.mjs';
import { SongPlugin, SongPsqlService } from './modules/song/index.mjs';
import { TokenManager } from './modules/tokenize/index.mjs';
import { UserPlugin, UserPsqlService } from './modules/user/index.mjs';
import { consola } from './utils/terminal.mjs';
import { StorageLocalService } from './modules/storage/index.mjs';
import { CacheRedisService } from './modules/caching/index.mjs';

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
    { plugin: InertPlugin },
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

  const cacheService = new CacheRedisService();
  const storageService = new StorageLocalService();
  const messagingService = MessagingRabbitMqService;
  const authService = new AuthPsqlService();
  const collaborationService = new PlaylistCollaborationPsqlService();
  const playlistService = new PlaylistPsqlService(collaborationService);
  const albumService = new AlbumPsqlService(storageService);
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
      cacheService,
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
  }, {
    plugin: PlaylistCollaborationPlugin,
    options: {
      service: collaborationService,
      playlistService,
    },
  }, {
    plugin: PlaylistExportPlugin,
    options: {
      playlistService,
      messagingService,
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

import Handler from './handler.mjs';
import routes from './routes.mjs';

/**
 * @typedef {import('./types').PlaylistPluginOptions} PluginOptions
 */

/** @type {import('@hapi/hapi').Plugin<PluginOptions>} */
const PlaylistPlugin = {
  name: 'Playlist',
  version: '0.1.0',
  register: async (server, { service, cacheService }) => {
    const handler = new Handler(service, cacheService);
    server.route(routes(handler));
  },
};

export default PlaylistPlugin;

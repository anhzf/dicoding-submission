import AlbumHandler from './handler.mjs';
import routes from './routes.mjs';

/**
 * @typedef {import('./types').AlbumPluginOptions} AlbumPluginOptions
 */

/** @type {import('@hapi/hapi').Plugin<AlbumPluginOptions>} */
const AlbumPlugin = {
  name: 'album',
  version: '0.1.0',
  register: async (server, { service, ...options }) => {
    /** @type {import('../../types').Handlers} */
    const handler = new AlbumHandler(service, options);
    server.route(routes(handler));
  },
};

export default AlbumPlugin;

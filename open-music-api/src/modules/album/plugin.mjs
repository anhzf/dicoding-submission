import routes from './routes.mjs';

/**
 * @typedef {import('./types').AlbumPluginOptions} AlbumPluginOptions
 */

import AlbumHandler from './handler.mjs';

/** @type {import('@hapi/hapi').Plugin<AlbumPluginOptions>} */
const AlbumPlugin = {
  name: 'album',
  version: '0.1.0',
  register: async (server, { service }) => {
    /** @type {import('../../types').Handlers} */
    const handler = new AlbumHandler(service);
    server.route(routes(handler));
  },
};

export default AlbumPlugin;

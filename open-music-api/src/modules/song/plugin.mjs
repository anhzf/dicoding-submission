import SongHandler from './handler.mjs';
import routes from './routes.mjs';

/**
 * @typedef {import('./types').SongPluginOptions} SongPluginOptions
 */

/** @type {import('@hapi/hapi').Plugin<SongPluginOptions>} */
const SongPlugin = {
  name: 'Song',
  version: '0.1.0',
  register: async (server, { service }) => {
    /** @type {import('../../types').Handlers} */
    const handler = new SongHandler(service);
    server.route(routes(handler));
  },
};

export default SongPlugin;

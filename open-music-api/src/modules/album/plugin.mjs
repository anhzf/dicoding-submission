import routes from './routes.mjs';

/**
 * @typedef {import('./types').AlbumPluginOptions} AlbumPluginOptions
 */

import { consola } from '../../utils/terminal.mjs';
import AlbumHandler from './handler.mjs';

/** @type {import('@hapi/hapi').Plugin<AlbumPluginOptions>} */
const AlbumPlugin = {
  name: 'album',
  version: '0.1.0',
  register: async (server, { service, ...options }) => {
    /** @type {import('../../types').Handlers} */
    const handler = new AlbumHandler(service, options);
    server.route(routes(handler)
      .map((route) => ({
        ...route,
        handler: (req, h, ...args) => Promise.resolve(route.handler(req, h, ...args))
          // eslint-disable-next-line no-sequences
          .catch((err) => (consola.debug(err, { ...err }), h.response({
            status: 'fail',
            message: err.message,
          }).code(err.statusCode || 500))),
      })));
  },
};

export default AlbumPlugin;

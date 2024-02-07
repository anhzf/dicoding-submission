import SongHandler from './handler.mjs';
import routes from './routes.mjs';
import { consola } from '../../utils/terminal.mjs';

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
    server.route(routes(handler)
      .map((route) => ({
        ...route,
        handler: (req, h, ...args) => Promise.resolve(route.handler(req, h, args))
          // eslint-disable-next-line no-sequences
          .catch((err) => (consola.debug(err, { ...err }), h.response({
            status: 'fail',
            message: err.message,
          }).code(err.statusCode || 500))),
      })));
  },
};

export default SongPlugin;

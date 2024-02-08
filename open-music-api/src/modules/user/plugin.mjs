import UserHandler from './handler.mjs';
import routes from './routes.mjs';

/**
 * @typedef {import('./types').UserPluginOptions} PluginOptions
 */

/** @type {import('@hapi/hapi').Plugin<PluginOptions>} */
const UserPlugin = {
  name: 'user',
  version: '0.1.0',
  register: async (server, { service, ...options }) => {
    /** @type {import('../../types').Handlers} */
    const handler = new UserHandler(service, options);
    server.route(routes(handler));
  },
};

export default UserPlugin;

import Handler from './handler.mjs';
import routes from './routes.mjs';

/**
 * @typedef {import('./types').AuthPluginOptions} PluginOptions
 */

/** @type {import('@hapi/hapi').Plugin<PluginOptions>} */
const AuthPlugin = {
  name: 'auth',
  version: '0.1.0',
  register: async (server, { service, ...options }) => {
    /** @type {import('./types').AuthHandler} */
    const handler = new Handler(service, options);
    server.route(routes(handler));
  },
};

export default AuthPlugin;

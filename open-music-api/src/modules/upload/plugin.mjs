import routes from './routes.mjs';

/**
 * @typedef {import('./types').UploadPluginOptions} PluginOptions
 */

/** @type {import('@hapi/hapi').Plugin<PluginOptions>} */
const UploadPlugin = {
  name: 'upload',
  version: '0.1.0',
  register: async (server, { storageService }) => {
    server.route(routes(storageService));
  },
};

export default UploadPlugin;

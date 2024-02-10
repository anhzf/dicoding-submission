import Handler from './handler.mjs';
import routes from './routes.mjs';

/**
 * @typedef {import('./types').PlaylistExportPluginOptions} PluginOptions
 */

/** @type {import('@hapi/hapi').Plugin<PluginOptions>} */
const PlaylistExportPlugin = {
  name: 'PlaylistExport',
  version: '0.1.0',
  register: async (server, { playlistService, messagingService }) => {
    const handler = new Handler(playlistService, messagingService);
    server.route(routes(handler));
  },
};

export default PlaylistExportPlugin;

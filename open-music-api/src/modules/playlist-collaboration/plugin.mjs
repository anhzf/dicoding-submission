import Handler from './handler.mjs';
import routes from './routes.mjs';

/**
 * @typedef {import('./types').PlaylistCollaborationPluginOptions} PluginOptions
 */

/** @type {import('@hapi/hapi').Plugin<PluginOptions>} */
const PlaylistCollaborationPlugin = {
  name: 'PlaylistCollaboration',
  version: '0.1.0',
  register: async (server, { service, playlistService }) => {
    const handler = new Handler(service, playlistService);
    server.route(routes(handler));
  },
};

export default PlaylistCollaborationPlugin;

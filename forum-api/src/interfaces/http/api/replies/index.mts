import type { Plugin } from '@hapi/hapi';
import type { Container } from '../../../../infrastructures/container.mjs';
import RepliesHandler from './handler.mjs';
import RepliesRoutes from './routes.mjs';

const RepliesPlugin: Plugin<{
  container: Container;
}> = {
  name: 'replies',
  register: async (server, { container }) => {
    const handler = new RepliesHandler(container);
    server.route(RepliesRoutes(handler));
  },
};

export default RepliesPlugin;

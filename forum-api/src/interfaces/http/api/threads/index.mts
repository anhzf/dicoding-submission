import type { Plugin } from '@hapi/hapi';
import type { Container } from '../../../../infrastructures/container.mjs';
import ThreadsHandler from './handler.mjs';
import threadsRoutes from './routes.mjs';

const ThreadsPlugin: Plugin<{
  container: Container;
}> = {
  name: 'threads',
  register: async (server, { container }) => {
    const threadHandler = new ThreadsHandler(container);
    server.route(threadsRoutes(threadHandler));
  },
};

export default ThreadsPlugin;

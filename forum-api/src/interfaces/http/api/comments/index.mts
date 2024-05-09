import type { Plugin } from '@hapi/hapi';
import type { Container } from '../../../../infrastructures/container.mjs';
import CommentsHandler from './handler.mjs';
import commentsRoutes from './routes.mjs';

const CommentsPlugin: Plugin<{
  container: Container;
}> = {
  name: 'comments',
  register: async (server, { container }) => {
    const handler = new CommentsHandler(container);
    server.route(commentsRoutes(handler));
  },
};

export default CommentsPlugin;

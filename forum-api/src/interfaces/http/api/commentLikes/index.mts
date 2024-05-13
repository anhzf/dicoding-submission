import type { Plugin } from '@hapi/hapi';
import type { Container } from '../../../../infrastructures/container.mjs';
import CommentLikesHandler from './handler.mjs';
import commentLikesRoutes from './routes.mjs';

const CommentLikesPlugin: Plugin<{
  container: Container;
}> = {
  name: 'commentLikes',
  register: async (server, { container }) => {
    const handler = new CommentLikesHandler(container);
    server.route(commentLikesRoutes(handler));
  },
};

export default CommentLikesPlugin;

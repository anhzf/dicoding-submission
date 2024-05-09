import type RepliesHandler from './handler.mjs';
import { type ServerRoute } from '@hapi/hapi';

const repliesRoutes = (handler: RepliesHandler): ServerRoute[] => [
  {
    method: 'POST',
    path: '/threads/{threadId}/comments/{commentId}/replies',
    handler: handler.post.bind(handler),
    options: {
      auth: 'default',
    },
  },
  {
    method: 'DELETE',
    path: '/threads/{threadId}/comments/{commentId}/replies/{replyId}',
    handler: handler.destroy.bind(handler),
    options: {
      auth: 'default',
    },
  },
];

export default repliesRoutes;

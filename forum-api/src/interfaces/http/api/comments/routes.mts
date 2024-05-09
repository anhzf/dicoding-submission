import type CommentsHandler from './handler.mjs';

const commentsRoutes = (handler: CommentsHandler) => [
  {
    method: 'POST',
    path: '/threads/{threadId}/comments',
    handler: handler.post.bind(handler),
    options: {
      auth: 'default',
    },
  },
  {
    method: 'DELETE',
    path: '/threads/{threadId}/comments/{commentId}',
    handler: handler.destroy.bind(handler),
    options: {
      auth: 'default',
    },
  },
];

export default commentsRoutes;

import type CommentLikesHandler from './handler.mjs';

const commentsRoutes = (handler: CommentLikesHandler) => [
  {
    method: 'PUT',
    path: '/threads/{threadId}/comments/{commentId}/likes',
    handler: handler.put.bind(handler),
    options: {
      auth: 'default',
    },
  },
];

export default commentsRoutes;

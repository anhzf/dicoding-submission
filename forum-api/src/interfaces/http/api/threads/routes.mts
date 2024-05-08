import type ThreadsHandler from './handler.mjs';

const threadsRoutes = (handler: ThreadsHandler) => [
  {
    method: 'POST',
    path: '/threads',
    handler: handler.post.bind(handler),
    options: {
      auth: 'default',
    },
  },
  {
    method: 'GET',
    path: '/threads/{threadId}',
    handler: handler.get.bind(handler),
  },
];

export default threadsRoutes;

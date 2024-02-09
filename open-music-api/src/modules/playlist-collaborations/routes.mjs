/**
 * @param {import('./handler.mjs').default} handler
 * @return {import('@hapi/hapi').ServerRoute[]}
 */
const playlistCollaborationsRoutes = (handler) => [
  {
    method: 'POST',
    path: '/collaborations',
    handler: handler.post.bind(handler),
    options: {
      auth: 'default',
    },
  },
  {
    method: 'DELETE',
    path: '/collaborations',
    handler: handler.delete.bind(handler),
    options: {
      auth: 'default',
    },
  },
];

export default playlistCollaborationsRoutes;

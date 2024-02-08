/**
 * @param {import('./types').AuthHandler} handler
 * @returns {import('@hapi/hapi').ServerRoute[]}
 */
const authRoutes = (handler) => [
  {
    method: 'POST',
    path: '/authentications',
    handler: handler.post.bind(handler),
  },
  {
    method: 'PUT',
    path: '/authentications',
    handler: handler.put.bind(handler),
  },
  {
    method: 'DELETE',
    path: '/authentications',
    handler: handler.destroy.bind(handler),
  },
];

export default authRoutes;

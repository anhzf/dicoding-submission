/**
 * @param {import('./handler.mjs').default} handler
 * @returns {import('@hapi/hapi').ServerRoute[]}
 */
const userRoutes = (handler) => [
  {
    method: 'POST',
    path: '/users',
    handler: handler.signUp.bind(handler),
  },
];

export default userRoutes;

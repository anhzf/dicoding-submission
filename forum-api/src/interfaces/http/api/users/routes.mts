import type UsersHandler from './handler.mjs';

const usersRoutes = (handler: UsersHandler) => ([
  {
    method: 'POST',
    path: '/users',
    handler: handler.post.bind(handler),
  },
]);

export default usersRoutes;

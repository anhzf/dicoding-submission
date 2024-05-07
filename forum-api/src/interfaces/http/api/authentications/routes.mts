import type AuthenticationsHandler from './handler.mjs';

const authenticationRoutes = (handler: AuthenticationsHandler) => ([
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
]);

export default authenticationRoutes;

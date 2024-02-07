const SINGULAR = 'album';
const PLURAL = 'albums';

/**
 * @param {import('../../types').Handlers} handler
 * @returns {import('@hapi/hapi').ServerRoute[]}
 */
const albumRoutes = (handler) => [
  {
    method: 'POST',
    path: `/${PLURAL}`,
    handler: handler.post.bind(handler),
  },
  {
    method: 'GET',
    path: `/${PLURAL}/{${SINGULAR}Id}`,
    handler: handler.get.bind(handler),
  },
  {
    method: 'PUT',
    path: `/${PLURAL}/{${SINGULAR}Id}`,
    handler: handler.put.bind(handler),
  },
  {
    method: 'DELETE',
    path: `/${PLURAL}/{${SINGULAR}Id}`,
    handler: handler.destroy.bind(handler),
  },
];

export default albumRoutes;

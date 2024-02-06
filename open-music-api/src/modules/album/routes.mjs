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
    handler: handler.post,
  },
  {
    method: 'GET',
    path: `/${PLURAL}/{${SINGULAR}Id}`,
    handler: handler.get,
  },
  {
    method: 'PUT',
    path: `/${PLURAL}/{${SINGULAR}Id}`,
    handler: handler.put,
  },
  {
    method: 'DELETE',
    path: `/${PLURAL}/{${SINGULAR}Id}`,
    handler: handler.destroy,
  },
];

export default albumRoutes;

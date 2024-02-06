const SINGULAR = 'song';
const PLURAL = 'songs';

/**
 * @param {import('../../types').Handlers} handler
 * @returns {import('@hapi/hapi').ServerRoute[]}
 */
const songRoutes = (handler) => [
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

export default songRoutes;

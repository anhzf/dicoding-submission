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
    handler: handler.post.bind(handler),
  },
  {
    method: 'GET',
    path: `/${PLURAL}`,
    handler: handler.list.bind(handler),
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

export default songRoutes;

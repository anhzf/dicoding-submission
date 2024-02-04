const NOOP = () => { /*  */ };

/** @type {import('@hapi/hapi').ServerRoute[]} */
export const routes = [
  {
    method: 'GET',
    path: '/albums',
    handler: NOOP,
  },
  {
    method: 'GET',
    path: '/albums/{albumId}',
    handler: NOOP,
  },
  {
    method: 'POST',
    path: '/albums',
    handler: NOOP,
  },
  {
    method: 'PUT',
    path: '/albums/{albumId}',
    handler: NOOP,
  },
  {
    method: 'DELETE',
    path: '/albums/{albumId}',
    handler: NOOP,
  },
  {
    method: 'GET',
    path: '/songs',
    handler: NOOP,
  },
  {
    method: 'GET',
    path: '/songs/{songId}',
    handler: NOOP,
  },
  {
    method: 'POST',
    path: '/songs',
    handler: NOOP,
  },
  {
    method: 'PUT',
    path: '/songs/{songId}',
    handler: NOOP,
  },
  {
    method: 'DELETE',
    path: '/songs/{songId}',
    handler: NOOP,
  },
];

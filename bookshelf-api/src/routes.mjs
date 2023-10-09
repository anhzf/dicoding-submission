import * as BookHandler from './book/handler.mjs';

/** @type {import('@hapi/hapi').ServerRoute[]} */
export const routes = [
  {
    method: 'GET',
    path: '/books',
    handler: BookHandler.list,
  },
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: BookHandler.get,
  },
  {
    method: 'POST',
    path: '/books',
    handler: BookHandler.create,
  },
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: BookHandler.update,
  },
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: BookHandler.remove,
  },
];

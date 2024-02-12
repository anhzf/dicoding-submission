/**
 * @param {import('../storage/types').StorageService} storage
 * @returns {import('@hapi/hapi').ServerRoute[]}
 */
const uploadRoutes = (storage) => [
  {
    method: 'GET',
    path: '/uploads/{param*}',
    handler: {
      directory: {
        path: storage.root,
      },
    },
  },
];

export default uploadRoutes;

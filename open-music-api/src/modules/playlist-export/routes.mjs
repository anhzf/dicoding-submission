/**
 * @param {import('./handler.mjs').default} handler
 * @returns {import('@hapi/hapi').ServerRoute[]}
 */
const playlistExportHandler = (handler) => [
  {
    method: 'POST',
    path: '/export/playlists/{id}',
    handler: handler.post.bind(handler),
    options: { auth: 'default' },
  },
];

export default playlistExportHandler;

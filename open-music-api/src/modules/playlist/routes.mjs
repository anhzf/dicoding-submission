/**
 * @param {import('./handler.mjs').default} handler
 * @returns {import('@hapi/hapi').ServerRoute[]}
 */
const playlistRoutes = (handler) => [
  {
    method: 'POST',
    path: '/playlists',
    handler: handler.post.bind(handler),
    options: { auth: 'default' },
  },
  {
    method: 'GET',
    path: '/playlists',
    handler: handler.list.bind(handler),
    options: { auth: 'default' },
  },
  {
    method: 'DELETE',
    path: '/playlists/{id}',
    handler: handler.destroy.bind(handler),
    options: { auth: 'default' },
  },
  {
    method: 'GET',
    path: '/playlists/{id}/songs',
    handler: handler.listSongs.bind(handler),
    options: { auth: 'default' },
  },
  {
    method: 'POST',
    path: '/playlists/{id}/songs',
    handler: handler.postSong.bind(handler),
    options: { auth: 'default' },
  },
  {
    method: 'DELETE',
    path: '/playlists/{id}/songs',
    handler: handler.destroySong.bind(handler),
    options: { auth: 'default' },
  },
  {
    method: 'GET',
    path: '/playlists/{id}/activities',
    handler: handler.listActivities.bind(handler),
    options: { auth: 'default' },
  },
];

export default playlistRoutes;

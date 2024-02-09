const TABLE_NAME = 'playlist_songs';

/** @param {import('node-pg-migrate').MigrationBuilder} pgm */
exports.up = (pgm) => {
  pgm.createTable(TABLE_NAME, {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: '"playlists"',
      onDelete: 'cascade',
    },
    song_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: '"songs"',
      onDelete: 'cascade',
    },
  });

  pgm.addConstraint(TABLE_NAME, 'unique_playlist_id_and_song_id', {
    unique: ['playlist_id', 'song_id'],
  });
};

exports.down = (pgm) => {
  pgm.dropTable(TABLE_NAME);
};
